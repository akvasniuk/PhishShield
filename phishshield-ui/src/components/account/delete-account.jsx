import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import { useAuth } from "../../hooks/use-auth.js";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/index.js";
import { useTranslation } from "react-i18next";

export function DeleteAccount() {
    const { t } = useTranslation();
    const { getUser, userLogout } = useAuth();
    const user = getUser();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    // Handlers
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await userService.deleteUser(user._id);
            userLogout();
            navigate("/sign-in");
        } catch (error) {
            console.error(t("delete_account.delete_failed"), error);
        }
    };

    return (
        <Box>
            <Card sx={{ width: '90%', marginLeft: "20px" }}>
                <CardHeader
                    subheader={t("delete_account.manage_account")}
                    title={t("delete_account.account_title")}
                />
                <Divider />
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClickOpen}
                    >
                        {t("delete_account.delete_account")}
                    </Button>
                </CardActions>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        {t("delete_account.confirm_title")}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t("delete_account.confirm_message")}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            {t("delete_account.cancel")}
                        </Button>
                        <Button onClick={handleConfirmDelete} color="error" autoFocus>
                            {t("delete_account.confirm")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </Box>
    );
}