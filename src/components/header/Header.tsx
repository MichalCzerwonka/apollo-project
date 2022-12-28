import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import Divider from '@mui/material/Divider';
import { getWeather } from '../../api/ApiWeather';
import { DanePogodowe } from '../../api/ApiWeather';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';

interface HeaderProps {
    onDrawerToggle: () => void;
}



export default function Header(props: HeaderProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [currentTemperature, setCurrentTemperature] = useState<DanePogodowe>();
    const current = new Date();
    const date = `${current.getDate()}.${current.getMonth() + 1}.${current.getFullYear()}`;

    let navigate = useNavigate();
    const { onDrawerToggle } = props;

    const { logout } = useAuthenticatedUser();

    useEffect(() => {
        getWeather().then((res) => {
            setCurrentTemperature(res.data);
        })
            .catch((error: any) => {

                if (error.response.status === 401) {
                    enqueueSnackbar("Sesja wygasła", {
                        anchorOrigin: { vertical: "bottom", horizontal: "left" },
                        variant: "error",
                        autoHideDuration: 4000
                    });
                    localStorage.clear();
                    navigate('/login');
                }

            })
    }, []);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        Dzisiaj: {date}, {currentTemperature?.temperatura.toFixed(0)}°C, {currentTemperature?.opis}, zachmurzenie: {currentTemperature?.zachmurzenie}
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={onDrawerToggle}
                                edge="start"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs />
                        <Grid item>
                            <Tooltip title="Alerts • No alerts">
                                <IconButton color="inherit">
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <IconButton color="inherit" sx={{ p: 0.5 }}
                                aria-controls={open ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}>
                                <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
                            </IconButton>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem>{localStorage.getItem('name')}</MenuItem>
                                <Divider />
                                <MenuItem onClick={handleClose}>Profil</MenuItem>
                                <MenuItem onClick={handleClose}>Ustawienia</MenuItem>
                                <MenuItem onClick={logout}>Wyloguj</MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <AppBar
                component="div"
                color="primary"
                position="static"
                elevation={0}
                sx={{ zIndex: 0 }}
            >
            </AppBar>
        </React.Fragment>
    );
}