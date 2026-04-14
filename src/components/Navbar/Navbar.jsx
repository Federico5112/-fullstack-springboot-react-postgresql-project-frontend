import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LockOpen from '@mui/icons-material/LockOpen';
import { Box } from "@mui/material";

import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Ay ikonu
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Güneş ikonu
// NOT: Klasör yolunu kendi yapına göre ('../../theme/ThemeContext' veya '../theme/ThemeContext') kontrol et.
import { useColorMode } from '../../theme/ThemeContext';

function Navbar() {
    let navigate = useNavigate();

    const onClick = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("userName");
        navigate(0);
    }

    const theme = useTheme();
    const { toggleColorMode } = useColorMode();

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" sx={{ marginRight: 2 }} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>

                    {/* flexGrow: 1 sayesinde bu kısım sol tarafı kaplar, geri kalanları sağa iter */}
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }}>
                        <Link style={{ textDecoration: "none", boxShadow: "none", color: "white" }} to="/">
                            Home
                        </Link>
                    </Typography>

                    {/* TEMA DEĞİŞTİRME BUTONU BURAYA EKLENDİ (Giriş yapıp yapmamaktan bağımsız) */}
                    <IconButton sx={{ mr: 4, color: 'white' }} onClick={toggleColorMode}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {/* KULLANICI GİRİŞ/PROFİL KONTROLÜ */}
                    <Typography variant="h6" component="div">
                        {localStorage.getItem("currentUser") == null ?
                            <Link style={{ textDecoration: "none", boxShadow: "none", color: "white" }} to="/auth">
                                Login/Register
                            </Link>
                            :
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton sx={{ color: 'white', mr: 2 }} onClick={onClick}>
                                    <LockOpen />
                                </IconButton>
                                <Link style={{ textDecoration: "none", boxShadow: "none", color: "white" }} to={"/users/" + localStorage.getItem("currentUser")}>
                                    Profile
                                </Link>
                            </Box>
                        }
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar;