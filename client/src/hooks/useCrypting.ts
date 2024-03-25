// Hooks
import useWasm from "./useWasm";
import { useEffect, useRef } from "react";
import useModal from "./useModal";
import usefunctionalityState from "./useFunctionalityState";
import { useIntl } from "react-intl";

// Other imports
import eventBus from "../utils/EventBus";
import calculateArraySize from "../utils/calculateArraySize";
import {chunkFile, useChunking} from "./useChunking";


function useCrypting() {
    // Ref definition
    const isPausedRef = useRef(false)
    const workerRef: React.MutableRefObject<Worker|undefined> = useRef()
  
    // Hook definition
    const{fileStore, setProgress, reset} = usefunctionalityState((state) => ({fileStore: state.filestore, setProgress: state.updateProgress, reset: state.reset}))
    const rust = useWasm()
    const translate = useIntl().formatMessage
    const createChunk = useChunking()
    const {makeModal} = useModal((state) => ({makeModal: state.makeModal}))
    // Handle pausing
    const handlePause = ()=>{
      isPausedRef.current = !isPausedRef.current
        if (!isPausedRef.current && workerRef.current !== undefined) {
          workerRef.current.postMessage("start")
        }
    }
    // Receive pause eventbus
    useEffect(() => {
      eventBus.on("pause", () => {handlePause()})
      return () => {
        eventBus.remove("pause", () => {})
      }
    }, []);

    // Crypt the file
    const crypt = async (files: (Blob | Uint8Array)[], encrypting: boolean, password: string, multipleFiles: boolean) => {
      // Variable definition
      let chunkSize = 4000000; // 4MB chunks
      const nonce = rust.get_nonce(password)
      const key = rust.get_cipher_key(password)
      chunkSize = encrypting ? chunkSize : chunkSize + 16; // Encrypted chunks are 16 bytes larger than non-encrypted ones
      const fileSize = calculateArraySize(files)
      const totalChunks = Math.ceil(fileSize / chunkSize); // Calculate how many chunks to make

      let writableChunk: Uint8Array
      let ready = true
      let sendMessage = false
      isPausedRef.current = false

      let i = 0
      // Create a chunk when worker sends a message
      workerRef.current = new Worker(new URL("../utils/writeworker.js", import.meta.url)) //creates webworker for compiling file
      workerRef.current.onmessage = async(message) => {
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
        // Send another message and create a new chunk
        if (ready && !isPausedRef.current){
          ready=false
          sendMessage=false
          if ( i <= totalChunks) {
            // If this isn't the first chunk, send a message to worker to add the previous chunk in the end of the compilation file
            if (workerRef.current !== undefined && i>0){
              workerRef.current.postMessage([writableChunk, (i-1)*(chunkSize + (encrypting? 16 : -16)), fileStore])
              // Update progress
              setProgress((i-1)/totalChunks)
            }
            // Send another generic message if this is the first chunk
            else{
              sendMessage=true
            }

            
            if(i!==totalChunks){
              // Create chunk and store it as the value of cryptedChunk. 
              if (encrypting){
                writableChunk = rust.encrypt( multipleFiles? await createChunk(i, chunkSize, files) : await chunkFile(i*chunkSize, chunkSize, files[0]), nonce, key)
              }
              else{
                writableChunk = rust.decrypt( multipleFiles? await createChunk(i, chunkSize, files) : await chunkFile(i*chunkSize, chunkSize, files[0]), nonce, key)
              }

              // Handle incorrect password
              if (writableChunk.length === 0) { // Check for aead::Error on rustend
                reset()
                makeModal(translate({id: "wrong_password"}), translate({id: "wrong_password_text"}))
                return
              }
            }
            i+=1
            // If worker sent a message during the time spent processing the chunk, send an empty message to worker to re-trigger the loop
            if(sendMessage){
              if (workerRef.current !== undefined) {
                workerRef.current.postMessage("cycle")
              }
            }
          }
          else{
            // Checks if the file is of correct size
            if(((await (await (await navigator.storage.getDirectory()).getFileHandle(fileStore)).getFile()).size!==fileSize + (encrypting ? totalChunks*16 : -totalChunks*16))){
              reset()
              makeModal(translate({id: "wrong_filesize"}), "")
            } else {
              setProgress(100)
              if (workerRef.current !== undefined)
              workerRef.current.terminate()
            }
          }
          ready=true
          
        }
        // If worker sends a message, but we aren't ready to generate another chunk, set sendmessage to true
        else if (!isPausedRef.current) {
          sendMessage=true
        }
      }
     
      // Send message to worker to start the crypting.
      workerRef.current.postMessage("start")
  }
  return { crypt }
}
export default useCrypting