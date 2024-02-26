
import { useState } from "react";
export function useModal() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [dropHidden, setDropHidden] = useState(false);
    const [modalButtons, setModalButtons] = useState([[()=>{}, ""]])
    const [modalOnClose, setModalOnClose] = useState<undefined|(() => void)>()
    const makeModal = (title: string, text: string, modalQuestionOptions?:[buttontext: string, buttonfunc:()=>void][], OnClose?:()=> void) => {
        setModalTitle(title)
        setModalText(text)
        setModalOpen(true)
        setModalOnClose(OnClose)
        if (modalQuestionOptions){
            setModalButtons(modalQuestionOptions)
        }
    }

    const closeModal = () => {
        setModalTitle("")
        setModalText("")
        setModalButtons([[()=>{}, ""]])
        setModalOpen(false)
        setModalOnClose(undefined)
    }


    return { dropHidden, setDropHidden, makeModal, closeModal, modalTitle, modalText, modalOpen, modalButtons, modalOnClose}
}

export default useModal