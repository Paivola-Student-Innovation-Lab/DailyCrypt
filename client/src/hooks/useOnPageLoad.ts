import usefunctionalityState from "./useFunctionalityState"
import useModal from "./useModal"
import { useIntl } from "react-intl"

function useOnPageLoad(){
  const {makeModal, closeModal} = useModal((state) => ({makeModal: state.makeModal, closeModal: state.closeModal}))
  const setFileStore = usefunctionalityState((state) => state.setFilestore)
  const translate = useIntl().formatMessage
  const remove = async()=>{
    // Remove all files from opfs
    let newKey = "stored file 0001"
    for await (const key of (await navigator.storage.getDirectory()).keys()) {
      if(newKey === "stored file 0001"){
        const number = parseInt(key.split(" ")[2])
        // File store name is formatted like this to make sorting work properly up to 9999
        newKey = "stored file " + ("000" + (number + 1)).slice(-4)
      }
      await(await navigator.storage.getDirectory()).removeEntry(key)
    }
    // Create a new file to opfs
    setFileStore(newKey)
    await(await navigator.storage.getDirectory()).getFileHandle(newKey, {create: true})

    // Close question modal
    closeModal()
  }
  const createNew = async()=>{
    let newKey = "stored file 0001"
    for await(const key of (await navigator.storage.getDirectory()).keys()){
      // Get a key that is one greater than previous greatest key
      const number = parseInt(key.split(" ")[2])
      // File store name is formatted like this to make sorting work properly up to 9999
      newKey = "stored file " + ("000" + (number + 1)).slice(-4)
      break
    }
    // Create file from key
    setFileStore(newKey)
    await(await navigator.storage.getDirectory()).getFileHandle(newKey, {create: true})
    // Close question modal
    closeModal()
  }


  const handleLoad = async() => {
    // Check if there are any files in opfs
    let filesinstore=false
    for await (const key of (await navigator.storage.getDirectory()).keys()){
      // If there are files in opfs, ask the user how to proceed. The user can call one of the functions above through this modal
      makeModal(translate({id: "another_tab"}), translate({id: "another_tab_text"}), [[translate({id: "remove_tab"}), remove], [translate({id: "create_tab"}), createNew]], true)
      filesinstore=true
      break
    }
    // If no files were found, create default file
    if(!filesinstore){
      // File store name is formatted like this to make sorting work properly up to 9999
      setFileStore("stored file 0001")
      await(await navigator.storage.getDirectory()).getFileHandle("stored file 0001", {create: true})
    }
  }
  return { handleLoad }
}
export default useOnPageLoad