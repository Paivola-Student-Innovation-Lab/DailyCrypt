import {useEffect, useState } from "react";
import useChecks from "./useChecks";
import useChunking from "./useChunking";
import useOnPageLoad from "./useOnPageLoad";
import useReset from "./useReset";
function useFunctionality(
makeModal: (title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][])=>void,
closeModal: ()=>void
) {
    const [progress, setProgress] = useState(0)
    const [dropHidden, setDropHidden] = useState(false)
    const [fileStore, setFileStore] = useState("")
    const [fileName, setFileName] = useState("file")
    const [encrypt, setEncrypting] = useState(true)

    const {handleChecks} = useChecks(makeModal)
    const {handleLoad} = useOnPageLoad( setFileStore, makeModal, closeModal)
    const {reset} = useReset(fileStore, setEncrypting, setProgress, setDropHidden)
    const {chunk} = useChunking(setProgress, makeModal, reset)
    
    const handleCrypting = async(files: File[], password: string, passwordMismatch: boolean, encrypting: boolean)=> {
        if(await handleChecks(files[0], password, passwordMismatch, encrypting, fileStore)){
            setDropHidden(true)
            setFileName(files[0].name)
            setEncrypting(encrypting)
            await new Promise( res => setTimeout(res, 1) ); // Wait 1ms for the loading bar to load
            // Chunk
            await chunk(files[0], encrypting, password, fileStore);
        }
    }
    useEffect(() => {
        handleLoad()
        }, [])
    
      //reset opfs when someone tries to unload the page
      const handleUnload = async() => {
        await(await navigator.storage.getDirectory()).removeEntry(fileStore)//remove stored file
      }
      useEffect(() => {
        window.addEventListener('beforeunload', handleUnload)
        return () => {
          window.removeEventListener('beforeunload', handleUnload)
      } })
    return { handleCrypting, progress, dropHidden, fileName, encrypt} 
}

export default useFunctionality
