
onmessage = async(message)=> {
    try{
        if (typeof message.data==="string"){
            postMessage(message.data)
        }
        else{
            //write data to file
            const fileHandle = await navigator.storage.getDirectory().then(async(root)=> await root.getFileHandle(message.data[2], {create: false})) 
            const accessHandle = await fileHandle.createSyncAccessHandle();
            await accessHandle.write(message.data[0], {at: message.data[1]}) 
            await accessHandle.flush()
            await accessHandle.close()
            postMessage("written")
        }
    }
    catch(error){
        postMessage(error)
    }
}