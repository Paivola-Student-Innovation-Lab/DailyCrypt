import useWasm from "./useWasm";
import eventBus from "../utils/EventBus";
import { useEffect, useRef } from "react";
import useTranslation from "./useTranslation";

export function useChunking(
  setProgress: (arg0: number) => void,
  makeModal: (arg0: string, arg1: string) => void,
  setDropHidden: (arg0: boolean) => void,
  setTimeLeft:(arg0: number[]) => void,
  fileStore: string,) {
    const isPausedRef = useRef(false)
    const isStoppedRef = useRef(false)
    const workerRef: React.MutableRefObject<Worker|undefined> = useRef()
    const fileStoreRef = useRef(fileStore)
    const rust = useWasm()
    const translate = useTranslation()

   
    const handleStop = async()=>{
      await resetOpfs() 
    }
    useEffect(() => {
      eventBus.on("pause", (paused) =>{
        isPausedRef.current = paused
        if (!paused && workerRef.current !== undefined) {
          workerRef.current.postMessage("start")
        }
      eventBus.on("stop", ()=>{
        handleStop()
      })
      })
      return () => {
        eventBus.remove("pause", () => {})
        eventBus.remove("stop", ()=>{})
      }
    }, []);

    function secondsToHms(d: number) {
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600);

      return [h, m, s]; 
    }

    const resetOpfs = async () => {
      //delete file from opfs and create a new one
      if (workerRef.current !== undefined) {
        workerRef.current.terminate()
        workerRef.current = undefined
      }
      const opfs = await navigator.storage.getDirectory()
      await opfs.removeEntry(fileStoreRef.current)
      await opfs.getFileHandle(fileStoreRef.current, {create:true})
      setDropHidden(false) // Show dropzone
    }

   
    const chunk = async (file: Blob, encrypting: boolean, password: string) => {
      let chunkSize = 4000000; // 4MB chunks
      chunkSize = encrypting ? chunkSize : chunkSize + 16; // Encrypted chunks are 16 bytes larger than non-encrypted ones
      const totalChunks = Math.ceil(file.size / chunkSize); // Calculate how many chunks to make
      let renderAmount = totalChunks/100 // Divide total chunks by 100 for a percentage to render
      let chunkTimes: number[] = []
      let previousTime: number
      let writableChunk: Uint8Array
      let ready = true
      let sendMessage=false
      isPausedRef.current=false
      isStoppedRef.current=false
      fileStoreRef.current=fileStore
      const createchunk = async(key:number)=>{
        // create chunk
        const start = key * chunkSize; // Choose where to start reading file (i = the number of the current chunk)
        const end = Math.min(start + chunkSize, file.size); // Choose where to stop reading file, if file ends before start+chunkSize, it chooses that point
        const chunk = file.slice(start, end) // Make chunk by slicing the file from the starting point to the end point
        const byteArray = new Uint8Array(await chunk.arrayBuffer()); // Read chunk as bytes
        let cryptedChunk: Uint8Array
        if (encrypting) { // Check if the crypt mode is set to encrypt
          cryptedChunk = rust.encrypt(byteArray, password) // Encrypt chunk
        }
        else { // If crypt mode is set to decrypt
          cryptedChunk = rust.decrypt(byteArray, password); // Decrypt chunk
          }
        return cryptedChunk
      }
      let i = 1
      //create a chunk when worker sends a message
      workerRef.current = new Worker(new URL("../utils/writeworker.js", import.meta.url)) //creates webworker for compiling file
      workerRef.current.onmessage = async(message) => {
        //if worker sends number get error message assosiated with number and make a modal of it. also reset website.
        if (isStoppedRef.current){
          i=-1
          isStoppedRef.current=false
          await resetOpfs()
          return
        }
        if(typeof message.data !== "string"){
          const errormsg = [["error trying to write data to file", "error trying to write data to file"], ["could not find storage file", "can't find file for storage. this may be caused by all opfs data being deleted by another tab. to fix this reload the page."]]
          const errors =["NotFoundError"]
          //assosiate errors with numbers. and use them to make error modals
          const error = message.data
          if(errors.includes(error.name)){
            const errorMessage = errormsg[errors.indexOf(error.name)+1]
            await resetOpfs()
            makeModal(errorMessage[0], errorMessage[1])
            
          }
          else if(error.name!=="NoModificationAllowedError"){
            await resetOpfs()
            const errorMessage = errormsg[0]
            makeModal(errorMessage[0], errorMessage[1])
          }
        }
        if (ready && !isPausedRef.current){
          ready=false
          sendMessage=false
          if ( i < totalChunks) {
            //send message to worker to add previous chunk in the end of the compilation file
            if (workerRef.current !== undefined){
              workerRef.current.postMessage([writableChunk, (i-1)*(chunkSize + (encrypting? 16 : -16)), fileStore])
            }
            if (i-1 >= renderAmount) { // Check if it's time to update the progress bar
              renderAmount += totalChunks/100 // Set the next time to update the progress bar
              setProgress((i-1)/totalChunks * 100) // Update progress bar
            }
            const currentTime = performance.now()
            // Handle time data
            
            if (message.data !== "start") {
              chunkTimes.push(currentTime - previousTime)
              const sum = chunkTimes.reduce((a, b) => a + b, 0);
              const mean = sum / chunkTimes.length 
              const remainingTime = mean * totalChunks - mean * i
              setTimeLeft(secondsToHms(remainingTime/1000 + 1))
            }
            else{
              chunkTimes=[]
            }
            previousTime = currentTime
            //creates chunk and stores it as the value of cryptedChunk. also checks if password is correct
            writableChunk = await createchunk(i)
            //handles incorrect password
            if (writableChunk.length === 0) { // Check for aead::Error on rustend
              await resetOpfs()
              makeModal("Invalid Decrypt Password!", "The decrypting password you used isn't the same one that was used for encrypting.")
              return
            }
            i+=1
          }
          //sends message to worker to write the last chunk
          else if(i===totalChunks){
            if (workerRef.current !== undefined){
              workerRef.current.postMessage([writableChunk, (i-1)*(chunkSize + (encrypting? 16 : -16)), fileStore])
            }
            i+=1
          }
            else{
              i+=1
              //checks if file is correct size
              if(((await (await (await navigator.storage.getDirectory()).getFileHandle(fileStore)).getFile()).size!==file.size + (encrypting ? totalChunks*16 : -totalChunks*16))){
                await resetOpfs()
                makeModal("something went wrong and file is wrong size", "")
              } else {
                setProgress(100)
                if (workerRef.current !== undefined)
                workerRef.current.terminate()
              }
            }
          const currentI=i
          ready=true
          //if worker sent a message during the time spent processing the chunk send a empty message to worker to re trigger the loop
          if(sendMessage){
            if (workerRef.current !== undefined) {
              workerRef.current.postMessage("cycle")
            }
          }
        }
        //if worker sends message, but we aren't ready to generate another chunk set sendmessage to true
        else if (!isPausedRef.current) {
          sendMessage=true
        }
      }
     
      //generates first chunk
      writableChunk = await createchunk(0)
      if(writableChunk.length===0){
        makeModal("Invalid Decrypt Password!", "The decrypting password you used isn't the same one that was used for encrypting.")
        resetOpfs()
        return
      }
      //sends message to worker to start working.
      workerRef.current.postMessage("start")
  }
  return { chunk }
  
}
