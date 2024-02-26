//hpoks
import useWasm from "./useWasm";
import { useEffect, useRef } from "react";

//other
import createChunk from "../utils/createChunk";
import eventBus from "../utils/EventBus";
import useModal from "./useModal";
import usefunctionalityState from "./useFunctionalityState";

function useCrypting() {
    //ref defenition
    const isPausedRef = useRef(false)
    const isStoppedRef = useRef(false)
    const workerRef: React.MutableRefObject<Worker|undefined> = useRef()
    //hook defenition
    const{fileStore, setProgress, setPaused, reset} = usefunctionalityState((state) => ({fileStore: state.filestore, setProgress: state.updateProgress, setPaused: state.pause, reset: state.reset}))
    const rust = useWasm()
    const {makeModal, closeModal} = useModal((state) => ({makeModal: state.makeModal, closeModal: state.closeModal}))
    //handle pausing the crypting
    const handlePause = ()=>{
      setPaused(!isPausedRef.current)
      isPausedRef.current = !isPausedRef.current
        if (!isPausedRef.current && workerRef.current !== undefined) {
          workerRef.current.postMessage("start")
        }
    }

    //handle stopping the crypting
    const handleStop = ()=>{
      isPausedRef.current = true
      setPaused(true)
      makeModal("Are you sure you want to cancel?", "This will stop the encryption/decryption process and delete the file.", 
        [["Yes", () => {closeModal(); setTimeout(reset, 1000)}], ["No", () => {handlePause(); closeModal()}]])
    }
    //recieve the pause and stop eventbusses
    useEffect(() => {
      eventBus.on("pause", () => {handlePause()})
      eventBus.on("stop", () => {handleStop()})
      return () => {
        eventBus.remove("pause", () => {})
        eventBus.remove("stop", () => {})
      }
    }, []);

    //crypt the file
    const crypt = async (file: Blob, encrypting: boolean, password: string) => {
      //variable defenition
      let chunkSize = 4000000; // 4MB chunks
      chunkSize = encrypting ? chunkSize : chunkSize + 16; // Encrypted chunks are 16 bytes larger than non-encrypted ones
      const totalChunks = Math.ceil(file.size / chunkSize); // Calculate how many chunks to make
      let writableChunk: Uint8Array
      let ready = true
      let sendMessage=false
      isPausedRef.current=false
      isStoppedRef.current=false
      setPaused(false)

      let i = 1
      //create a chunk when worker sends a message
      workerRef.current = new Worker(new URL("../utils/writeworker.js", import.meta.url)) //creates webworker for compiling file
      workerRef.current.onmessage = async(message) => {
        //if worker sends number get error message assosiated with number and make a modal of it. also reset website.
        if (isStoppedRef.current){
          i=-1
          isStoppedRef.current=false
          await reset()
          return
        }
        //handle error in worker
        if(typeof message.data !== "string"){
          const errormsg = [["could not find storage file", "can't find file for storage. this may be caused by all opfs data being deleted by another tab. to fix this reload the page."]]
          const errors =["NotFoundError"]
          //assosiate errors with numbers. and use them to make error modals
          const error = message.data
          if(errors.includes(error.name)){
            const errorMessage = errormsg[errors.indexOf(error.name)]
            await reset()
            makeModal(errorMessage[0], errorMessage[1])
          }
          else {
            await reset()
            makeModal("error trying to write data to file" , error.name +": " + error.text)
          }
        }
        //send another message and create a new chunk
        if (ready && !isPausedRef.current){
          ready=false
          sendMessage=false
          if ( i < totalChunks) {
            //send message to worker to add previous chunk in the end of the compilation file
            if (workerRef.current !== undefined){
              workerRef.current.postMessage([writableChunk, (i-1)*(chunkSize + (encrypting? 16 : -16)), fileStore])
            }
            
            //handle progress update
            setProgress((i-1)/totalChunks)

            //creates chunk and stores it as the value of cryptedChunk. 
            if (encrypting){
              writableChunk = rust.encrypt(await createChunk(i, chunkSize, file), password)
            }
            else{
              writableChunk = rust.decrypt(await createChunk(i, chunkSize, file), password)
            }

            //handles incorrect password
            if (writableChunk.length === 0) { // Check for aead::Error on rustend
              await reset()
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
                await reset()
                makeModal("something went wrong and file is wrong size", "")
              } else {
                setProgress(100)
                if (workerRef.current !== undefined)
                workerRef.current.terminate()
              }
            }
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
      if (encrypting){
        writableChunk = rust.encrypt(await createChunk(0, chunkSize, file), password)
      }
      else{
        writableChunk = rust.decrypt(await createChunk(0, chunkSize, file), password)
      }
      if(writableChunk.length===0){
        makeModal("Invalid Decrypt Password!", "The decrypting password you used isn't the same one that was used for encrypting.")
        await reset()
        return
      }
      //sends message to worker to start working.
      workerRef.current.postMessage("start")
  }
  return { crypt, paused: isPausedRef.current}
}
export default useCrypting