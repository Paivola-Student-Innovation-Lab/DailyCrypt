import styles from "./Header.module.css"
import TemporaryDrawer from "./Drawer";
import { Box } from "@mui/material";
import { LanguageButton } from "./LanguageButton";
import { Link } from "react-router-dom";
import { HeaderProgressBar } from "./ProgressArea";

import usefunctionalityState from "../hooks/useFunctionalityState";

const Header2 = (props: any) => {
    const dropHidden = usefunctionalityState((state) => state.drophidden)

    return (
        <div className={styles.header}>
            <div className={styles.buttons} >
                <div className={styles.drawer}>
                    <TemporaryDrawer />
                </div>
                <Link to="/"><img src="./images/BetterLogo.png" alt="" className={styles.pic} /></Link>
                <span className={styles.text}>
                    <Link to="/" className={styles.link}>
                        DailyCrypt
                    </Link>
                </span>
                <Box className={dropHidden ? styles.dropzoneborder : styles.dropzonecoloredborder}>
                    {dropHidden && 
                    <HeaderProgressBar/>
                    }
                </Box>
                <div className={styles.language}>
                    <LanguageButton setLanguage={props.setLanguage}/>
                </div>
            </div>
            <div className={styles.divider} />
        </div>
    );
}

export { Header2 }