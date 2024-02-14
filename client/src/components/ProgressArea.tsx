//components
import { Alert, Box, Button, Typography } from "@mui/material";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

//hooks
import { useCallback, useContext, useMemo} from "react";
import useTranslation from "../hooks/useTranslation";
import useTime from "../hooks/useTime";

//styles
import Dropzonestyles from "./Dropzone.module.css"
import progressareastyles from "./ProgressArea.module.css"

// Icons
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

//other
import { ProgressContext } from "./ProgressContext";
import eventBus from "../utils/EventBus";
import { render } from "react-dom";

function ProgressArea () {
    const{progress, encrypting, fileName, paused} = useContext(ProgressContext)
    const translate = useTranslation()
    const {handleTime, startTimeRef} = useTime(progress)
    //calculate time to show user from progress
    const timeLeft = useMemo(handleTime, [progress])

    //communicate button presses to functionality side
    const handleDownload = () => {
        eventBus.dispatch("download", null)
    }
    const handleRestart = () =>{
        console.log("lol")
        startTimeRef.current = undefined
        eventBus.dispatch("restart", null)
    }
    const handlePause = () => {
        startTimeRef.current = undefined
        eventBus.dispatch("pause", null)
    }
    const handleStop = () => {
        startTimeRef.current = undefined
        eventBus.dispatch("stop", null)
    }
    
    return(
        <>
        {progress < 100 &&
            <div className={Dropzonestyles.dropzone}>
                <Typography color="text.secondary">
                    {translate((encrypting ? "encrypting" : "decrypting"), ('{"file_name": "' + fileName + '"}'))} <b style={{ color: "var(--encryptgreen)" }}>{fileName}</b>...
                </Typography>
                <LinearProgressWithLabel value={progress*100} />
                <Box className={progressareastyles.progressbuttons}>
                    <Button className={progressareastyles.pausebutton} id="pauseButton" onClick={handlePause} >{paused ? <PlayCircleIcon /> : <PauseCircleIcon />} {paused ? "continue" : "pause"}</Button>
                    <Button className={progressareastyles.cancelbutton} id="cancelButton" onClick={handleStop} ><CancelIcon />Cancel</Button>
                </Box>
                <Typography>
                    { !paused ? (!(timeLeft[0] === 0 && timeLeft[1] === 0 && timeLeft[2] === 0) ? (translate("time_remaining")) : "Waiting for file to be loaded...") : "Paused"}
                </Typography>
            </div>
        }
        {progress >= 100 &&
            <div className={Dropzonestyles.dropzone}>
                <Alert severity="success">{translate(("success_" + (encrypting ? "en" : "de") + "crypt"), ('{"file_name": "' + fileName + '"}'))} </Alert>
                <Button className={progressareastyles.downloadbutton} onClick={handleDownload} value="download"> {translate("download_" + (encrypting ? "en" : "de") + "crypted")} </Button>
                <Button className={progressareastyles.downloadbutton} onClick={handleRestart} value="restart"> {translate("restart_button")} </Button>
            </div>
        }
    </> 
    )
    
}
export default ProgressArea