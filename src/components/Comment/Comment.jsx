import React from "react";
import { Link } from "react-router-dom";
import { CardContent, InputAdornment, OutlinedInput, Avatar } from "@mui/material";

function Comment(props) {
    const { text, userId, userName } = props;

    return (
        <CardContent sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center",
        }}>
            <OutlinedInput
                disabled
                id="outlined-adornment-amount"
                multiline
                inputProps={{ maxLength: 25 }}
                fullWidth
                value={text}
                startAdornment={
                    <InputAdornment position="start">
                        <Link style={{ textDecoration: "none", boxShadow: "none" }} to={{ pathname: '/users/' + userId }}>
                            <Avatar aria-label="recipe" sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {userName ? userName.charAt(0).toUpperCase() : ""}
                            </Avatar>
                        </Link>
                    </InputAdornment>
                }
                sx={{

                    color: 'text.primary',
                    backgroundColor: 'background.paper',

                    '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: (theme) => theme.palette.text.primary,
                    }
                }}
            />
        </CardContent>
    )
}

export default Comment;