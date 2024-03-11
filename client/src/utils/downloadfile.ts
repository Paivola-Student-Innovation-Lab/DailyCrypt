import {saveAs} from "file-saver"
const downloadfile = async(filename: string, encrypting: boolean, fileStore:string) =>{
  //create correct name for file
    if (!encrypting) {
      filename = filename.replace("encrypted-", "")
    }
    filename = (encrypting ? "encrypted-" : "")  + filename

    //get file from opfs and download it
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(fileStore);
    saveAs(await fileHandle.getFile(), "encrypted-files.zip")
}
export default downloadfile