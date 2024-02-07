import { Box, Modal, Typography } from "@mui/material";
import modalStyles from "./Errormodal.module.css"

interface ErrorModalProps{
  open: boolean
  onClose: ()=>void
  title: string
  text: string
  Buttons?:[buttontext: string, buttonfunc:()=>void][]

}
const ErrorModal = (props: ErrorModalProps) => {

    return (
        <Modal
          open={props.open}
          onClose={props.onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={modalStyles.modal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {props.title}
            </Typography>
            <Typography id="modal-modal-description" className={modalStyles.modaltext}>
              {props.text}
            </Typography>
            {props.Buttons && props.Buttons.map(button=>(
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