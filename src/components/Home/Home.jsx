import React, { useState, useEffect } from "react";
import Post from '../Post/Post';
import { Box } from '@mui/material';
import PostForm from "../Post/PostForm";

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPosts = () => {
        fetch("/api/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result);
                },
                (error) => {
                    console.log(error);
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => {
        refreshPosts();
    }, []);

    if (error) {
        return <div> Error !!!</div>;
    } else if (!isLoaded) {
        return <div> Loading... </div>;
    } else {
        return (
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#f0f5ff',
            }}>
                {localStorage.getItem("currentUser") == null ? "" :
                    <PostForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} refreshPosts={refreshPosts} />
                }
                {postList.map(post => (
                    <Post
                        key={post.id}
                        likes={post.postLikes}
                        postId={post.id}
                        userId={post.userId}
                        userName={post.userName}
                        title={post.title}
                        text={post.text}
                    />
                ))}
            </Box>
        );
    }
}

export default Home;