function useReset(fileStoreRef: React.MutableRefObject<string>, setEncrypting: (arg0:boolean)=>void, setProgress: (arg0:number)=>void, setDropHidden: (arg0:boolean)=>void){
    const reset = async () => {
        //try to remove stored file 
        try{
        await(await navigator.storage.getDirectory()).removeEntry(fileStoreRef.current)
        }
        catch(error){}
    
        //create new stored file
        await(await navigator.storage.getDirectory()).getFileHandle(fileStoreRef.current, {create: true})
    
        //reset useStates
        setEncrypting(false)
        setProgress(0)
        setDropHidden(false)
      }
    return{reset}
}
export default useReset