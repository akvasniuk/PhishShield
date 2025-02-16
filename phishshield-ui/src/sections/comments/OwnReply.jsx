import React, { useEffect, useState } from "react";
import { Box, Card, Stack, Avatar } from "@mui/material";
import { useTranslation } from "react-i18next"; // Import translation hook
import ConfirmDelete from "./ConfirmDelete.jsx";
import Username from "./Reusable/Username.jsx";
import CreatedAt from "./Reusable/CreatedAt.jsx";
import DeleteButton from "./Reusable/Buttons/TextButtons/DeleteButton.jsx";
import EditButton from "./Reusable/Buttons/TextButtons/EditButton.jsx";
import ReplyText from "./Reusable/Reply/ReplyText.jsx";
import UpdateReplyButton from "./Reusable/Buttons/BgButtons/UpdateReplyButton.jsx";
import EditableReplyField from "./Reusable/Reply/EditableReplyField.jsx";
import { commentService } from "../../services";

const OwnReply = ({
                      onContent,
                      onCount,
                      onTar,
                      onDel,
                      comId,
                      user,
                      onTime,
                      id,
                  }) => {
    const { t } = useTranslation();
    const [clicked, setClicked] = useState(false);
    const [editingRep, setEditingRep] = useState(false);
    const [repText, setRepText] = useState(onContent);
    const [openModal, setOpenModal] = useState(false);
    const [updatedClicked, setUpdatedClicked] = useState(false);

    useEffect(() => {
        const handleEdit = async () => {
            try {
                if (updatedClicked) {
                    await commentService.editReplyComment(user._id, id, comId, {
                        username: `${user.firstname} ${user.lastname}`,
                        reply: repText,
                    });
                    setUpdatedClicked(false);
                }
            } catch (e) {
                console.log(t("ownReply.error"));
            }
        };

        handleEdit();
    }, [updatedClicked, user, id, comId, repText, t]);

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleEdit = () => {
        setClicked(!clicked);
        setEditingRep(!editingRep);
    };

    return (
        <>
            <ConfirmDelete
                onOpen={openModal}
                onClose={handleClose}
                comId={comId}
                onDel={onDel}
            />
            <Card
                sx={{
                    padding: "15px",
                    marginBottom: "15px",
                    borderRadius: "10px",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    },
                    animation: "fadeIn 0.5s ease-in-out",
                    "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(10px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                    },
                }}
            >
                <Box>
                    <Stack spacing={2} direction="row" alignItems="flex-start">
                        <Avatar
                            src={user?.avatar}
                            alt={`${user.firstname} ${user.lastname}`}
                            sx={{
                                width: 48,
                                height: 48,
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                },
                            }}
                        />
                        <Box sx={{ width: "100%" }}>
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <Username username={`${user.firstname} ${user.lastname}`} />
                                    <CreatedAt createdAt={onTime} />
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <DeleteButton
                                        functionality={handleOpen}
                                        sx={{
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                                color: "red",
                                            },
                                        }}
                                    />
                                    <EditButton
                                        editingComm={clicked}
                                        functionality={handleEdit}
                                        sx={{
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                                color: "blue",
                                            },
                                        }}
                                    />
                                </Stack>
                            </Stack>

                            {editingRep ? (
                                <>
                                    <EditableReplyField
                                        repText={repText}
                                        setText={setRepText}
                                        content={onContent}
                                        placeHolder={t("ownReply.editPlaceholder")}
                                        sx={{
                                            marginTop: "10px",
                                            borderRadius: "8px",
                                            backgroundColor: "#f7f7f7",
                                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                                            "&:focus-within": {
                                                boxShadow: "0 0 8px rgba(66, 133, 244, 0.4)",
                                            },
                                        }}
                                    />
                                    <UpdateReplyButton
                                        clicked={clicked}
                                        editingRep={editingRep}
                                        repText={repText}
                                        setClicked={setClicked}
                                        setEditingRep={setEditingRep}
                                        setUpdatedClicked={setUpdatedClicked}
                                        sx={{
                                            marginTop: "10px",
                                            backgroundColor: "primary.main",
                                            color: "#fff",
                                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: "primary.dark",
                                                transform: "scale(1.05)",
                                                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                                            },
                                        }}
                                    />
                                </>
                            ) : (
                                <ReplyText onTar={onTar} repText={repText} user={user} />
                            )}
                        </Box>
                    </Stack>
                </Box>
            </Card>
        </>
    );
};

export default OwnReply;