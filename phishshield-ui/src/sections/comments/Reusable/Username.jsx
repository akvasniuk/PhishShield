import { Typography } from "@mui/material";
import React from "react";
import YouTag from "../YouTag.jsx";
import { useAuth } from "../../../hooks/use-auth.js";

const Username = ({ username }) => {
    const user = useAuth().user;
    const userUsername = `${user.firstname} ${user.lastname}`;

    return (
        <>
            <Typography
                fontWeight="bold"
                sx={{
                    color: "neutral.darkBlue",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    position: "relative",
                    "&:hover": {
                        color: "custom.moderateBlue",
                        textShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                        transform: "scale(1.05)",
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        bottom: "-4px",
                        width: "0%",
                        height: "2px",
                        backgroundColor: "custom.moderateBlue",
                        transition: "width 0.3s ease",
                    },
                    "&:hover::after": {
                        width: "100%",
                    },
                }}
            >
                {username}
            </Typography>
            {username === userUsername && (
                <YouTag
                    sx={{
                        marginLeft: "8px",
                        animation: "fadeIn 0.5s ease-in-out",
                        "@keyframes fadeIn": {
                            from: { opacity: 0 },
                            to: { opacity: 1 },
                        },
                    }}
                />
            )}
        </>
    );
};

export default Username;