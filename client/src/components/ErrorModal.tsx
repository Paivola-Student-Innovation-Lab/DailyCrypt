import { Box, Modal, Typography } from "@mui/material";
import modalStyles from "./Errormodal.module.css"
import useModal from "../hooks/useModal";
import { useIntl } from "react-intl";


const ErrorModal = () => {
    const state = useModal()
    return (
        <Modal
          open={state.modalOpen}
          onClose={state.preventModalClose? ()=>{} : state.closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={modalStyles.modal}>
            {!state.preventModalClose &&
              <button className={modalStyles.modalclosebutton} onClick={state.closeModal}>{useIntl().formatMessage({id: 'close'})}</button>
            }
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {state.modalTitle}
            </Typography>
            <Typography id="modal-modal-description" className={modalStyles.modaltext}>
              {state.modalText}
            </Typography>
            {state.modalButtons && state.modalButtons.map(button=>(
              <>
                {(typeof button[1]==="function"&& typeof button[0]==="string") &&

                <button className={modalStyles.modalbuttons} onClick={button[1]}>{button[0]}</button>
              }
              </>
            ))}
          </Box>
        </Modal>
    )
}

export default ErrorModal