//hooks
import {useEffect} from "react";
import useChecks from "./useChecks";
import useCrypting from "./useCrypting";
import useOnPageLoad from "./useOnPageLoad";
import usefunctionalityState from "./useFunctionalityState";
import createZipEntries from "../utils/createZipEntry";

function useFunctionality() {
    //hook defenitions
    const{setUiState, reset} = usefunctionalityState((state)=>({setUiState: state.setUiState,reset: state.reset}))
    const {handleChecks} = useChecks()
    const {handleLoad} = useOnPageLoad()
    const {crypt} = useCrypting()
    
    //start encrypting/decrypting the file
    const handleCrypting = async(files: File[], password: string, passwordMismatch: boolean, encrypting: boolean)=> {
      if(await handleChecks(files, password, passwordMismatch, encrypting)){//check if all the conditions to crypt a file are met
        const multipleFiles = files.length>1
        setUiState(encrypting, multipleFiles? "files.zip" : files[0].name)
        await new Promise( res => setTimeout(res, 1) ); // Wait 1ms for the loading bar to load
        
        //initialize crypting
        await crypt(multipleFiles? await createZipEntries(files) : files, encrypting, password, multipleFiles);
      }
    }

    //call the handleload function 
    useEffect(() => {
        handleLoad()
        }, [])
    
    //reset opfs when someone tries to unload the page
    const handleReset = async() => {
      reset()
    }
    useEffect(() => {
      window.addEventListener('beforeunload', handleReset)
      return () => {
        window.removeEventListener('beforeunload', handleReset)
    } })

    //recieve some of the eventbusses and handle them
  return { handleCrypting} 
}

export default useFunctionality
