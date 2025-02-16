import React, { useState } from "react";
import { Avatar, Card, Stack, ThemeProvider, Box, IconButton } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import RepliesSection from "./RepliesSection.jsx";
import ConfirmDelete from "./ConfirmDelete.jsx";
import Username from "./Reusable/Username.jsx";
import CreatedAt from "./Reusable/CreatedAt.jsx";
import CommentText from "./Reusable/Comment/CommentText.jsx";
import EditableCommentField from "./Reusable/Comment/EditableCommentField.jsx";
import EditButton from "./Reusable/Buttons/TextButtons/EditButton.jsx";
import DeleteButton from "./Reusable/Buttons/TextButtons/DeleteButton.jsx";
import ReplyButton from "./Reusable/Buttons/TextButtons/ReplyButton.jsx";
import UpdateButton from "./Reusable/Buttons/BgButtons/UpdateButton.jsx";
import { useAuth } from "../../hooks/use-auth.js";
import theme from "./style";

const fadeInScale = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const Comment = ({ onPass }) => {
    const { t } = useTranslation();
    const authUser = useAuth().getUser();
    const { userIsAuthenticated } = useAuth();
    const { _id, comment, createdAt, replies, username, user } = onPass;

    const [clicked, setClicked] = useState(false);
    const [editingComm, setEditingComm] = useState(false);
    const [commentText, setCommentText] = useState(comment);
    const [openModal, setOpenModal] = useState(false);
    const regUser = JSON.parse(localStorage.getItem("user"))?.role;

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    return (
        <ThemeProvider theme={theme}>
            <ConfirmDelete onOpen={openModal} onClose={handleClose} id={_id} />
            <Card
                sx={{
                    p: 2,
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    animation: `${fadeInScale} 0.4s ease-in-out`,
                    "&:hover": {
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <Box sx={{ p: "15px" }}>
                    <Stack spacing={2} direction="row">
                        <Avatar
                            src={user?.avatar}
                            sx={{
                                width: 48,
                                height: 48,
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                },
                            }}
                        />
                        <Box sx={{ width: "100%" }}>
                            <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
                                <Stack spacing={1} direction="row" alignItems="center">
                                    <Username username={username} />
                                    <CreatedAt createdAt={createdAt} />
                                </Stack>
                                {(user?._id === authUser?._id || regUser === "ADMIN") ? (
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            onClick={handleOpen}
                                            color="error"
                                            sx={{
                                                transition: "transform 0.2s ease",
                                                "&:hover": {
                                                    transform: "scale(1.1)",
                                                },
                                            }}
                                        >
                                            <DeleteButton />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => setEditingComm(!editingComm)}
                                            color="primary"
                                            sx={{
                                                transition: "transform 0.2s ease",
                                                "&:hover": {
                                                    transform: "scale(1.1)",
                                                },
                                            }}
                                        >
                                            <EditButton editingComm={editingComm} />
                                        </IconButton>
                                    </Stack>
                                ) : userIsAuthenticated() ? (
                                    <IconButton
                                        onClick={() => setClicked(!clicked)}
                                        color="secondary"
                                        sx={{
                                            transition: "transform 0.2s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                            },
                                        }}
                                    >
                                        <ReplyButton />
                                    </IconButton>
                                ) : null}
                            </Stack>
                            {editingComm ? (
                                <>
                                    <EditableCommentField
                                        commentText={commentText}
                                        setCommentText={setCommentText}
                                        placeHolder={t("comment.editPlaceholder")}
                                        sx={{
                                            borderRadius: "8px",
                                            transition: "box-shadow 0.3s ease",
                                            "&:focus-within": {
                                                boxShadow: "0 0 6px rgba(66, 133, 244, 0.4)",
                                            },
                                        }}
                                    />
                                    <UpdateButton
                                        label={t("comment.updateButton")}
                                        commentText={commentText}
                                        editingComm={editingComm}
                                        setEditingComm={setEditingComm}
                                        commentId={_id}
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: "#fff",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.dark,
                                                transform: "scale(1.05)",
                                                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                                            },
                                        }}
                                    />
                                </>
                            ) : (
                                <CommentText commentText={commentText} />
                            )}
                        </Box>
                    </Stack>
                </Box>
            </Card>
            {replies && (
                <RepliesSection
                    onReplies={replies}
                    onClicked={clicked}
                    onTar={username}
                    userId={user?._id}
                    setClicked={setClicked}
                    id={_id}
                />
            )}
        </ThemeProvider>
    );
};

export default Comment;