import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'Wstążka',
    children: [
      { id: 'Klienci', icon: <ContactMailIcon />, active: false, path: '/clients' },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props: DrawerProps) {
  const { ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
          <ListItemIcon>
            <RocketLaunchIcon />
          </ListItemIcon>
          Projekt Apollo
        </ListItem>
        <Link to="/">
          <ListItem sx={{ ...item, ...itemCategory }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Strona główna</ListItemText>
          </ListItem>
        </Link>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, path }) => (
              <Link to={path}>
                <ListItem disablePadding key={childId}>
                  <ListItemButton selected={active} sx={item}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
            <a href='http://192.168.13.8:81/wordpress/' target='_blank' rel="noreferrer">
              <ListItem disablePadding key='Baza wiedzy'>
                <ListItemButton sx={item}>
                  <ListItemIcon><MenuBookIcon /></ListItemIcon>
                  <ListItemText>→ Baza wiedzy</ListItemText>
                </ListItemButton>
              </ListItem>
            </a>
            <a href='http://192.168.13.8' target='_blank' rel="noreferrer">
              <ListItem disablePadding key='Baza wiedzy'>
                <ListItemButton sx={item}>
                  <ListItemIcon><GitHubIcon /></ListItemIcon>
                  <ListItemText>→ Gitlab</ListItemText>
                </ListItemButton>
              </ListItem>
            </a>
            <a href='http://192.168.13.14:82' target='_blank' rel="noreferrer">
              <ListItem disablePadding key='HRM Spółka'>
                <ListItemButton sx={item}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText>→ HRM Spółka</ListItemText>
                </ListItemButton>
              </ListItem>
            </a>
            <a href='http://192.168.13.14:81' target='_blank' rel="noreferrer">
              <ListItem disablePadding key='HRM Adam Czerwonka'>
                <ListItemButton sx={item}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText>→ HRM Adam Czerwonka</ListItemText>
                </ListItemButton>
              </ListItem>
            </a>

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}