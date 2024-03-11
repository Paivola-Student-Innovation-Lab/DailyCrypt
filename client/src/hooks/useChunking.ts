import { useRef } from "react";
const combineUint8Arrays = (array1: Uint8Array, array2: Uint8Array) => {
    const newArray = new Uint8Array(array1.length + array2.length)
    newArray.set(array1)
    newArray.set(array2, array1.length)
    return newArray
}
export const chunkFile = async(start: number, chunkSize: number, file: Blob|Uint8Array)=>{
    const end = Math.min(start + chunkSize, ArrayBuffer.isView(file)?file.length : file.size); // Choose where to stop reading file, if file ends before start+chunkSize, it chooses that point
    const chunk = file.slice(start, end) // Make chunk by slicing the file from the starting point to the end point
    const byteArray = ArrayBuffer.isView(chunk)? chunk : new Uint8Array(await chunk.arrayBuffer()) // Read chunk as bytes
    return byteArray
}
export const useChunking = () => {
    const deletedFileSizeRef = useRef(0)
    const createChunk = async(key:number, chunkSize: number, files: (Blob|Uint8Array)[]) => {
        let dataProcessed = key*chunkSize
        let byteArray: Uint8Array = new Uint8Array([])
        while (true){
            const file = files[0]
            if(!file){
                break    
            }
            byteArray=combineUint8Arrays(byteArray, await chunkFile(Math.max(dataProcessed-deletedFileSizeRef.current, 0), chunkSize-byteArray.length, file))
            if (byteArray.length === chunkSize){
                break
            }
            else{
                deletedFileSizeRef.current = (ArrayBuffer.isView(file)?file.length : file.size) + deletedFileSizeRef.current
                files.shift()
               
            }
        }
        return(byteArray)
    }
    return createChunk
}
