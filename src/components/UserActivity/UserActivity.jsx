import React, { useState, useEffect, forwardRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Post from "../Post/Post";
import { GetWithAuth, RefreshToken } from '../../services/HttpService';


const Transition = forwardRef(function Transition(props, ref) {
    const { children, ...other } = props;
    return <Slide direction="up" ref={ref} {...other}>{children}</Slide>;
});

function PopUp(props) {
    const { isOpen, postId, setIsOpen } = props;
    const [open, setOpen] = useState(isOpen);
    const [post, setPost] = useState();

    const getPost = () => {
        GetWithAuth("/posts/" + postId)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setPost(result);
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (postId) {
            getPost();
        }

    }, [postId])

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ marginLeft: 2, flex: 1 }}>
                        Close
                    </Typography>
                </Toolbar>
            </AppBar>
            {post ? <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName}
                          title={post.title} text={post.text}></Post> : "loading"}
        </Dialog>
    )
}

function UserActivity(props) {

    const [error, setError] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const { userId } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleNotification = (postId) => {
        setSelectedPost(postId);
        setIsOpen(true);
    };

    const getActivity = () => {
        GetWithAuth("/users/activity/" + userId)
            .then(res => {
                if (!res.ok) {

                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {

                                localStorage.removeItem("tokenKey");
                                localStorage.removeItem("currentUser");
                                localStorage.removeItem("refreshKey");
                                localStorage.removeItem("userName");
                                window.location.reload();
                            } else {
                                return res.json();
                            }
                        })
                        .then((result) => {
                            if (result != undefined) {
                                localStorage.setItem("tokenKey", result.accessToken);
                                getActivity();
                            }
                        })
                        .catch((err) => console.log("Refresh Hatası:", err));
                } else {
                    return res.json();
                }
            })
            .then((data) => {

                if (data) {
                    setIsLoaded(true);
                    setRows(data);
                }
            })
            .catch((error) => {
                console.log("Aktivite çekme hatası:", error);
                setIsLoaded(true);
                setError(error);
                setRows([]);
            });
    }
    useEffect(() => {
        getActivity()

    }, [])

    return (
        <div>
            {isOpen ? <PopUp isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen} /> : ""}
            <Paper sx={{ width: '100%' }}>
                <TableContainer sx={{ maxHeight: 440, minWidth: 100, maxWidth: 800, marginTop: 7 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>User Activity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {}
                            {error ? (
                                <TableRow><TableCell>Aktiviteler yüklenemedi.</TableCell></TableRow>
                            ) : !isLoaded ? (
                                <TableRow><TableCell>Yükleniyor...</TableCell></TableRow>
                            ) : Array.isArray(rows) && rows.length > 0 ? (
                                rows.map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell align="left">
                                                <Button onClick={() => handleNotification(row[1])} sx={{ textTransform: 'none', width: '100%', justifyContent: 'flex-start' }}>
                                                    {row[3] + " " + row[0] + " your post"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow><TableCell>Henüz bir aktivite bulunmuyor.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export default UserActivity;