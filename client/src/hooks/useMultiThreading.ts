import { useRef } from "react"
import usefunctionalityState from "./useFunctionalityState"
import useModal from "./useModal"
import { Password } from "@mui/icons-material"
import calculateArraySize from "../utils/calculateArraySize"

const useMultithreading = () => {
    const workersRef = useRef<Worker[]>([])
    const writeWorkerRef = useRef<Worker>()
    const writeWorkerReadyRef = useRef(true)
    const writeWorkerQueRef = useRef<[id:number, arr: Uint8Array][]>([])
   const writeChunkSizeRef = useRef(4000000)
    const {reset, fileStore, updateProgress} = usefunctionalityState(state => ({reset: state.reset,fileStore: state.filestore, updateProgress: state.updateProgress}))
    const makeModal = useModal(state => state.makeModal)
    

    const createWorkers = (workerAmount: number) => {
        for(let i = 0; i < workerAmount; i++){
            const worker: Worker = new Worker(new URL("../utils/cryptWorker.ts", import.meta.url), {type: "module"})
            
            worker.onmessage = (message) =>{
                if (message.data[1].length === 0) { // Check for aead::Error on rustend
                    reset()
                    makeModal("Invalid Decrypt Password!", "The decrypting password you used isn't the same one that was used for encrypting.")
                }
                if(writeWorkerReadyRef.current && writeWorkerRef.current){
                    writeWorkerReadyRef.current = false
                    writeWorkerRef.current.postMessage([message.data[1], message.data[0]*writeChunkSizeRef.current, fileStore])
                }
                else{
                    writeWorkerQueRef.current.push(message.data)
                }
            }
            workersRef.current.push(worker)
        }
    }
    
    const cryptFiles = async(files: (Blob|Uint8Array)[], password: string, encrypting: boolean) => {
        writeChunkSizeRef.current = encrypting ? 4000016 : 4000000; // Encrypted chunks are 16 bytes larger than non-encrypted ones
        const chunkSize = encrypting ? 4000000 : 4000016
        const fileSize = calculateArraySize(files)
        const totalChunks = Math.ceil(fileSize / chunkSize);

        let i = 1
        writeWorkerRef.current = new Worker(new URL("../utils/writeworker.js", import.meta.url))
        writeWorkerRef.current.onmessage = async() => {
            //prevent memory leak by slowing down workers
            if(writeWorkerQueRef.current.length > 10){
                if(writeWorkerQueRef.current.length > 20){
                    for(const worker of workersRef.current){
                        worker.postMessage(writeWorkerQueRef.current.length**2)//slow worker down
                    }
                }
                else{
                    for(const worker of workersRef.current){
                        worker.postMessage(20*writeWorkerQueRef.current.length)//slow worker down
                    }
                }
            }
            if(i<totalChunks){
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
                //checks if file is correct size
                if(((await (await (await navigator.storage.getDirectory()).getFileHandle(fileStore)).getFile()).size!==fileSize + (encrypting ? totalChunks*16 : -totalChunks*16))){
                  reset()
                  makeModal("something went wrong and file is wrong size", "")
                } else {
                  updateProgress(100)
                }
                for(const worker of workersRef.current){
                    worker.terminate
                }
                workersRef.current = []
                if(writeWorkerRef.current){
                    writeWorkerRef.current.terminate
                }
                writeWorkerRef.current = undefined
            }
        }

        const workerAmount = 5
        

        createWorkers(workerAmount)  
        
        
        const chunksPerWorker = Math.floor(totalChunks/workerAmount)
        let leftoverChunks = totalChunks % workerAmount
        let previousEnd = -1
        await new Promise( res => setTimeout(res, 1000) )
        for(const worker of workersRef.current){ 
            const end = previousEnd + chunksPerWorker + ((leftoverChunks>0)? 1 : 0)
            leftoverChunks -= ((leftoverChunks>0)? 1 : 0)
            
            worker.postMessage([files, password, encrypting, previousEnd+1, end, chunkSize])
            previousEnd = end
        }
    }

    return cryptFiles   
}
export default useMultithreading


