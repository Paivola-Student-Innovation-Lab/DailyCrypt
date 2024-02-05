// Icons
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

// Components
import { Alert, Button, Modal, TextField, Typography, Box, AlertTitle, Link as MuiLink} from "@mui/material";
import { Link } from "react-router-dom";
import LinearProgressWithLabel from "./components/LinearProgressWithLabel";
import Dropzone from "./components/Dropzone";
import {Header} from "./components/Header";

// Styles
import styles from "./App.module.css";
import modalStyles from "./components/Errormodal.module.css"
import Dropzonestyles from "./components/Dropzone.module.css";

// Hooks
import { useState, useEffect} from "react";
import { useModal } from "./hooks/useModal";
import { useChunking } from "./hooks/useChunking";
import { useCrypting } from "./hooks/useCrypting";
import {useOnPageLoad} from "./hooks/useOnPageLoad";

//Other imports
import downloadfile from "./utils/downloadfile";
import eventBus from "./utils/EventBus";
import useTranslation from "./hooks/useTranslation";

const App = () => {

  // Usestates
  const [hasOpfs, setHasOpfs] = useState(true);
  const [fileStore, setFileStore] = useState("");

  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState([0, 0, 0]);
  const [encrypting, setEncrypting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Hook declaration
  const {modalOpen, modalTitle, modalText, makeModal, closeModal, dropHidden, setDropHidden, modalButtons} = useModal();
  const { chunk } = useChunking(setProgress, makeModal, setDropHidden, setTimeLeft, fileStore);
  const { handleCrypting } = useCrypting(chunk, setProgress, setEncrypting, setDropHidden, makeModal, password, passwordMismatch, files, fileStore);
  const {handleLoad} = useOnPageLoad(setHasOpfs, setFileStore, makeModal, closeModal);
  const translate = useTranslation().translate;
  const transNoInt = useTranslation().translateNoInterpolate;

  const updateFiles = (files: File[]) => {
    setFiles(files);
  };

  const handleRestart = async () => {
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

  const handlePasswordInput = (event: any) => {
    setPassword(event.target.value);
    if (confirmPassword !== event.target.value) {
      setPasswordMismatch(true)
    }
    else {
      setPasswordMismatch(false)
    }
  };

  const handleConfirmPasswordInput = (event: any) => {
    setConfirmPassword(event.target.value);
    if (password !== event.target.value) {
      setPasswordMismatch(true)
    }
    else {
      setPasswordMismatch(false)
    }
  };

  const handleEncrypt = async () => {
    handleCrypting(true)
  };

  const handleDecrypt = async () => {
    handleCrypting(false)
  }

  const handleDownload = async () => {downloadfile(files[0].name, encrypting, fileStore)}

  const handlePause = () => {
    setPaused(!paused)
    eventBus.dispatch("pause", !paused)
  }

  const handleStop = () => {
    eventBus.dispatch("pause", true)
    const confirmedStop = () => {
      eventBus.dispatch("stop", true)
      closeModal()
    } 
    const declinedStop = () => {
      eventBus.dispatch("pause", false)
      closeModal()
    }
    makeModal("Are you sure you want to cancel?", "This will stop the encryption/decryption process and delete the file.", [["Yes", confirmedStop], ["No", declinedStop]])
  }

  //make something happen when component loads for first time
  useEffect(() => {
    handleLoad()
    }, [])

  //make something happen when someone tries to unload page
  useEffect(() => {
    const handleUnload = async() => {
      await(await navigator.storage.getDirectory()).removeEntry(fileStore)//remove stored file
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
  } })
  return (
    <>
      <Header />
      <div className={styles.container}>
        <Modal
          open={modalOpen}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={modalStyles.modal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {modalTitle}
            </Typography>
            <Typography id="modal-modal-description" className={modalStyles.modaltext}>
              {modalText}
            </Typography>
            {modalButtons.map(button=>(
              <>
                {(typeof button[1]==="function"&& typeof button[0]==="string") &&

                <button className={modalStyles.modalbuttons} onClick={button[1]}>{button[0]}</button>
              }
              </>
            ))}
          </Box>
        </Modal>
        {hasOpfs &&
        <>
        <div className={styles.buttons}>
          <Button disabled={dropHidden} className={styles.button} onClick={handleEncrypt} value="encrypt">{translate('encrypt_button')}</Button>
          <Button disabled={dropHidden} className={styles.button} onClick={handleDecrypt} value="decrypt">{translate('decrypt_button')}</Button>
        </div>
        <div className={styles.dropbox}>

          <Box className={dropHidden ? styles.dropzoneborder : styles.dropzonecoloredborder}>
            {!dropHidden &&
              <Dropzone updateFiles={updateFiles} isFiles={files[0]} />
            }
            {dropHidden && (progress < 100) &&
              <div className={Dropzonestyles.dropzone}>
                <Typography color="text.secondary">
                  {transNoInt(encrypting ? "encrypting" : "decrypting").split("{file_name}")[0]}
                  <b style={{ color: "var(--encryptgreen)" }}>{files[0].name}</b>
                  {transNoInt(encrypting ? "encrypting" : "decrypting").split("{file_name}")[1]}
                </Typography>
                <LinearProgressWithLabel value={progress} />
              <Box className={styles.progressbuttons}>
                <Button className={styles.pausebutton} id="pauseButton" onClick={handlePause} >{paused ? <PlayCircleIcon /> : <PauseCircleIcon />} {paused ? "continue" : "pause"}</Button>
                <Button className={styles.cancelbutton} id="cancelButton" onClick={handleStop} ><CancelIcon />Cancel</Button>
              </Box>
              <Typography>
                {!paused ? (!(timeLeft[0] === 0 && timeLeft[1] === 0 && timeLeft[2] === 0) ? (translate("time_remaining", `{"hours": ${timeLeft[0]}, "minutes": ${timeLeft[1]}, "seconds": ${timeLeft[2]}}`)) : translate("loading_file")) : "Paused"}
              </Typography>
            </div>
            }
            {dropHidden && (progress >= 100) &&
              <div className={Dropzonestyles.dropzone}>
                <Alert severity="success">{translate(("success_" + (encrypting ? "encrypt" : "decrypt")), ('{"file_name": "' + files[0].name + '"}'))} </Alert>
                <Button className={styles.downloadbutton} onClick={handleDownload} value="download"> {translate("download_" + (encrypting ? "encrypted" : "decrypted"))} </Button>
                <Button className={styles.downloadbutton} onClick={handleRestart} value="restart"> {translate("restart_button")} </Button>
              </div>
            }
          </Box>


        </div>
        <div className={styles.textfields}>
          <TextField type="password" label={translate('password_field')} value={password} onChange={handlePasswordInput} required />
          <TextField type="password" className={passwordMismatch ? styles["input-error"] : ""} label={translate('confirmpassword_field')} value={confirmPassword} onChange={handleConfirmPasswordInput} required />
        </div>
        </>}
        {!hasOpfs &&
        <>
          {document.documentElement.style.setProperty('--container-color', '#ff8585')}
          <Alert severity="error" variant="filled">
            <AlertTitle className={styles.alerttitle}>OPFS error!</AlertTitle>
            <Typography>Your browser doesn't seem to support opfs!</Typography>
            <Typography>DailyCrypt requires OPFS (Origin private file system) to work properly, and it seems like your browser doesn't support it.</Typography>
            <Typography>Supported browsers are listed on the <Link className={styles.errorlink} to="info">info page</Link>.</Typography>
            <br></br>
            <MuiLink className={styles.linkbutton} component="button" color="inherit" underline="none" variant="body1" onClick={() => {
                setHasOpfs(true)
                document.documentElement.style.setProperty('--container-color', '#ffffff')
              }}>
                If you're certain your browser supports OPFS and you think this is a mistake, press here.
            </MuiLink>
            <Typography>(Note that this will most probably not help)</Typography>
            
          </Alert>
        </>
        }
      </div>
      
    </>
  );
};
export default App;