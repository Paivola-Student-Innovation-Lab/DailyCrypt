import init from "rustend";
import { encrypt, decrypt, get_cipher_key, get_nonce } from "rustend";
import { chunkFile, combineUint8Arrays } from "./Chunking";

init()
let paused = false
let deletedFileSize = 0
let cryptData: {files: File[], encrypting: boolean, startId: number, endId: number, chunkSize: number, nonce: Uint8Array, key: Uint8Array} = {files: [], encrypting: true, startId: 0, endId: -1, chunkSize: 0, nonce: new Uint8Array, key: new Uint8Array}

const createChunk = async(key:number, files: (Blob|Uint8Array)[], chunkSize: number) => {
    let dataProcessed = key*chunkSize
    let byteArray: Uint8Array = new Uint8Array([])
    //loop through the files and create a chunk
    while (true){
        const file = files[0]
        //return chunk if there are no files left
        if(!file){
            break    
        }
        //create a part of the chunk and combine it to the previous parts
        byteArray = combineUint8Arrays(byteArray, await chunkFile(Math.max(dataProcessed-deletedFileSize, 0), chunkSize-byteArray.length, file))
        
        //return chunk if it is the final size
        if (byteArray.length === chunkSize){
            break
        }

        else{
            deletedFileSize += (ArrayBuffer.isView(file)?file.length : file.size)  //value used to calculate the correct start point for a chunk
            files.shift()
            
        }
    }
    return(byteArray)
}
const cryptFiles = async () => {
    const {files, encrypting, startId, endId, chunkSize, nonce, key} = cryptData
    for(let id = startId; id<=endId; id++){
        if(paused){
            //store data to continue crypting in the future
            cryptData.startId = id
            break
        }
        const chunk = await createChunk(id, files, chunkSize)
        let cryptedChunk;
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
           //when crypting is stopped
           paused = true //pause crypting if it isn't paused already
            deletedFileSize = 0
            cryptData = {files: [], encrypting: true, startId: 0, endId: -1, chunkSize: 0, nonce: new Uint8Array, key: new Uint8Array}
        }
    }
    else{
        const {files, password, encrypting, startId, endId, chunkSize} = message.data
        deletedFileSize = 0
        paused = false

        //Generate nonce and key
        const nonce = get_nonce(password)
        const key = get_cipher_key(password)
        
        cryptData = {files, encrypting, startId, endId, chunkSize, nonce, key}
        cryptFiles()
    }    
}