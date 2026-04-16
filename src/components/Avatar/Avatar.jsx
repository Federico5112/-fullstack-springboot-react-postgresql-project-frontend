import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ListItem, List, ListItemSecondaryAction, Radio } from '@mui/material';
import { PutWithAuth, RefreshToken } from '../../services/HttpService';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        margin: 50
    },
    modal: {
        display: "flex",
        maxWidth: 200,
    },
});

function Avatar(props) {
    const {avatarId, userId, userName} = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(avatarId);

    const saveAvatar = () => {
        const userId = localStorage.getItem("currentUser");


        if (!userId) {
            console.error("Kullanıcı ID bulunamadı, login işlemi hatalı!");
            return;
        }

        PutWithAuth(`/users/${userId}/avatar`, {
            avatar: selectedValue,
        })
            .then((res) => {
                if (res.ok) {
                    localStorage.setItem("avatarId", selectedValue);
                    window.location.reload();
                    
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
                                saveAvatar();
                            }
                        })
                        .catch((err) => console.log("Refresh Hatası:", err));
                } else {
                    return res.json();
                }
            })
            .catch((err) => console.log("Avatar Kayıt Hatası:", err))
    }


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        saveAvatar();
    };

    return (
        <div>
            <Card className={classes.root}>
                <CardMedia
                    component="img"
                    alt="User Avatar"
                    image={`/avatars/avatar${selectedValue}.png`}
                    title="User Avatar"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {userName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        User info
                    </Typography>
                </CardContent>
                <CardActions>
                    {localStorage.getItem("currentUser") == userId ? <Button size="small" color="primary"  onClick={handleOpen}>
                        Change Avatar
                    </Button> : ""}
                </CardActions>
            </Card>
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <List dense>
                    {[1, 2, 3, 4, 5, 6].map((key) => {
                        const labelId = `checkbox-list-secondary-label-${key}`;
                        return (
                            <ListItem key={key} button>
                                <CardMedia
                                    style = {{maxWidth: 100}}
                                    component="img"
                                    alt={`Avatar n°${key}`}
                                    image={`/avatars/avatar${key}.png`}
                                    title="User Avatar"
                                />
                                <ListItemSecondaryAction>
                                    <Radio
                                        edge="end"
                                        value= {key}
                                        onChange={handleChange}
                                        checked={""+selectedValue === ""+key}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </Modal>
        </div>
    );
}

export default Avatar;