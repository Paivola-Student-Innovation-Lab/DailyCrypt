import { create } from "zustand"

interface functionalityState{
    useFunctions: any //used to call functions while setting states.
    progress: number
    paused: boolean
    encrypting: boolean
    drophidden: boolean
    filename: string
    filestore: string
    setUiState: (encrypting: boolean, filename: string) => void
    reset: () => void
    pause: (pause: boolean) => void
    updateProgress: (progress: number) => void
    setFilestore: (filestore: string) => void 
}
const usefunctionalityState = create<functionalityState>()((set)=>({
    useFunctions: undefined,
    progress: 0,
    paused: false,
    drophidden: false,
    encrypting: true,
    filename: "crypted file",
    filestore: "file store",

    //shows progressbar
    setUiState: (encrypting: boolean, filename: string) => set({
        drophidden: true,
        encrypting: encrypting,
        filename: filename
    }),
    //resets crypting
    reset: () => set((state) => ({
            useFunctions: navigator.storage.getDirectory().then(async(directoryhandle) => {
                await directoryhandle.removeEntry(state.filestore)
                await directoryhandle.getFileHandle(state.filestore, {create: true})
            }),
            progress: 0,
            paused: false,
            encrypting: true,
            drophidden: false,
            filename: "crypted file"
        })),
    //update states
    pause: (pause: boolean) => set({paused: pause}),
    updateProgress: (progress: number) => set({progress: progress}),
    setFilestore: (filestore: string) => set({filestore: filestore})
}))
export default usefunctionalityState