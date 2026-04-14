import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardContent, InputAdornment, OutlinedInput, Avatar, Button } from "@mui/material";
import { PostWithAuth, RefreshToken } from "../../services/HttpService";

function CommentForm(props) {
    const { userId, userName, postId, setCommentRefresh } = props;
    const [text, setText] = useState("");
    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("userName");
        navigate(0);
    }

    const saveComment = () => {
        const currentUserId = localStorage.getItem("currentUser");

        PostWithAuth("/comments", {
            postId: postId,
            userId: currentUserId,
            text: text,
        })
            .then((res) => {
                if (!res.ok) {
                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {
                                logout();
                            } else {
                                return res.json();
                            }
                        })
                        .then((result) => {
                            if (result != undefined) {
                                localStorage.setItem("tokenKey", result.accessToken);
                                saveComment();
                                setCommentRefresh();
                            }
                        })
                        .catch((err) => console.log("Refresh Token Hatası:", err));
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                if (data) {
                    setText("");
                    setCommentRefresh();
                }
            })
            .catch((err) => {
                console.log("Yorum Kayıt Hatası:", err);
            })
    }

    const handleSubmit = () => {
        saveComment();
    }
    const handleChange = (value) => {
        setText(value);
    }

    return (
        <CardContent sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center",
        }}>
            <OutlinedInput
                id="outlined-adornment-amount"
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                onChange={(i) => handleChange(i.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <Link style={{ textDecoration: "none", boxShadow: "none" }} to={{ pathname: '/users/' + userId }}>
                            <Avatar aria-label="recipe" sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {userName ? userName.charAt(0).toUpperCase() : ""}
                            </Avatar>
                        </Link>
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <Button
                            variant="contained"
                            style={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                color: 'white'
                            }}
                            onClick={handleSubmit}
                        >Comment</Button>
                    </InputAdornment>
                }
                value={text}
                sx={{ color: 'text.primary', backgroundColor: 'background.paper' }}
            />
        </CardContent>
    )
}

export default CommentForm;