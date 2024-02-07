function useReset(fileStore: string, setEncrypting: (arg0:boolean)=>void, setProgress: (arg0:number)=>void, setDropHidden: (arg0:boolean)=>void){
    const reset = async () => {
        //try to remove stored file 
        try{
        await(await navigator.storage.getDirectory()).removeEntry(fileStore)
        }
        catch(error){}
    
        //create new stored file
        await(await navigator.storage.getDirectory()).getFileHandle(fileStore, {create: true})
    
        //reset useStates
        setEncrypting(false)
        setProgress(0)
        setDropHidden(false)
      }
    return{reset}
}
export default useReset