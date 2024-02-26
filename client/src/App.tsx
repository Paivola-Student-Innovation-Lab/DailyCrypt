// Components
import { Alert, Button, TextField, Typography, Box, AlertTitle} from "@mui/material";
import { Link } from "react-router-dom";
import Dropzone from "./components/Dropzone";
import {Header} from "./components/Header";
import ProgressArea from './components/ProgressArea';

// Styles
import styles from "./App.module.css";

// Hooks
import {useState} from "react";
import useTranslation from "./hooks/useTranslation";
import usefunctionalityState from "./hooks/useFunctionalityState";


const App = ({encryptFunc} : {encryptFunc: ((files: File[], password: string, passwordMismatch: boolean, encrypting: boolean)=>Promise<void>)}) => {

  // Usestates
  const [files, setFiles] = useState<File[]>([]);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const dropHidden = usefunctionalityState((state) => state.drophidden)
  // Hook declaration
  const translate = useTranslation();

  const updateFiles = (files: File[]) => {
    setFiles(files);
  };

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
    encryptFunc(files, password, passwordMismatch, true)
  };

  const handleDecrypt = async () => {
    encryptFunc(files, password, passwordMismatch, false)
  }  
  return (
    <>
      <Header />
      <div className={styles.container}>
        {!(!navigator.storage.getDirectory) &&
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
            {dropHidden && 
              <ProgressArea/>
            }
          </Box>
        </div>
        <div className={styles.textfields}>
          <TextField type="password" label={translate('password_field')} value={password} onChange={handlePasswordInput} required />
          <TextField type="password" className={passwordMismatch ? styles["input-error"] : ""} label={translate('confirmpassword_field')} value={confirmPassword} onChange={handleConfirmPasswordInput} required />
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
      
    </>
  );
};
export default App;