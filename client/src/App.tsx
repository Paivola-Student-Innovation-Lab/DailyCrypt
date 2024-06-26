// Components
import { Alert, Button, TextField, Typography, Box, AlertTitle} from "@mui/material";
import { Link } from "react-router-dom";
import Dropzone from "./components/Dropzone";
import { ProgressArea } from './components/ProgressArea';
import {Header} from "./components/Header";
import { FrontPageAccordion } from "./components/Accordion";

// Styles
import styles from "./App.module.css";

// Hooks
import {useState} from "react";
import usefunctionalityState from "./hooks/useFunctionalityState";
import { FormattedMessage, useIntl } from "react-intl";


const App = (props: any) => {

  // Usestates
  const [files, setFiles] = useState<File[]>([]);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  
  // Hook declaration
  const translate = useIntl().formatMessage;
  const dropHidden = usefunctionalityState((state) => state.drophidden)

  //update files on input
  const updateFiles = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  //handle inputs of the password field
  const handlePasswordInput = (event: any) => {
    setPassword(event.target.value);
    //check if the passwords are the same
    if (confirmPassword !== event.target.value) {
      setPasswordMismatch(true)
    }
    else {
      setPasswordMismatch(false)
    }
  };
  //handle inputs of the confirm password field
  const handleConfirmPasswordInput = (event: any) => {
    setConfirmPassword(event.target.value);
    //check if the passwords are the same
    if (password !== event.target.value) {
      setPasswordMismatch(true)
    }
    else {
      setPasswordMismatch(false)
    }
  };

  //start encrypting
  const handleEncrypt = async () => {
    props.encryptFunc(files, password, passwordMismatch, true)
  };

  //start decrypting
  const handleDecrypt = async () => {
    props.encryptFunc(files, password, passwordMismatch, false)
  }  
  return (
    <>
      <Header setLanguage={props.setLanguage} />
      <div className={styles.containers}>
      <div className={styles.container}>
        {!(!navigator.storage.getDirectory) &&
        <>
        <div className={styles.leftbox}>
          <div className={styles.dropbox}>

            <Box className={dropHidden ? styles.dropzoneborder : styles.dropzonecoloredborder}>
              {!dropHidden &&
                <Dropzone updateFiles={updateFiles} isFiles={files[0]} />
              }
              {dropHidden && 
                <ProgressArea/>
              }
            </Box>
          </div>
          {!dropHidden &&
          <div className={styles.bottomcontainer}>
          <div className={styles.textfields}>
            <TextField type="password" label={translate({id: 'password_field'})} value={password} onChange={handlePasswordInput} required />
            <TextField type="password" className={passwordMismatch ? styles["input-error"] : ""} label={translate({id: 'confirmpassword_field'})} value={confirmPassword} onChange={handleConfirmPasswordInput} required />
          </div>
          <div className={styles.buttons}>
            <Button disabled={dropHidden} className={styles.button} onClick={handleEncrypt} value="encrypt"><FormattedMessage id='encrypt_button' /></Button>
            <Button disabled={dropHidden} className={styles.button} onClick={handleDecrypt} value="decrypt"><FormattedMessage id='decrypt_button' /></Button>
          </div> 
          </div>
          }
        </div>
        </>}
        {!navigator.storage.getDirectory &&
        <>
          {document.documentElement.style.setProperty('--container-color', '#ff8585')}
          <Alert severity="error" variant="filled">
            <AlertTitle className={styles.alerttitle}>OPFS error!</AlertTitle>
            <Typography>Your browser doesn't seem to support opfs!</Typography>
            <Typography>DailyCrypt requires OPFS (Origin private file system) to work properly, and it seems like your browser doesn't support it.</Typography>
            <Typography>Supported browsers are listed on the <Link className={styles.errorlink} to="info">info page</Link>.</Typography>

          </Alert>
        </>
        }
      </div>
      <div className={styles.rightcontainer}>
        <span className={styles.infotitle}>
          <FormattedMessage id="infopage_title1" />
        </span>
        <div className={styles.divider} />
        <div className={styles.text}>
          <span>
            <FormattedMessage id="frontpage_text1" />
          </span>
        </div>
        <FrontPageAccordion />
      </div>
      </div>
    </>
  );
};
export default App;