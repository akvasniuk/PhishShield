import { Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const UpdateReplyButton = ({
                               repText,
                               setClicked,
                               setEditingRep,
                               editingRep,
                               clicked,
                               setUpdatedClicked,
                           }) => {
    const { t } = useTranslation();

    return (
        <Button
            sx={{
                bgcolor: "custom.moderateBlue",
                color: "neutral.white",
                p: "10px 30px",
                float: "right",
                borderRadius: "8px",
                fontWeight: 500,
                textTransform: "capitalize",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                    bgcolor: "custom.lightGrayishBlue",
                    color: "neutral.black",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
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
            onClick={() => {
                if (!repText.trim()) {
                    alert(t("alerts.replyPlaceholderAlert"));
                } else {
                    setEditingRep(!editingRep);
                    setClicked(!clicked);
                    setUpdatedClicked(true);
                }
            }}
            disabled={!repText.trim()}
        >
            {t("buttons.update")}
        </Button>
    );
};

export default UpdateReplyButton;