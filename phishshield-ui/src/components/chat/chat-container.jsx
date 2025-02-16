import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./chat-input.jsx";
import { chatService } from "../../services";
import { useAuth } from "../../hooks/use-auth.js";

export default function ChatContainer({ currentChat, socket }) {
    const user = useAuth().getUser();

    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        const receiveMessages = async () => {
            try {
                const { data } = await chatService.getMessages(user._id, {
                    from: user._id,
                    to: currentChat._id,
                });
                setMessages(data);
            } catch (e) {
                console.log(e);
            }
        };

        receiveMessages();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: user._id,
            msg,
        });

        await chatService.addMessage(user._id, {
            from: user._id,
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-receive", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                height: "100%",
                animation: "fadeIn 0.5s ease-in-out",
                "@keyframes fadeIn": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexShrink={0}
                px={2}
                sx={{
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        alt={currentChat.firstname + " " + currentChat.lastname}
                        src={currentChat.avatar}
                        sx={{ height: "3rem", width: "3rem" }}
                    />
                    <Typography variant="h6" color="white">
                        {`${currentChat.firstname} ${currentChat.lastname}`}
                    </Typography>
                </Box>
            </Box>

            <Box
                flex={1}
                overflow="auto"
                px={2}
                py={1}
                sx={{
                    "&::-webkit-scrollbar": {
                        width: "0.2rem",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ffffff39",
                        width: "0.1rem",
                        borderRadius: "1rem",
                    },
                }}
            >
                {messages.map((message, index) => (
                    <Box
                        ref={index === messages.length - 1 ? scrollRef : null}
                        key={uuidv4()}
                        display="flex"
                        justifyContent={message.fromSelf ? "flex-end" : "flex-start"}
                        sx={{
                            animation: "slideUp 0.5s ease",
                            "@keyframes slideUp": {
                                "0%": { opacity: 0, transform: "translateY(20px)" },
                                "100%": { opacity: 1, transform: "translateY(0)" },
                            },
                        }}
                    >
                        <Paper
                            elevation={5}
                            sx={{
                                padding: "1rem",
                                fontSize: "1.1rem",
                                borderRadius: "1rem",
                                maxWidth: "40%",
                                overflowWrap: "break-word",
                                color: "#d1d1d1",
                                backgroundColor: message.fromSelf ? "#4f04ff21" : "#9900ff20",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
                                },
                                "@media screen and (min-width: 720px) and (max-width: 1080px)": {
                                    maxWidth: "70%",
                                },
                            }}
                        >
                            {message.message}
                        </Paper>
                    </Box>
                ))}
            </Box>

            <Box
                sx={{
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                    zIndex: 100,
                }}
                flexShrink={0}
            >
                <ChatInput handleSendMsg={handleSendMsg} />
            </Box>
        </Box>
    );
}