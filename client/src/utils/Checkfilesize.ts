const enoughSpace = async(size: number, fileStore:string, encrypting: boolean) => {
    const promise = new Promise(async(resolve, reject)=>{
        //asks for persistance if client is using firefox due to firefox giving greater storage qouta to origins with persistance
        if (navigator.userAgent.includes("Firefox")){
            await navigator.storage.persist()
        }
        //check if there is enough space to store file in opfs
        const totalChunks = Math.ceil(size/(encrypting ? 4000000 : 4000016))
        if(navigator.storage.estimate){
            const storage = await navigator.storage.estimate()
            if (typeof storage.quota==="number" && typeof storage.usage ==="number") {  
                if (size > storage.quota-storage.usage-(size +totalChunks*(encrypting ? +16 : -16))){ 
                    resolve(false)
                }
            }         
        }
        //write data to opfs to mark this files size
        const writeWorker = new Worker(new URL("../utils/writeworker.js", import.meta.url))
        writeWorker.onmessage = (message) => {
            if (message.data==="written") {
                writeWorker.terminate()
                resolve(true)
            }
            else{
                writeWorker.terminate()
                resolve(false)
            }
        }
        writeWorker.postMessage([new Uint8Array([]), size + totalChunks*(encrypting ? +16 : -16), fileStore])
})
return await promise
}

export default enoughSpace