import {useEffect, useRef, useState } from "react";
import useChecks from "./useChecks";
import useCrypting from "./useCrypting";
import useOnPageLoad from "./useOnPageLoad";
import useReset from "./useReset";
import eventBus from "../utils/EventBus";
import downloadfile from "../utils/downloadfile";
function useFunctionality(
makeModal: (title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][])=>void,
closeModal: ()=>void
) {
    const [progress, setProgress] = useState(0)
    const [dropHidden, setDropHidden] = useState(false)
    const [fileName, setFileName] = useState("file")
    const [encrypt, setEncrypting] = useState(true)

    const fileStoreRef = useRef("file store")
    
    const {handleChecks} = useChecks(makeModal)
    const {handleLoad} = useOnPageLoad( fileStoreRef, makeModal, closeModal)
    const {reset} = useReset(fileStoreRef, setEncrypting, setProgress, setDropHidden)
    const {crypt} = useCrypting(setProgress, makeModal, closeModal, reset)
    
    const handleCrypting = async(files: File[], password: string, passwordMismatch: boolean, encrypting: boolean)=> {
      if(await handleChecks(files[0], password, passwordMismatch, encrypting, fileStoreRef.current)){
        setDropHidden(true)
        setFileName(files[0].name)
        setEncrypting(encrypting)
        await new Promise( res => setTimeout(res, 1) ); // Wait 1ms for the loading bar to load
        // Chunk
        await crypt(files[0], encrypting, password, fileStoreRef.current);
      }
    }
    useEffect(() => {
        handleLoad()
        }, [])
    
    //reset opfs when someone tries to unload the page
    const handleUnload = async() => {
      await reset()
    }
    useEffect(() => {
      window.addEventListener('beforeunload', handleUnload)
      return () => {
        window.removeEventListener('beforeunload', handleUnload)
    } })
    useEffect(() => {
      eventBus.on("download", ()=>{downloadfile(fileName, encrypt, fileStoreRef.current)})
      eventBus.on("resetart", ()=>{reset()})
      return()=>{
        eventBus.remove("download", () => {})
        eventBus.remove("restart", () => {})
      }
    }, [])
  return { handleCrypting, progress, dropHidden, fileName, encrypt} 
}

export default useFunctionality
