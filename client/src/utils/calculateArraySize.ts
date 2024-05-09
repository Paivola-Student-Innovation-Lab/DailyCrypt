const calculateArraySize = (Array: (Blob|Uint8Array)[]) => {
    let sum = 0
    for (const entry of Array){
        sum += ArrayBuffer.isView(entry)? entry.length : entry.size
    }
    return sum
}
export default calculateArraySize