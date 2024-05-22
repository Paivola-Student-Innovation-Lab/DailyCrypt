import {saveAs} from "file-saver"
const downloadfile = async(filename: string, encrypting: boolean, fileStore:string) =>{
  //create correct name for file
    if (!encrypting) {
      filename = filename.replace(new RegExp('.dc' + '$'), '');
    }
    else{
      filename = filename + '.dc'
    }
    //get file from opfs and download it
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(fileStore);
    saveAs(await fileHandle.getFile(), filename)
}
export default downloadfile