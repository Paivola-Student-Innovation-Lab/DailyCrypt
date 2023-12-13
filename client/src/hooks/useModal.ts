
import { useState } from "react";
export function useModal() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [dropHidden, setDropHidden] = useState(false);
    const [modalButtons, setModalButtons] = useState([[()=>{}, ""]])
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
        setModalButtons([[()=>{}, ""]])
        setModalOpen(false)
    }


    return { dropHidden, setDropHidden, makeModal, closeModal, modalTitle, modalText, modalOpen, modalButtons}
}

export default useModal