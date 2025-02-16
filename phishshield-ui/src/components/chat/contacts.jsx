import React, { useState } from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import Logo from "../../assets/images/shield.svg";
import { useAuth } from "../../hooks/use-auth.js";
import { useTranslation } from "react-i18next";

export default function Contacts({ contacts, changeChat }) {
    const { t } = useTranslation();
    const user = useAuth().getUser();
    const userName = `${user.firstname} ${user.lastname}`;

    const [currentSelected, setCurrentSelected] = useState(undefined);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    return (
        <>
            {userName && (
                <Box
                    display="grid"
                    gridTemplateRows="10% 75% 15%"
                    overflow="hidden"
                    sx={{
                        height: "100%",
                        animation: "fadeIn 0.5s ease-in-out",
                        "@keyframes fadeIn": {
                            "0%": { opacity: 0, transform: "translateY(10px)" },
                            "100%": { opacity: 1, transform: "translateY(0)" },
                        },
                        boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="1rem"
                        sx={{
                            animation: "slideIn 0.6s ease-in-out",
                            "@keyframes slideIn": {
                                "0%": { transform: "translateX(-50px)", opacity: 0 },
                                "100%": { transform: "translateX(0)", opacity: 1 },
                            },
                        }}
                    >
                        <Avatar src={Logo} alt="logo" sx={{ height: "2rem", width: "auto" }} />
                        <Typography
                            variant="h6"
                            color="white"
                            sx={{ textTransform: "uppercase" }}
                        >
                            {t("contacts.brand_name")}
                        </Typography>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap="0.8rem"
                        overflow="auto"
                        sx={{
                            "&::-webkit-scrollbar": {
                                width: "0.2rem",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#ffffff39",
                                borderRadius: "1rem",
                            },
                        }}
                    >
                        {contacts.map((contact, index) => (
                            <Paper
                                key={contact._id}
                                onClick={() => changeCurrentChat(index, contact)}
                                sx={{
                                    backgroundColor:
                                        index === currentSelected ? "#9a86f3" : "#ffffff34",
                                    cursor: "pointer",
                                    width: "90%",
                                    minHeight: "5rem",
                                    borderRadius: "0.2rem",
                                    padding: "0.4rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    transition: "all 0.4s ease-in-out",
                                    transform: index === currentSelected ? "scale(1.05)" : "scale(1)",
                                    boxShadow:
                                        index === currentSelected
                                            ? "0px 8px 15px rgba(154, 134, 243, 0.5)"
                                            : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                    "&:hover": {
                                        backgroundColor: "#9a86f3",
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 8px 15px rgba(154, 134, 243, 0.5)",
                                    },
                                }}
                                elevation={index === currentSelected ? 3 : 1}
                            >
                                <Avatar
                                    src={contact?.avatar}
                                    alt="avatar"
                                    sx={{
                                        height: "3rem",
                                        width: "3rem",
                                    }}
                                />
                                <Typography variant="h6" color="white">
                                    {`${contact.firstname} ${contact.lastname}`}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap="2rem"
                        sx={{
                            "@media screen and (min-width: 720px) and (max-width: 1080px)": {
                                gap: "0.5rem",
                            },
                            animation: "fadeInUser 0.8s ease-in-out",
                            "@keyframes fadeInUser": {
                                "0%": { opacity: 0, transform: "translateY(30px)" },
                                "100%": { opacity: 1, transform: "translateY(0)" },
                            },
                        }}
                    >
                        <Avatar
                            src={user?.avatar}
                            alt="avatar"
                            sx={{
                                height: "4rem",
                                width: "4rem",
                                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.5)",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                },
                            }}
                        />
                        <Typography
                            variant="h6"
                            color="white"
                            sx={{
                                "@media screen and (min-width: 720px) and (max-width: 1080px)": {
                                    fontSize: "1rem",
                                },
                            }}
                        >
                            {t("contacts.current_user_name", { userName })}
                        </Typography>
                    </Box>
                </Box>
            )}
        </>
    );
}