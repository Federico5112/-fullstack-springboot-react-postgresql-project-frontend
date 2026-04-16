import React, { useState } from "react";
import { FormControl, InputLabel, Input, Button, FormHelperText, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostWithoutAuth } from "../../services/HttpService";

function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const handleUsername = (value) => {
        setUsername(value);
    }

    const handlePassword = (value) => {
        setPassword(value);
    }

    const sendRequest = (path) => {
        PostWithoutAuth(("/auth/" + path), {
            userName: username,
            password: password,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Sunucu reddetti: " + res.status);
                }
                return res.json();
            })
            .then((result) => {
                if (result && result.accessToken) {
                    localStorage.setItem("tokenKey", result.accessToken);
                    localStorage.setItem("refreshKey", result.refreshToken);
                    localStorage.setItem("currentUser", result.userId);
                    localStorage.setItem("userName", username);
                    localStorage.setItem("avatarId", result.avatarId);

                    navigate(0);
                } else {
                    alert(result.message);
                }
            })
            .catch((err) => {
                console.log(err);
                alert("İşlem başarısız oldu. Sunucu hatası veya geçersiz işlem.");
            })
    }

    const handleButton = (path) => {
        sendRequest(path);
        setUsername("");
        setPassword("");
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 400, margin: "50px auto" }}>
            <FormControl>
                <InputLabel>Username</InputLabel>
                <Input value={username} onChange={(i) => handleUsername(i.target.value)} />
            </FormControl>

            <FormControl>
                <InputLabel>Password</InputLabel>
                <Input type="password" value={password} onChange={(i) => handlePassword(i.target.value)} />
            </FormControl>

            <Button variant="contained"
                    style={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                    }}
                    onClick={() => handleButton("register")}>Register</Button>

            <FormHelperText sx={{ textAlign: 'center' }}>Are you already registered?</FormHelperText>

            <Button variant="contained"
                    style={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                    }}
                    onClick={() => handleButton("login")}>Login</Button>
        </Box>
    )
}

export default Auth;