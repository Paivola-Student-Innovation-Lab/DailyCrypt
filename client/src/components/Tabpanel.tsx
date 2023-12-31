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

export default function Tabpanel() {
  const translate = useTranslation();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={styles.tabs} >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={translate('ubuntu')} {...a11yProps(0)} />
          <Tab label={translate('windows')} {...a11yProps(1)} />
          <Tab label={translate('mac')} {...a11yProps(2)} />
        </Tabs>
      <CustomTabPanel value={value} index={0}>
        {translate('ubuntu_title')}
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
        {translate('windows_title')}
        <span className={styles.instructiontext} >{translate('windows_instruction_1')}</span>
        <img src='./images/windows/windows1.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('windows_instruction_2')}</span>
        <img src='./images/windows/windows2.png' className={styles.pic} alt='' />
        <span className={styles.instructiontext} >{translate('windows_instruction_3')}</span>
        <img src='./images/windows/windows3.png' className={styles.pic} alt='' />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {translate('mac_title')}
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