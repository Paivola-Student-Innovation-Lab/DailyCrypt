import init from "rustend";
import { encrypt, decrypt, get_cipher_key, get_nonce } from "rustend";
import { chunkFile, combineUint8Arrays } from "./Chunking";

init()
let paused = false
let stopped = false
onmessage = async(message) => {
    if(typeof message.data ==="string"){
    
        paused = message.data === "pause"
        //pausing isn't allowed to override stopping
        stopped = message.data === "stop"? true : stopped
    }
    else{
        const  [files, password, encrypting, startId, endId, chunkSize] = message.data
        let deletedFileSize = 0
        let id = startId
        stopped = false
        paused = false

        //wait for unpause
        const wait = (callBack: ()=>void) => {
            if(stopped){
                return
            }
            if(paused){
                setTimeout(() => {wait(callBack)}, 50)
            }
            else{
                callBack()
            }
        }

        const createChunk = async(key:number, files: (Blob|Uint8Array)[]) => {
            let dataProcessed = key*chunkSize
            let byteArray: Uint8Array = new Uint8Array([])
            //loop through the files and create a chunk
            while (true){
                const file = files[0]
                //return chunk if there are no files left
                if(!file){
                    break    
                }
                //create a part of the chunk and combine it to the previous chunks
                byteArray=combineUint8Arrays(byteArray, await chunkFile(Math.max(dataProcessed-deletedFileSize, 0), chunkSize-byteArray.length, file))
                
                //return chunk if it is the final size
                if (byteArray.length === chunkSize){
                    break
                }
                //if chunk isn't the final size, the file must have been processed to the end so we can remove it from the list.
                else{
                    deletedFileSize += (ArrayBuffer.isView(file)?file.length : file.size)  //value used to calculate the correct start point for a chunk
                    files.shift()
                    
                }
            }
            return(byteArray)
        }
        //Generate nonce and key
        const nonce = get_nonce(password)
        const key = get_cipher_key(password)
        
        //Crypt a chunk
       const cryptChunk = async () => {
        if(id <= endId){
            const chunk = await createChunk(id, files)
            let cryptedChunk;
            if(encrypting){
                cryptedChunk = encrypt(chunk, nonce, key)
            }
            else{
                cryptedChunk = decrypt(chunk, nonce, key)
                }
            postMessage([id, cryptedChunk])
            id += 1
            wait(cryptChunk)
        }
        }

        cryptChunk()
    }    
}