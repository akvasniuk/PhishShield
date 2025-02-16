import { Avatar, Card, Stack, Box, ThemeProvider, Paper } from "@mui/material";
import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import EditableCommentField from "./Reusable/Comment/EditableCommentField.jsx";
import SendButton from "./Reusable/Buttons/BgButtons/SendButton.jsx";
import theme from "./style";
import { useAuth } from "../../hooks/use-auth.js";

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

const AddComment = () => {
    const { t } = useTranslation();
    const [commentTxt, setCommentTxt] = useState("");
    const user = useAuth().getUser();

    return (
        <ThemeProvider theme={theme}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    animation: `${fadeInScale} 0.3s ease-in-out`,
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <Card
                    sx={{
                        boxShadow: "none",
                        background: "white",
                        borderRadius: "12px",
                    }}
                >
                    <Box sx={{ p: "15px" }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Avatar
                                src={user?.avatar}
                                variant="circular"
                                alt={t("addComment.avatarAlt")}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.1)",
                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                    },
                                    "&:active": {
                                        transform: "scale(0.95)",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    },
                                }}
                            />
                            <EditableCommentField
                                commentText={commentTxt}
                                setCommentText={setCommentTxt}
                                sx={{
                                    flexGrow: 1,
                                    borderRadius: "8px",
                                    transition: "transform 0.2s ease",
                                    "&:focus-within": {
                                        transform: "scale(1.02)",
                                        boxShadow: "0 0 6px rgba(66, 133, 244, 0.4)",
                                    },
                                }}
                            />
                            <SendButton
                                label={t("addComment.sendButton")}
                                commentTxt={commentTxt}
                                setCommentTxt={setCommentTxt}
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: "#fff",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.dark,
                                        boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            />
                        </Stack>
                    </Box>
                </Card>
            </Paper>
        </ThemeProvider>
    );
};

export default AddComment;