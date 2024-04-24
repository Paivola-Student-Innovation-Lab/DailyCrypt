import { create } from "zustand"

interface modalState {
    modalOpen: boolean
    modalTitle: string
    modalText: string
    modalButtons: [string, ()=>void][]|undefined
    preventModalClose: boolean
    makeModal: (title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][], preventModalClose?: boolean) => void
    closeModal: () => void

}

const useModal = create<modalState>()((set) => ({
    modalOpen: false,
    modalTitle: "",
    modalText: "",
    modalButtons: undefined,
    preventModalClose: false,
    
    //makes a modal
    makeModal:(title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][], preventModalClose?: boolean) => set({
        modalOpen: true,
        modalTitle: title,
        modalText: text,
        modalButtons: modalQuestionOptions,
        preventModalClose: preventModalClose||false,
    }),
    //closes the modal
    closeModal: () => set({
        modalOpen: false,
        modalTitle: "",
        modalText: "",
        modalButtons: undefined,
        preventModalClose: false
    })
}))
export default useModal  