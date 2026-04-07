import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LockOpen from '@mui/icons-material/LockOpen';
import { Box } from "@mui/material";

function Navbar() {

    let navigate = useNavigate();

    const onClick = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("userName");
        navigate(0);
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" sx={{ marginRight: 2 }} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }}>
                        <Link style={{ textDecoration: "none", boxShadow: "none", color: "white" }} to="/">
                            Home
                        </Link>
                    </Typography>

                    {}
                    <Typography variant="h6" component="div">
                        {localStorage.getItem("currentUser") == null ?
                            <Link style={{ textDecoration: "none", boxShadow: "none", color: "white" }} to="/auth">
                                Login/Register
                            </Link>
                            :
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton sx={{ color: 'white' }} onClick={onClick}>
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