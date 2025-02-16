import { Typography } from "@mui/material";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { enUS, fr, de, uk } from "date-fns/locale";

const CreatedAt = ({ createdAt }) => {
    const { i18n } = useTranslation();

    const localeMap = {
        en: enUS,
        fr: fr,
        de: de,
        uk: uk,
    };

    const currentLocale = localeMap[i18n.language] || enUS;

    const formatTimestamp = (timestamp = new Date()) => {
        const parsedDate = new Date(timestamp);
        return formatDistanceToNow(parsedDate, { addSuffix: true, locale: currentLocale });
    };

    return (
        <Typography
            sx={{
                color: "#64748B",
                fontSize: "0.875rem",
                fontWeight: 500,
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                    color: "#475569",
                    transform: "scale(1.05)",
                    textShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0%",
                    height: "2px",
                    bottom: "-2px",
                    left: 0,
                    backgroundColor: "#475569",
                    transition: "width 0.3s ease",
                },
                "&:hover::after": {
                    width: "100%",
                },
            }}
        >
            {formatTimestamp(createdAt)}
        </Typography>
    );
};

export default CreatedAt;