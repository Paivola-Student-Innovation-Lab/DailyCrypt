import { Typography } from "@mui/material";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import { text } from "stream/consumers";
import { styled } from "@mui/material/styles";
import { LanguageButton } from "./LanguageButton";
import TemporaryDrawer from "./Drawer";

const Header = () => {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.navigationbuttons}>
          <div className={styles.dailycrypt}>
            <img src="images/BetterLogo.png" alt="" className={styles.pic}/>
            <Typography className={styles.text} variant="h3">
              <span>DailyCrypt</span> 
            </Typography>
          </div> 
          </div>
          <div className={styles.languagebutton}>
            <LanguageButton />
          </div>
          <div>
            <TemporaryDrawer />
          </div>
        </div>
        <div className={styles.divider} />
    </div>
  );
};

const InfoHeader = () => {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.navigationbuttons}>
        <div className={styles.dailycrypt}>
            <img src="images/BetterLogo.png" alt="" className={styles.pic}/>
            <Typography className={styles.text} variant="h3">
              <span>DailyCrypt</span> 
            </Typography>
          </div>
        </div>
        <div className={styles.languagebutton}>
        <LanguageButton />
        </div>
        <div>
        <TemporaryDrawer />  
        </div> 
      </div>
      <div className={styles.divider} />
    </div>
  );
};

export {
  Header,
  InfoHeader,
}
