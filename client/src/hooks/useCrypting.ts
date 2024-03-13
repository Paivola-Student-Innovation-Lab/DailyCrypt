//hooks
import useWasm from "./useWasm";
import { useEffect, useRef } from "react";
import useModal from "./useModal";
import usefunctionalityState from "./useFunctionalityState";

//other
import eventBus from "../utils/EventBus";
import calculateArraySize from "../utils/calculateArraySize";
import {chunkFile, useChunking} from "./useChunking";


function useCrypting() {
    //ref defenition
    const isPausedRef = useRef(false)
    const workerRef: React.MutableRefObject<Worker|undefined> = useRef()
  
    //hook defenition
    const{fileStore, setProgress, reset} = usefunctionalityState((state) => ({fileStore: state.filestore, setProgress: state.updateProgress, reset: state.reset}))
    const rust = useWasm()
    const createChunk = useChunking()
    const {makeModal} = useModal((state) => ({makeModal: state.makeModal}))
    //handle pausing the crypting
    const handlePause = ()=>{
      isPausedRef.current = !isPausedRef.current
        if (!isPausedRef.current && workerRef.current !== undefined) {
          workerRef.current.postMessage("start")
        }
    }
    //recieve pause eventbuss
    useEffect(() => {
      eventBus.on("pause", () => {handlePause()})
      return () => {
        eventBus.remove("pause", () => {})
      }
    }, []);

    //crypt the file
    const crypt = async (files: (Blob | Uint8Array)[], encrypting: boolean, password: string, multipleFiles: boolean) => {
      //variable defenition
      let chunkSize = 4000000; // 4MB chunks
      chunkSize = encrypting ? chunkSize : chunkSize + 16; // Encrypted chunks are 16 bytes larger than non-encrypted ones
      const fileSize = calculateArraySize(files)
      const totalChunks = Math.ceil(fileSize / chunkSize); // Calculate how many chunks to make

      let writableChunk: Uint8Array
      let ready = true
      let sendMessage = false
      isPausedRef.current = false

      let i = 0
      //create a chunk when worker sends a message
      workerRef.current = new Worker(new URL("../utils/writeworker.js", import.meta.url)) //creates webworker for compiling file
      workerRef.current.onmessage = async(message) => {
        //if worker sends number get error message assosiated with number and make a modal of it. also reset website.
        //handle error in worker
        if(typeof message.data !== "string"){
          const errormsg = [["could not find storage file", "can't find file for storage. this may be caused by all opfs data being deleted by another tab. to fix this reload the page."]]
          const errors =["NotFoundError"]
          //assosiate errors with numbers. and use them to make error modals
          const error = message.data
          reset()
          if(errors.includes(error.name)){
            const errorMessage = errormsg[errors.indexOf(error.name)]
            makeModal(errorMessage[0], errorMessage[1])
          }
          else {
            makeModal("error trying to write data to file" , error.name +": " + error.text)
          }
          return
        }
        //send another message and create a new chunk
        if (ready && !isPausedRef.current){
          ready=false
          sendMessage=false
          if ( i <= totalChunks) {
            //send message to worker to add previous chunk in the end of the compilation file
            if (workerRef.current !== undefined && i>0){
              workerRef.current.postMessage([writableChunk, (i-1)*(chunkSize + (encrypting? 16 : -16)), fileStore])
              //update progress
              setProgress((i-1)/totalChunks)
            }
            //send another generic message if this is the first chunk
            else{
              sendMessage=true
            }

            
            if(i!==totalChunks){
              //creates chunk and stores it as the value of cryptedChunk. 
              if (encrypting){
                writableChunk = rust.encrypt( multipleFiles? await createChunk(i, chunkSize, files) : await chunkFile(i*chunkSize, chunkSize, files[0]), password)
              }
              else{
                writableChunk = rust.decrypt( multipleFiles? await createChunk(i, chunkSize, files) : await chunkFile(i*chunkSize, chunkSize, files[0]), password)
              }

              //handles incorrect password
              if (writableChunk.length === 0) { // Check for aead::Error on rustend
                reset()
                makeModal("Invalid Decrypt Password!", "The decrypting password you used isn't the same one that was used for encrypting.")
                return
              }
            }
            i+=1
            //if worker sent a message during the time spent processing the chunk send a empty message to worker to re trigger the loop
            if(sendMessage){
              if (workerRef.current !== undefined) {
                workerRef.current.postMessage("cycle")
              }
            }
          }
          else{
            //checks if file is correct size
            if(((await (await (await navigator.storage.getDirectory()).getFileHandle(fileStore)).getFile()).size!==fileSize + (encrypting ? totalChunks*16 : -totalChunks*16))){
              reset()
              makeModal("something went wrong and file is wrong size", "")
            } else {
              setProgress(100)
              if (workerRef.current !== undefined)
              workerRef.current.terminate()
            }
          }
          ready=true
          
        }
        //if worker sends message, but we aren't ready to generate another chunk set sendmessage to true
        else if (!isPausedRef.current) {
          sendMessage=true
        }
      }
     
      //sends message to worker to start the crypting.
      workerRef.current.postMessage("start")
  }
  return { crypt }
}
export default useCrypting