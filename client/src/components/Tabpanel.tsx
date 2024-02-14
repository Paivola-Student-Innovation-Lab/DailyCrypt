import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from './Tabpanel.module.css';
import useTranslation from '../hooks/useTranslation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={styles.tabpanel}
      {...other}
    >
      {value === index && (
        <Box className={styles.picturebox}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function DailyCryptTabpanel() {
  const translate = useTranslation();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={styles.tabs} >
        <Tabs
         value={value} 
         onChange={handleChange} 
         aria-label="basic tabs example" 
         centered
         variant="fullWidth"
         selectionFollowsFocus>
          <Tab label={translate('encrypt_title')} {...a11yProps(0)} />
          <Tab label={translate('decrypt_title')} {...a11yProps(1)} />
        </Tabs>
      <CustomTabPanel value={value} index={0}>
        <span className={styles.instructiontext} >{translate('howtouse_1e')}</span>
        <img src='./images/dailycryptguide/howtouse1.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_2e')}</span>
        <img src='./images/dailycryptguide/howtouse2.png' className={styles.pic} alt='' />
        <img src='./images/dailycryptguide/howtouse3.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_3e')}</span>
        <img src='./images/dailycryptguide/howtouse4.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_4e')}</span>
        <img src='./images/dailycryptguide/howtouse5.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_5e')}</span>
        <img src='./images/dailycryptguide/howtouse6.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_6e')}</span>
        <img src='./images/dailycryptguide/howtouse7.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_7e')}</span>
        <img src='./images/dailycryptguide/howtouse8.png' className={styles.pic} alt='' />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <span className={styles.instructiontext} >{translate('howtouse_1d')}</span>
        <img src='./images/dailycryptguide/howtouse9.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_2d')}</span>
        <img src='./images/dailycryptguide/howtouse10.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_3d')}</span>
        <img src='./images/dailycryptguide/howtouse11.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('howtouse_4d')}</span>
        <img src='./images/dailycryptguide/howtouse13.png' className={styles.pic} alt='' />
      </CustomTabPanel>
    </Box>
  );
}

function ArchivingTabpanel() {
  const translate = useTranslation();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={styles.tabs} >
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs example" 
          centered
          variant="fullWidth"
          selectionFollowsFocus>
          <Tab label={translate('ubuntu')} {...a11yProps(0)} />
          <Tab label={translate('windows')} {...a11yProps(1)} />
          <Tab label={translate('mac')} {...a11yProps(2)} />
        </Tabs>
      <CustomTabPanel value={value} index={0}>
        <span className={styles.instructiontext} >{translate('ubuntu_instruction_1')}</span>
        <img src='./images/linux/linux1.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('ubuntu_instruction_2')}</span>
        <img src='./images/linux/linux2.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('ubuntu_instruction_3')}</span>
        <img src='./images/linux/linux3.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('ubuntu_instruction_4')}</span>
        <img src='./images/linux/linux4.png' className={styles.pic} alt='' />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <span className={styles.instructiontext} >{translate('windows_instruction_1')}</span>
        <img src='./images/windows/windows1.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('windows_instruction_2')}</span>
        <img src='./images/windows/windows2.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('windows_instruction_3')}</span>
        <img src='./images/windows/windows3.png' className={styles.pic} alt='' />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <span className={styles.instructiontext} >{translate('mac_instruction_1')}</span>
        <img src='./images/mac/mac1.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('mac_instruction_2')}</span>
        <img src='./images/mac/mac2.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('mac_instruction_3')}</span>
        <img src='./images/mac/mac3.png' className={styles.pic} alt='' />
      </CustomTabPanel>
    </Box>
  );
}

function ExtractingTabpanel() {
  const translate = useTranslation();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={styles.tabs} >
        <Tabs
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs example" 
          centered
          variant="fullWidth"
          selectionFollowsFocus>
          <Tab label={translate('ubuntu')} {...a11yProps(0)} />
          <Tab label={translate('windows')} {...a11yProps(1)} />
          <Tab label={translate('mac')} {...a11yProps(2)} />
        </Tabs>
      <CustomTabPanel value={value} index={0}>
        <span className={styles.instructiontext} >{translate('ubuntu_instruction_5')}</span>
        <img src='./images/linux/linux5.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('ubuntu_instruction_6')}</span>
        <img src='./images/linux/linux6.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('ubuntu_instruction_7')}</span>
        <img src='./images/linux/linux7.png' className={styles.pic} alt='' />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <span className={styles.instructiontext} >{translate('windows_instruction_4')}</span>
        <img src='./images/windows/windows4.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('windows_instruction_5')}</span>
        <img src='./images/windows/windows5.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('windows_instruction_6')}</span>
        <img src='./images/windows/windows6.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('windows_instruction_7')}</span>
        <img src='./images/windows/windows7.png' className={styles.pic} alt='' />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <span className={styles.instructiontext} >{translate('mac_instruction_4')}</span>
        <img src='./images/mac/mac4.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('mac_instruction_5')}</span>
        <img src='./images/mac/mac5.png' className={styles.pic} alt='' />
      </CustomTabPanel>
    </Box>
  );
}

export {
  ArchivingTabpanel, ExtractingTabpanel, DailyCryptTabpanel
}