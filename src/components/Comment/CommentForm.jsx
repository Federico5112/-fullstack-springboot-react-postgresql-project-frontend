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
        PostWithAuth("/comments", {
            postId: postId,
            userId: userId,
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
                        .catch((err) => {
                            console.log(err);
                        })
                } else
                    res.json();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
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
                        <Link style={{ textDecoration: "none", boxShadow: "none", color: "white" }} to={{ pathname: '/users/' + userId }}>
                            <Avatar aria-label="recipe" sx={{ width: 32, height: 32 }}>
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
                style={{ color: "black", backgroundColor: 'white' }}
            />
        </CardContent>
    )
}

export default CommentForm;