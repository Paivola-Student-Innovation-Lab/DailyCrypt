import { useEffect, useRef } from "react"
import usefunctionalityState from "./useFunctionalityState"
import useModal from "./useModal"
import calculateArraySize from "../utils/calculateArraySize"
import eventBus from "../utils/EventBus"
import { useIntl } from "react-intl"

const useMultithreading = () => {
    // Ref defenition
    const workersRef = useRef<Worker[]>([])
    const writeWorkerRef = useRef<Worker>()
    const writeWorkerReadyRef = useRef(true)
    const writeWorkerQueRef = useRef<[id:number, arr: Uint8Array][]>([])
    const writeChunkSizeRef = useRef(4000000)
    const isPausedRef = useRef(false)

    // Hook defenition
    const {reset, fileStore, updateProgress} = usefunctionalityState(state => ({reset: state.reset,fileStore: state.filestore, updateProgress: state.updateProgress}))
    const makeModal = useModal(state => state.makeModal)
    const translate = useIntl().formatMessage
    
    // Pause crypting
    const handlePause = () => {
        isPausedRef.current = !isPausedRef.current
        for(const worker of workersRef.current){
            worker.postMessage(isPausedRef.current? "pause" : "unpause")
        }
          if (!isPausedRef.current && writeWorkerRef.current !== undefined) {
            writeWorkerRef.current.postMessage("start")
          }
      }

    const handleStop = () => {
        //clear worker memory
        for(const worker of workersRef.current){
            worker.postMessage("clear")
        }
    }
    // Recieve pause and stop eventbus
    useEffect(() => {
        eventBus.on("pause", handlePause)
        eventBus.on("stop", handleStop)
        return () => {
          eventBus.remove("pause", () => {})
        }
      }, []);

    const createWorkers = (workerAmount: number) => {
        for(let i = 0; i < workerAmount; i++){
            // Define worker
            const worker = new Worker(new URL("../utils/cryptWorker.ts", import.meta.url), {type: "module"})
            worker.onmessage = (message) => {
                
                // Handle incorrect password
                if (message.data[1].length === 0) { // Check for aead::Error on rustend
                    handleStop()
                    reset()
                    makeModal(translate({id: "wrong_password"}), translate({id: "wrong_password_text"}))
                    return
                }
                // If writeworker isn't currently writing anything send chunk to it
                if(writeWorkerReadyRef.current && writeWorkerRef.current){
                    writeWorkerReadyRef.current = false
                    writeWorkerRef.current.postMessage([message.data[1], message.data[0]*writeChunkSizeRef.current, fileStore])
                }
                // Add chunk to the que
                else{
                    writeWorkerQueRef.current.push(message.data)
                }
            }
            workersRef.current.push(worker)
        }
    }
    
    const cryptFiles = async(files: (Blob|Uint8Array)[], password: string, encrypting: boolean) => {
        // Reset values
        writeWorkerReadyRef.current = true
        writeWorkerQueRef.current = []
        isPausedRef.current = false

        // Variable defenition
        writeChunkSizeRef.current = encrypting ? 4000016 : 4000000; // Encrypted chunks are 16 bytes larger than non-encrypted ones
        const chunkSize = encrypting ? 4000000 : 4000016
        const fileSize = calculateArraySize(files)
        const totalChunks = Math.ceil(fileSize / chunkSize);
        let workersPaused = false
        let i = 1

        const workerAmount = 5

        if (workerAmount > workersRef.current.length) {
            // Create the needed amount of workers
	    createWorkers(workerAmount-workersRef.current.length)
    	    // Wait for workers to load 
	    await new Promise( res => setTimeout(res, 1000) )
	    }
            
        else{
            // Remove useless workers
            while(workerAmount !== workersRef.current.length){

                workersRef.current.pop
            }
        }
        if(!writeWorkerRef.current){
            // Define writeworker
            writeWorkerRef.current = new Worker(new URL("../utils/writeworker.js", import.meta.url))
        }

        writeWorkerRef.current.onmessage = async(message) => {
        // Handle error in worker
        if(typeof message.data !== "string"){
            const errors: {[key: string]: string[]}  = {
              "NotFoundError": [translate({id: "storage_not_found"}), translate({id: "storage_not_found_text"})]
            }
            const error = message.data
            // Restart website
            reset()
            errors[error.name] ? makeModal(errors[error.name][0], errors[error.name][1]) : makeModal(translate({id: "writing_error"}) , error.name +": " + error.text)
            return
          }
          //Do nothing if crypting is paused
            if(isPausedRef.current){
                return
            }
            //Pause workers to stop overflow
            if(writeWorkerQueRef.current.length > 10 && !workersPaused){
                workersPaused = true
                for(const worker of workersRef.current){
                    worker.postMessage("pause")
                }
            }
            //Unpause workers
            if(workersPaused && writeWorkerQueRef.current.length <= 10){
                workersPaused = false
                for(const worker of workersRef.current){
                    worker.postMessage("unpause")
                }
            }
            //When we have processed an amount of chunks equal to total chunks, stop crypting
            if(i<totalChunks){
                //Send chunk from que to writeworker
                if(writeWorkerQueRef.current[0]&&writeWorkerRef.current){
                    writeWorkerRef.current.postMessage([writeWorkerQueRef.current[0][1], writeWorkerQueRef.current[0][0]*writeChunkSizeRef.current, fileStore])
                    writeWorkerQueRef.current.shift()
                }
                else{
                    writeWorkerReadyRef.current = true
                }
                updateProgress(i/totalChunks)
                i+=1
            }
            else{
                // Checks if the file is of correct size
                if(((await (await (await navigator.storage.getDirectory()).getFileHandle(fileStore)).getFile()).size!==fileSize + (encrypting ? totalChunks*16 : -totalChunks*16))){
                  reset()
                  makeModal(translate({id: "wrong_filesize"}), "")
                } else {
                  updateProgress(100)
                }
            }
        } 
        
        //Divide chunks among workers
        const chunksPerWorker = Math.floor(totalChunks/workerAmount)
        let leftoverChunks = totalChunks % workerAmount
        let previousEnd = -1
        for(const worker of workersRef.current){ 
            const end = previousEnd + chunksPerWorker + ((leftoverChunks>0)? 1 : 0)
            leftoverChunks -= ((leftoverChunks>0)? 1 : 0)
            //Send workers the data needed to start crypting
            worker.postMessage({files, password, encrypting, startId: (previousEnd+1),endId: end, chunkSize})
            previousEnd = end
        }
    }

    return cryptFiles   
}
export default useMultithreading
