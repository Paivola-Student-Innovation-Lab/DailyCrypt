import { Typography } from "@mui/material";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import { text } from "stream/consumers";
import { styled } from "@mui/material/styles";
import { LanguageButton } from "./LanguageButton"

const Header = () => {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.homebutton}>
          <img src='./images/BetterLogo.png' className={styles.pic} alt='' />
          <Typography className={styles.text} variant="h3">
            <span className={styles.dailycrypt}>DailyCrypt</span> <HomeIcon /> 
          </Typography>
        </div>
        <div className={styles.infobutton}>
          <Typography variant="h3" className={styles.infomui}>
            <Link className={styles.infolink} to="info"><InfoIcon/> info</Link>
          </Typography>
          <LanguageButton />
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
        <div className={styles.homebutton}>
          <img src='./images/BetterLogo.png' className={styles.pic} alt='' />
          <Typography variant="h3" className={styles.muihomelink} >
            <Link className={styles.homelink} to="/">DailyCrypt <HomeIcon/> </Link>
          </Typography>
        </div>
        <div className={styles.infobutton}>
          <Typography className={styles.info} variant="h3">
            <InfoIcon/> <span className={styles.infotext}>info</span>
          </Typography>
          <LanguageButton />
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
