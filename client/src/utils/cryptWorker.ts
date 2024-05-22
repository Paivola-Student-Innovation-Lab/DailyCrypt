import init from "rustend";
import { encrypt, decrypt, get_cipher_key, get_nonce } from "rustend";

init()
let paused = false
let deletedFileSize = 0
let cryptData: {files: File[], encrypting: boolean, startId: number, endId: number, chunkSize: number, nonce: Uint8Array, key: Uint8Array} = {files: [], encrypting: true, startId: 0, endId: -1, chunkSize: 0, nonce: new Uint8Array, key: new Uint8Array}

const createChunk = async(key:number, files: (Blob|Uint8Array)[], chunkSize: number) => {
    let dataProcessed = key*chunkSize
    let byteArray: Uint8Array = new Uint8Array(chunkSize)
    let offset = 0
    let fileamount = 0
    //loop through the files and create a chunk
    while(true){
        const file = files[0]
        //return chunk if there are no files left
        if(!file) {
            break
        }
        const fileSize = ArrayBuffer.isView(file)?file.length : file.size
        if(deletedFileSize + fileSize > dataProcessed){
            const start = Math.max(dataProcessed - deletedFileSize, 0)
            const end = Math.min(start + chunkSize - offset, fileSize); // Choose where to stop reading file, if file ends before start+chunkSize, it chooses that point
            const chunk = file.slice(start, end) // Make chunk by slicing the file from the starting point to the end point
            const temporaryByteArray = ArrayBuffer.isView(chunk)? chunk : new Uint8Array(await chunk.arrayBuffer()) // Read chunk as bytes if needed

            // Add the new bytes to the end of the byte array
            byteArray.set(temporaryByteArray, offset)
            offset += temporaryByteArray.length
        }
        // Return chunk if it is the final size
        if (offset === chunkSize){
            break
        }
        else{
            deletedFileSize += (ArrayBuffer.isView(file)?file.length : file.size)  // Value used to calculate the correct start point for a chunk
            files.shift()
            fileamount += 1
        }
    }
    byteArray = byteArray.slice(0, offset)// Remove empty bytes from the end of the array
    return([byteArray, fileamount])
}
const cryptFiles = async () => {
    const {files, encrypting, startId, endId, chunkSize, nonce, key} = cryptData
  
    for(let id = startId; id<=endId; id++){
        if(paused){
            // Store data to continue crypting in the future
            cryptData.startId = id
            cryptData.files = files
            break
        }
        const startTime = performance.now()
        const [chunk, fileamount] = await createChunk(id, files, chunkSize)
        console.log(performance.now() - startTime, fileamount)
        let cryptedChunk: Uint8Array;
        if(encrypting){
            cryptedChunk = encrypt(chunk, nonce, key)
        }
        else{
            cryptedChunk = decrypt(chunk, nonce, key)
            }
        postMessage([id, cryptedChunk])
    }
}
    
onmessage = async(message) => {
    if(typeof message.data ==="string"){
        if(message.data === "pause"){
            paused = true
        }
        else if(message.data === "unpause"){
            paused = false
            cryptFiles()
        }
        else if(message.data === "clear"){
           // When crypting is stopped
           paused = true // Pause crypting if it isn't paused already
            deletedFileSize = 0
            cryptData = {files: [], encrypting: true, startId: 0, endId: -1, chunkSize: 0, nonce: new Uint8Array, key: new Uint8Array}
        }
    }
    else{
        const {files, password, encrypting, startId, endId, chunkSize} = message.data
        deletedFileSize = 0
        paused = false

        // Generate nonce and key
        const nonce = get_nonce(password)
        const key = get_cipher_key(password)
        
        cryptData = {files, encrypting, startId, endId, chunkSize, nonce, key}
        cryptFiles()
    }    
}