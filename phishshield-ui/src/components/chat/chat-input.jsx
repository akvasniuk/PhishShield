import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { Box, IconButton, TextField, Button, Popover, useTheme } from "@mui/material";
import Picker from "emoji-picker-react";
import { useTranslation } from "react-i18next";

export default function ChatInput({ handleSendMsg }) {
    const { t } = useTranslation();
    const [msg, setMsg] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();

    const handleEmojiPickerOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleEmojiPickerClose = () => {
        setAnchorEl(null);
    };

    const handleEmojiClick = (emojiObject) => {
        setMsg((prev) => prev + emojiObject.emoji);
        handleEmojiPickerClose();
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    const isEmojiPickerOpen = Boolean(anchorEl);

    return (
        <Box
            display="flex"
            gap={2}
            px={2}
            py={1}
            sx={{
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                animation: "fadeSlideUp 0.6s ease-in-out",
                "@keyframes fadeSlideUp": {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "@media (min-width: 720px) and (max-width: 1080px)": {
                    px: 1,
                    gap: 1,
                },
            }}
        >
            <Box display="flex" alignItems="center">
                <IconButton
                    onClick={handleEmojiPickerOpen}
                    aria-label={t("chat_input.emoji_button")}
                    sx={{
                        color: "#ffff00c8",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: "0px 5px 10px rgba(255, 255, 0, 0.5)",
                        },
                    }}
                >
                    <BsEmojiSmileFill size={24} />
                </IconButton>

                <Popover
                    open={isEmojiPickerOpen}
                    anchorEl={anchorEl}
                    onClose={handleEmojiPickerClose}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    PaperProps={{
                        sx: {
                            backgroundColor: "#080420",
                            boxShadow: "0 5px 15px #9a86f3",
                            borderColor: "#9a86f3",
                            animation: "scaleIn 0.3s ease-in-out",
                            "@keyframes scaleIn": {
                                "0%": { transform: "scale(0.8)", opacity: 0 },
                                "100%": { transform: "scale(1)", opacity: 1 },
                            },
                        },
                    }}
                >
                    <Picker
                        onEmojiClick={handleEmojiClick}
                        theme="dark"
                        disableSearchBar
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#9a86f3 #080420",
                        }}
                    />
                </Popover>
            </Box>

            <Box
                component="form"
                onSubmit={sendChat}
                flex={1}
                display="flex"
                alignItems="center"
                gap={2}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={t("chat_input.placeholder")}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    InputProps={{
                        sx: {
                            backgroundColor: "transparent",
                            color: "white",
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "2rem",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                                boxShadow: "0px 5px 15px rgba(154, 134, 243, 0.5)",
                            },
                            "& fieldset": {
                                borderColor: "white",
                            },
                            "&:hover fieldset": {
                                borderColor: "#9a86f3",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#9a86f3",
                            },
                        },
                        "& input": {
                            color: "white",
                            fontSize: "1.2rem",
                            padding: "0.8rem 1rem",
                        },
                        "& input::selection": {
                            backgroundColor: "#9a86f3",
                        },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    aria-label={t("chat_input.send_button")}
                    sx={{
                        padding: { xs: "0.3rem 1rem", md: "0.3rem 2rem" },
                        borderRadius: "2rem",
                        backgroundColor: "#9a86f3",
                        svg: {
                            fontSize: { xs: "1rem", md: "2rem" },
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        },
                        "&:hover": {
                            backgroundColor: "#7b68ee",
                            transform: "scale(1.1)",
                            boxShadow: "0px 5px 15px rgba(123, 104, 238, 0.5)",
                        },
                    }}
                >
                    <IoMdSend size={24} />
                </Button>
            </Box>
        </Box>
    );
}