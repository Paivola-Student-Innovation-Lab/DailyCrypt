import { create } from "zustand"

interface modalState {
    modalOpen: boolean
    modalTitle: string
    modalText: string
    modalButtons: [string, ()=>void][]|undefined
    makeModal: (title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][]) => void
    closeModal: () => void
}

const useModal = create<modalState>()((set) => ({
    modalOpen: false,
    modalTitle: "",
    modalText: "",
    modalButtons: undefined,
    //makes a modal
    makeModal:(title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][]) => set({
        modalOpen: true,
        modalTitle: title,
        modalText: text,
        modalButtons: modalQuestionOptions
    }),
    //closes the modal
    closeModal: () => set({
        modalOpen: false,
        modalTitle: "",
        modalText: "",
        modalButtons: undefined
    })
}))
export default useModal  