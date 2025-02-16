import { Typography } from "@mui/material";
import React from "react";

const Tag = ({ onTar }) => {
    return (
        <Typography
            sx={{
                color: "custom.moderateBlue",
                width: "fit-content",
                display: "inline-block",
                fontWeight: 500,
                fontSize: "0.95rem",
                padding: "2px 8px",
                borderRadius: "6px",
                transition: "all 0.3s ease",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                "&:hover": {
                    color: "white",
                    backgroundColor: "custom.moderateBlue",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transform: "scale(1.1)",
                },
                "&:active": {
                    transform: "scale(0.95)",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
                },
            }}
        >
            {`@${onTar}`}
        </Typography>
    );
};

export default Tag;