import usefunctionalityState from "./useFunctionalityState"
import useModal from "./useModal"

function useOnPageLoad(){
  const {makeModal, closeModal} = useModal((state) => ({makeModal: state.makeModal, closeModal: state.closeModal}))
  const setFileStore = usefunctionalityState((state) => state.setFilestore)
  const remove = async()=>{
    //removes all files from opfs
    for await (const key of (await navigator.storage.getDirectory()).keys()){
      await(await navigator.storage.getDirectory()).removeEntry(key)
    }
    //creates default file
    setFileStore("stored file")
    await(await navigator.storage.getDirectory()).getFileHandle("stored file", {create: true})

    //closes question modal
    closeModal()
  }
  const createNew = async()=>{
    //records keys of all files in opfs into an array
    let filekeys = []
    for await (const key of (await navigator.storage.getDirectory()).keys()){
      filekeys.push(key)
    }
    //adds an increasing number to the end of the default key until key is no longer in array of stored files
    let number=0
    let key = "stored file"
    while(filekeys.includes(key)){
      number+=1
      key="stored file"+number
    }
    //creates file from key
    setFileStore(key)
    await(await navigator.storage.getDirectory()).getFileHandle(key, {create: true})
    closeModal()
  }


  const handleLoad = async() => {
    //checks if there are any files in opfs
    let filesinstore=false
    for await (const key of (await navigator.storage.getDirectory()).keys()){
      //if there are files in opfs asks user how to proceed. user can call one of the functions above through this modal
      makeModal("Another tab open", "Seems like you have Dailycrypt open in another tab. choose wether to delete all files being processed by other tabs or to create a new file for this tab. Removing files may cause errors in other pages", [["Remove", remove], ["Create", createNew]])
      filesinstore=true
      break
    }
    //if no files were found creates default file
    if(!filesinstore){
      setFileStore("stored file")
      await(await navigator.storage.getDirectory()).getFileHandle("stored file", {create: true})
    }
  }
  return { handleLoad }
}
export default useOnPageLoad