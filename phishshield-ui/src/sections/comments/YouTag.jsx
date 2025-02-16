import { Chip, ThemeProvider } from "@mui/material";
import React from "react";
import theme from "./style";
import { useTranslation } from "react-i18next";

const YouTag = () => {
    const { t } = useTranslation();

    return (
        <ThemeProvider theme={theme}>
            <Chip
                label={t("youTag.label")}
                variant="filled"
                size="small"
                sx={{
                    bgcolor: "custom.moderateBlue",
                    color: "neutral.white",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    paddingX: "6px",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                        bgcolor: "custom.darkBlue",
                    },
                }}
            />
        </ThemeProvider>
    );
};

export default YouTag;