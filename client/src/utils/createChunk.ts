const createChunk = async(key:number, chunkSize: number, file: Blob)=>{
    // create chunk
    const start = key * chunkSize; // Choose where to start reading file (key = the number of the current chunk)
    const end = Math.min(start + chunkSize, file.size); // Choose where to stop reading file, if file ends before start+chunkSize, it chooses that point
    const chunk = file.slice(start, end) // Make chunk by slicing the file from the starting point to the end point
    const byteArray = new Uint8Array(await chunk.arrayBuffer()); // Read chunk as bytes
    return byteArray
}
export default createChunk