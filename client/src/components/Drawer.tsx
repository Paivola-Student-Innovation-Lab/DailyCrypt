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
    <Box className={styles.drawerbox} sx={{ width: 275 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <Link to="/" style={{ textDecoration: 'none' }} className={styles.link}>
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
          <Link to="info" style={{ textDecoration: 'none' }} className={styles.link}>
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
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Menu<MenuIcon /></Button>
      <Drawer open={open} onClose={toggleDrawer(false)} 
        PaperProps={{
          sx: {
            backgroundColor: 'var(--background-color)',
            color: 'var(--encryptgreen)',
          }
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}