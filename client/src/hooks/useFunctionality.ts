//hooks
import {useEffect, useRef, useState } from "react";
import useChecks from "./useChecks";
import useCrypting from "./useCrypting";
import useOnPageLoad from "./useOnPageLoad";
import useReset from "./useReset";

//other
import eventBus from "../utils/EventBus";
import downloadfile from "../utils/downloadfile";

function useFunctionality() {
    //usestate defenitions
    const [progress, setProgress] = useState(0)
    const [dropHidden, setDropHidden] = useState(false)
    const [fileName, setFileName] = useState("file")
    const [encrypt, setEncrypting] = useState(true)
    const [paused, setPaused] = useState(false)

    const fileStoreRef = useRef("file store")
    
    //hook defenitions
    const {handleChecks} = useChecks()
    const {handleLoad} = useOnPageLoad( fileStoreRef)
    const {reset} = useReset(fileStoreRef, setEncrypting, setProgress, setDropHidden)
    const {crypt} = useCrypting(setProgress, reset, setPaused)
    
    //start encrypting/decrypting the file
    const handleCrypting = async(files: File[], password: string, passwordMismatch: boolean, encrypting: boolean)=> {
      if(await handleChecks(files[0], password, passwordMismatch, encrypting, fileStoreRef.current)){//check if all the conditions to crypt a file are met
        setDropHidden(true)
        setFileName(files[0].name)
        setEncrypting(encrypting)
        await new Promise( res => setTimeout(res, 1) ); // Wait 1ms for the loading bar to load
        //initialize crypting
        await crypt(files[0], encrypting, password, fileStoreRef.current);
      }
    }

    //call the handleload function 
    useEffect(() => {
        handleLoad()
        }, [])
    
    //reset opfs when someone tries to unload the page
    const handleReset = async() => {
      await reset()
    }
    useEffect(() => {
      window.addEventListener('beforeunload', handleReset)
      return () => {
        window.removeEventListener('beforeunload', handleReset)
    } })

    //recieve some of the eventbusses and handle
    useEffect(() => {
      eventBus.on("download", ()=>{downloadfile(fileName, encrypt, fileStoreRef.current)})
      eventBus.on("restart", ()=>{handleReset()})
      return()=>{
        eventBus.remove("download", () => {})
        eventBus.remove("restart", () => {})
      }
    }, [])
  return { handleCrypting, progress, dropHidden, fileName, encrypt, paused} 
}

export default useFunctionality
