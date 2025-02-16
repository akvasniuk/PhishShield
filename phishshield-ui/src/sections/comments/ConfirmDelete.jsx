import React from "react";
import {
    Button,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { deleteComment } from "../../store/reducers/commentSlice";
import { useAuth } from "../../hooks/use-auth.js";
import { commentService } from "../../services";
import { useTranslation } from "react-i18next";

const ConfirmDelete = ({ onOpen, onClose, id, onDel, comId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useAuth().getUser();

    const handleDelete = async () => {
        if (onDel) {
            onDel(comId);
        } else {
            try {
                await commentService.deleteComment(user._id, id);
                dispatch(deleteComment(id));
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <Dialog
            open={onOpen}
            onClose={onClose}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    animation: "fadeIn 0.3s ease-in-out",
                },
                "@keyframes fadeIn": {
                    from: {
                        opacity: 0,
                        transform: "scale(0.95)",
                    },
                    to: {
                        opacity: 1,
                        transform: "scale(1)",
                    },
                },
            }}
        >
            <DialogContent
                sx={{
                    maxWidth: "430px",
                    borderRadius: "8px",
                    textAlign: "center",
                    padding: "24px",
                }}
            >
                <DialogTitle
                    sx={{
                        margin: "0 0 20px",
                        fontWeight: 600,
                        fontSize: "1.25rem",
                        color: "neutral.darkBlue",
                    }}
                >
                    {t("confirmDelete.title")}
                </DialogTitle>
                <Typography
                    component="p"
                    sx={{
                        marginBottom: "20px",
                        color: "neutral.grayishBlue",
                        lineHeight: 1.5,
                    }}
                >
                    {t("confirmDelete.message")}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "neutral.grayishBlue",
                            borderRadius: "6px",
                            fontWeight: 500,
                            padding: "10px 20px",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                                backgroundColor: "neutral.grayishBlue",
                                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
                                transform: "scale(1.05)",
                            },
                        }}
                        onClick={onClose}
                    >
                        {t("confirmDelete.cancelButton")}
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "custom.softRed",
                            borderRadius: "6px",
                            fontWeight: 500,
                            padding: "10px 20px",
                            color: "#fff",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                                backgroundColor: "custom.softRed",
                                boxShadow: "0px 5px 15px rgba(255, 100, 100, 0.3)",
                                transform: "scale(1.05)",
                            },
                        }}
                        onClick={handleDelete}
                    >
                        {t("confirmDelete.deleteButton")}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDelete;