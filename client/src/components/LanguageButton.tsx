import { Button, Menu, MenuItem, MenuProps, alpha, styled } from "@mui/material";
import styles from "./LanguageButton.module.css"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TranslateIcon from '@mui/icons-material/Translate';
import { useContext, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { dictionaryList } from "../languages";



export const LanguageButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const { userLanguage, userLanguageChange } = useContext(LanguageContext);

  const handleLanguageChange = (e: any) => {
    const newLanguageKey = e.currentTarget.getAttribute("data-language-key");
    if (newLanguageKey) {
      userLanguageChange(newLanguageKey);
      handleClose();
    }
  };

  return (
    <div className={styles.languagebutton}>
      <Button onClick={handleClick} endIcon={<KeyboardArrowDownIcon />}>
        <TranslateIcon />
      </Button>
      <Menu className={styles.languagemenu} anchorEl={anchorEl} open={open} onClose={handleClose}>
        {Object.values(dictionaryList).map(languageData => (
          <MenuItem key={languageData.languagekey} data-language-key={languageData.languagekey} onClick={handleLanguageChange} disableRipple>
            {languageData.languagename}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}