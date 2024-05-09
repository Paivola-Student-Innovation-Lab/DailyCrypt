import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import styles from './Drawer.module.css';

export default function SideMenu() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const location = useLocation();

  const targetPath = "/info";

  const isLinkDisabled = location.pathname === targetPath;

  const DrawerList = (
    <Box className={styles.drawerbox} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding>
          <ListItemButton >
            <ArrowBackIos className={styles.icon} onClick={toggleDrawer(false)} />
            <ListItemText>
              CLOSE
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <Link to="/" className={styles.link}>
          <ListItem disablePadding className={styles.link}>
            <ListItemButton>
              <HomeIcon className={styles.icon} />
              <ListItemText>
                HOME 
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        {isLinkDisabled ? (
          <ListItem disablePadding>
            <ListItemButton>
              <InfoIcon className={styles.icon}/>
              <ListItemText>
                INFO
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ) : (
          <Link to="info" className={styles.link}>
            <ListItem disablePadding className={styles.link}>
              <ListItemButton>
                <InfoIcon className={styles.icon}/>
                <ListItemText>
                  INFO
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
        )}
        <Link to="https://github.com/Paivola-Student-Innovation-Lab/DailyCrypt" className={styles.link} target="_blank" rel="noreferrer">
        <ListItem disablePadding className={styles.link}>
            <ListItemButton>
              <GitHubIcon className={styles.icon} />
              <ListItemText>
                GITHUB
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Link to="https://psil.fi" className={styles.psilLink} target="_blank" rel="noreferrer">
          <Button>
            <img src='./images/psil.svg' alt="" className={styles.psilImage}/>
          </Button>
        </Link>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Menu<MenuIcon /></Button>
      <Drawer 
        open={open} 
        onClose={toggleDrawer(false)} 
        classes={{ paper: styles.drawer }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}