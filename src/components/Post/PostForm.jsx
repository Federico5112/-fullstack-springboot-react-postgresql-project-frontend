import React, { useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputAdornment } from "@mui/material";
import Button from "@mui/material/Button";
import MuiAlert from '@mui/material/Alert';
import { PostWithAuth } from "../../services/HttpService";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PostForm(props) {
    const { userId, userName, refreshPosts } = props;
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [isSent, setIsSent] = useState(false);

    const savePost = () => {
        PostWithAuth("/posts", {
            title: title,
            userId: userId,
            text: text,
        })
            .then((res) => res.json())
            .catch((err) => console.log(err))
    }

    const handleSubmit = () => {
        savePost();
        setIsSent(true);
        setTitle("");
        setText("");
        refreshPosts();
    }

    const handleTitle = (value) => {
        setTitle(value);
        setIsSent(false);
    }

    const handleText = (value) => {
        setText(value);
        setIsSent(false);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsSent(false);
    };

    return (
        <div>
            <Snackbar open={isSent} autoHideDuration={1200} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Your post is sent!
                </Alert>
            </Snackbar>
            <Card sx={{ width: 800, textAlign: "left", margin: 2.5 }}>
                <CardHeader
                    avatar={
                        <Link style={{ textDecoration: "none", boxShadow: "none", color: "white" }} to={"/users/" + userId}>
                            <Avatar aria-label="recipe" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
                                {userName ? userName.charAt(0).toUpperCase() : ""}
                            </Avatar>
                        </Link>
                    }
                    title={
                        <OutlinedInput
                            id="outlined-adornment-title"
                            multiline
                            placeholder="Title"
                            inputProps={{ maxLength: 25 }}
                            fullWidth
                            value={title}
                            onChange={(i) => handleTitle(i.target.value)}
                        />
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="div">
                        <OutlinedInput
                            id="outlined-adornment-text"
                            multiline
                            placeholder="Text"
                            inputProps={{ maxLength: 250 }}
                            fullWidth
                            value={text}
                            onChange={(i) => handleText(i.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        style={{
                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                            color: 'white'
                                        }}
                                        onClick={handleSubmit}
                                    >Post</Button>
                                </InputAdornment>
                            }
                        />
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default PostForm;