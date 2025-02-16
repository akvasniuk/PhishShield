import { Avatar, Card, Stack, ThemeProvider, Box } from "@mui/material";
import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import AddReplyButton from "./Reusable/Buttons/BgButtons/AddReplyButton.jsx";
import EditableReplyField from "./Reusable/Reply/EditableReplyField.jsx";
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

const AddReply = ({ onAdd, setClicked, clickedFun }) => {
    const { t } = useTranslation();
    const user = useAuth().user;

    const [replyText, setReplyText] = useState("");

    return (
        <ThemeProvider theme={theme}>
            <Card
                sx={{
                    p: "15px",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    animation: `${fadeInScale} 0.3s ease-in-out`,
                    "&:hover": {
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                    },
                }}
            >
                <Box sx={{ p: "15px" }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                            src={user.avatar}
                            variant="rounded"
                            alt={t("addReply.avatarAlt")}
                            sx={{
                                width: 40,
                                height: 40,
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <EditableReplyField
                            placeHolder={t("addReply.placeholder")}
                            setText={setReplyText}
                            text={replyText}
                            sx={{
                                flexGrow: 1,
                                borderRadius: "8px",
                                transition: "transform 0.2s ease",
                                "&:focus": {
                                    transform: "scale(1.02)",
                                },
                            }}
                        />
                        <AddReplyButton
                            label={t("addReply.addButton")}
                            onAdd={onAdd}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            setClicked={setClicked}
                            clickedFun={clickedFun}
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
        </ThemeProvider>
    );
};

export default AddReply;