
import { useState } from "react";
function useModal() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [modalButtons, setModalButtons] = useState<[buttontext: string, buttonfunc:()=>void][]>()
    const makeModal = (title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][]) => {
        setModalTitle(title)
        setModalText(text)
        setModalOpen(true)
        if (modalQuestionOptions){
            setModalButtons(modalQuestionOptions)
        }
    }

    const closeModal = () => {
        setModalTitle("")
        setModalText("")
        setModalButtons(undefined)
        setModalOpen(false)
    }
    return {makeModal, closeModal, modalTitle, modalText, modalOpen, modalButtons}
}

export default useModal  