import { Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const AddReplyButton = ({ setReplyText, onAdd, replyText, setClicked, clickedFun }) => {
    const { t } = useTranslation();

    return (
        <Button
            size="large"
            sx={{
                bgcolor: "custom.moderateBlue",
                color: "neutral.white",
                p: "10px 30px",
                fontWeight: 500,
                textTransform: "capitalize",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                    bgcolor: "custom.lightGrayishBlue",
                    color: "neutral.black",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                    transform: "scale(1.05)",
                },
                "&:active": {
                    transform: "scale(0.95)",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                },
                "&:disabled": {
                    bgcolor: "custom.lightGrayishBlue",
                    color: "rgba(255, 255, 255, 0.6)",
                    boxShadow: "none",
                    cursor: "not-allowed",
                },
            }}
            onClick={(e) => {
                if (!replyText.trim()) {
                    e.preventDefault();
                } else {
                    onAdd(replyText);
                    setReplyText("");
                    setClicked && setClicked(false);
                    clickedFun && clickedFun(false);
                }
            }}
            disabled={!replyText.trim()}
        >
            {t("buttons.reply")}
        </Button>
    );
};

export default AddReplyButton;