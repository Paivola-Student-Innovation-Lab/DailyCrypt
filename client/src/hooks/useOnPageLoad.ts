import usefunctionalityState from "./useFunctionalityState"
import useModal from "./useModal"
import { useIntl } from "react-intl"

function useOnPageLoad(){
  const {makeModal, closeModal} = useModal((state) => ({makeModal: state.makeModal, closeModal: state.closeModal}))
  const setFileStore = usefunctionalityState((state) => state.setFilestore)
  const translate = useIntl().formatMessage
  const remove = async()=>{
    // Remove all files from opfs
    for await (const key of (await navigator.storage.getDirectory()).keys()){
      await(await navigator.storage.getDirectory()).removeEntry(key)
    }
    // Create default file
    setFileStore("stored file")
    await(await navigator.storage.getDirectory()).getFileHandle("stored file", {create: true})

    // Close question modal
    closeModal()
  }
  const createNew = async()=>{
    // Add an increasing number to the end of the default key until the key is no longer in the array of stored files
    let number=0
    let key = "stored file"
    while(Object.keys(await navigator.storage.getDirectory()).includes(key)){
      number+=1
      key="stored file"+number
    }
    //creates file from key
    setFileStore(key)
    await(await navigator.storage.getDirectory()).getFileHandle(key, {create: true})
    closeModal()
  }


  const handleLoad = async() => {
    // Check if there are any files in opfs
    let filesinstore=false
    if (Object.keys(await navigator.storage.getDirectory()).length>0){
      // If there are files in opfs, ask the user how to proceed. The user can call one of the functions above through this modal
      makeModal(translate({id: "another_tab"}), translate({id: "another_tab_text"}), [[translate({id: "remove_tab"}), remove], [translate({id: "create_tab"}), createNew]])
      filesinstore=true
    }
    // If no files were found, create default file
    if(!filesinstore){
      setFileStore("stored file")
      await(await navigator.storage.getDirectory()).getFileHandle("stored file", {create: true})
    }
  }
  return { handleLoad }
}
export default useOnPageLoad