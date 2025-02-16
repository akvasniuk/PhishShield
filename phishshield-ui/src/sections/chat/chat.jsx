import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Box, Grid, Paper } from "@mui/material";
import ChatContainer from "../../components/chat/chat-container.jsx";
import Contacts from "../../components/chat/contacts.jsx";
import Welcome from "../../components/chat/welcome.jsx";
import { useAuth } from "../../hooks/use-auth.js";
import { host } from "../../configs";
import { userService } from "../../services";
import { useTranslation } from "react-i18next";

export default function Chat() {
    const { t } = useTranslation();
    const currentUser = useAuth().getUser();

    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }

        const getAdmins = async () => {
            try {
                const { data } = await userService.getAdmins(
                    currentUser._id,
                    currentUser.role === "ADMIN"
                );
                setContacts(data);
            } catch (e) {
                console.error(t("errors.get_admins_error", { error: e }));
            }
        };

        getAdmins();
    }, []);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <Box
            sx={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflow: "auto",
                animation: "fadeIn 0.5s ease-in-out",
                "@keyframes fadeIn": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            }}
        >
            <Paper
                sx={{
                    height: "75vh",
                    width: "75vw",
                    backgroundColor: "#00000076",
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "35% 65%",
                        sm: "25% 75%",
                    },
                    borderRadius: "1.5rem",
                    overflow: "auto",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                        boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.5)",
                        transform: "scale(1.02)",
                    },
                }}
                elevation={3}
            >
                <Grid
                    item
                    sx={{
                        animation: "slideInLeft 0.5s ease-in-out",
                        "@keyframes slideInLeft": {
                            "0%": { transform: "translateX(-100%)" },
                            "100%": { transform: "translateX(0)" },
                        },
                    }}
                >
                    <Contacts
                        contacts={contacts}
                        changeChat={handleChatChange}
                        title={t("chat.contacts_title")}
                    />
                </Grid>
                <Grid
                    item
                    sx={{
                        animation: currentChat
                            ? "slideInRight 0.5s ease-in-out"
                            : "fadeIn 0.5s ease-in-out",
                        "@keyframes slideInRight": {
                            "0%": { transform: "translateX(100%)" },
                            "100%": { transform: "translateX(0)" },
                        },
                    }}
                >
                    {currentChat === undefined ? (
                        <Welcome greetingMessage={t("chat.welcome_message")} />
                    ) : (
                        <ChatContainer
                            currentChat={currentChat}
                            socket={socket}
                            chatTitle={t("chat.chat_title", { name: currentChat.name })}
                        />
                    )}
                </Grid>
            </Paper>
        </Box>
    );
}