//components
import { Alert, Box, Button, Typography } from "@mui/material";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

//hooks
import {useMemo} from "react";
import useTime from "../hooks/useTime";

//styles
import Dropzonestyles from "./Dropzone.module.css"
import progressareastyles from "./ProgressArea.module.css"

// Icons
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

//other
import eventBus from "../utils/EventBus";
import usefunctionalityState from "../hooks/useFunctionalityState";
import downloadfile from "../utils/downloadfile";
import useModal from "../hooks/useModal";
import { FormattedMessage} from "react-intl";

export function ProgressArea () {
    //hook defenitions
    const{makeModal, closeModal} = useModal((state) => ({makeModal: state.makeModal, closeModal: state.closeModal}))
    const{progress, encrypting, fileName, paused, filestore, setPaused, reset} = usefunctionalityState((state) => ({progress: state.progress, encrypting: state.encrypting, fileName: state.filename, paused: state.paused,filestore: state.filestore, setPaused: state.pause,reset: state.reset}))
    const {handleTime, adjustStartTime, resetTime} = useTime(progress)

    //calculate time to show user from progress
    const timeLeft = useMemo(handleTime, [progress])
    
    
    const handleDownload = () => {downloadfile(fileName, encrypting, filestore)}//download the crypted file
    const handleRestart = () => {
        eventBus.dispatch("stop", null); //Reset workers
        resetTime(); 
        reset();
    }

    //pause crypting
    const handlePause = () => {
        setPaused(!paused)
        adjustStartTime()
        eventBus.dispatch("pause", null)
    }
    //confirm stopping and stop crypting
    const handleStop = () => {
        if(!paused){
            handlePause()
        }
        makeModal("Are you sure you want to cancel?", "This will stop the encryption/decryption process and delete the file.", 
            [["Yes", () => {closeModal(); resetTime(); eventBus.dispatch("stop", null); setTimeout(reset, 1000)}], ["No", () => {closeModal(); handlePause()}]], true)
    }
    
    return(
        <>
        {progress < 100 &&
            <div className={Dropzonestyles.dropzone}>
            <Typography color="text.secondary">
                <FormattedMessage id={"crypting"} values={{encrypting: encrypting, file_name: <b style={{ color: "var(--encryptgreen)" }}>{fileName}</b>}} />
            </Typography>
            <LinearProgressWithLabel value={progress*100} />
            <Box className={progressareastyles.progressbuttons}>
            <Button className={progressareastyles.pausebutton} id="pauseButton" onClick={handlePause} >{paused ? <PlayCircleIcon /> : <PauseCircleIcon />} <FormattedMessage id={`${paused ? "unpause" : "pause"}_button`} /></Button>
            <Button className={progressareastyles.cancelbutton} id="cancelButton" onClick={handleStop} ><CancelIcon /><FormattedMessage id="cancel_button" /></Button>
            </Box>
            <Typography>
                {!paused ? (!(isNaN(timeLeft[0]) && isNaN(timeLeft[1]) && isNaN(timeLeft[2])) ? 
                <FormattedMessage id={"time_remaining_s" + (timeLeft[0] !== 0 ? "mh" : (timeLeft[1] !== 0 ? "m" : ""))} values={{hours: timeLeft[0], minutes: timeLeft[1], seconds: timeLeft[2]}} /> : 
                <FormattedMessage id="loading_file" />) :
                "Paused"}
            </Typography>
        </div>
        }
        {progress >= 100 &&
            <div className={Dropzonestyles.dropzone}>
            <Alert severity="success">
                <FormattedMessage id="success" values={{file_name: <b>{fileName}</b>, encrypted: encrypting}} /> 
                </Alert>
            <Button className={progressareastyles.downloadbutton} onClick={handleDownload} value="download"> <FormattedMessage id='download_button' values={{encrypted: encrypting}} /> </Button>
            <Button className={progressareastyles.downloadbutton} onClick={handleRestart} value="restart"> <FormattedMessage id='restart_button' /> </Button>
            </div>
        }
    </> 
    )
    
}

export function HeaderProgressBar () {
    //hook defenitions
    const{makeModal, closeModal} = useModal((state) => ({makeModal: state.makeModal, closeModal: state.closeModal}))
    const{progress, encrypting, fileName, paused, filestore, setPaused, reset} = usefunctionalityState((state) => ({progress: state.progress, encrypting: state.encrypting, fileName: state.filename, paused: state.paused,filestore: state.filestore, setPaused: state.pause,reset: state.reset}))
    const {handleTime, adjustStartTime, resetTime} = useTime(progress)

    //calculate time to show user from progress
    const timeLeft = useMemo(handleTime, [progress])
    
    
    const handleDownload = () => {downloadfile(fileName, encrypting, filestore)}//download the crypted file
    const handleRestart = () => {resetTime(); reset()}//reset the page

    //pause crypting
    const handlePause = () => {
        setPaused(!paused)
        adjustStartTime()
        eventBus.dispatch("pause", null)
    }
    //confirm stopping and stop crypting
    const handleStop = () => {
        if(!paused){
            handlePause()
        }
        makeModal("Are you sure you want to cancel?", "This will stop the encryption/decryption process and delete the file.", 
            [["Yes", () => {closeModal(); setTimeout(reset, 1000)}], ["No", () => {handlePause(); closeModal()}]])
    }
    
    return(
        <>
        {progress < 100 &&
            <div className={progressareastyles.headerprogressbar}>
            <LinearProgressWithLabel value={progress*100} textColor="white"/>
            <Box className={progressareastyles.progressbuttons}>
            <Button className={progressareastyles.headerbutton} id="pauseButton" onClick={handlePause} >{paused ? <PlayCircleIcon /> : <PauseCircleIcon />} </Button>
            <Button className={progressareastyles.headerbutton} id="cancelButton" onClick={handleStop} ><CancelIcon /></Button>
            </Box>
        </div>
        }
        {progress >= 100 &&
            <Alert severity="success">
                <FormattedMessage id="success" values={{file_name: <b>{fileName}</b>, encrypted: encrypting}} /> 
                </Alert>
        }
    </> 
    )

}