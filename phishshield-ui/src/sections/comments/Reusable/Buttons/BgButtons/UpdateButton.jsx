import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../../../../../hooks/use-auth.js";
import { commentService } from "../../../../../services";
import { useTranslation } from "react-i18next";

const UpdateButton = ({ commentText, editingComm, setEditingComm, commentId }) => {
    const { t } = useTranslation();
    const user = useAuth().getUser();

    const handleEditButton = async () => {
        try {
            if (commentText.trim()) {
                setEditingComm(!editingComm);
                await commentService.editComment(user._id, commentId, { comment: commentText });
            } else {
                alert(t("alerts.deleteCommentWarning"));
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Button
            sx={{
                float: "right",
                bgcolor: "custom.moderateBlue",
                color: "neutral.white",
                p: "10px 30px",
                fontWeight: 500,
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textTransform: "capitalize",
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
            onClick={handleEditButton}
            disabled={!commentText.trim()}
        >
            {t("buttons.update")}
        </Button>
    );
};

export default UpdateButton;