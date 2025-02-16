import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import Robot from "../../assets/images/user.gif";
import { useAuth } from "../../hooks/use-auth.js";
import { useTranslation } from "react-i18next";

export default function Welcome() {
    const { t } = useTranslation();
    const user = useAuth().getUser();
    const userName = `${user.firstname} ${user.lastname}`;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            color="white"
            textAlign="center"
            sx={{
                height: "100%",
                animation: "fadeInScale 1s ease-in-out",
                "@keyframes fadeInScale": {
                    "0%": { opacity: 0, transform: "scale(0.9)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                },
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.5)",
                borderRadius: "1rem",
                padding: 4,
            }}
        >
            <Avatar
                src={Robot}
                alt="Robot"
                sx={{
                    height: "20rem",
                    width: "20rem",
                    mb: 2,
                    animation: "bounce 2s infinite",
                    "@keyframes bounce": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-20px)" },
                    },
                }}
            />

            <Typography
                variant="h4"
                sx={{
                    color: "white",
                    mb: 1,
                    animation: "fadeIn 1.5s ease-in-out",
                    "@keyframes fadeIn": {
                        "0%": { opacity: 0 },
                        "100%": { opacity: 1 },
                    },
                }}
            >
                {t("welcome.title", { userName })}
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    color: "#ffffffb3",
                    animation: "fadeIn 2s ease-in-out",
                    "@keyframes fadeIn": {
                        "0%": { opacity: 0 },
                        "100%": { opacity: 1 },
                    },
                }}
            >
                {t("welcome.subtitle")}
            </Typography>
        </Box>
    );
}