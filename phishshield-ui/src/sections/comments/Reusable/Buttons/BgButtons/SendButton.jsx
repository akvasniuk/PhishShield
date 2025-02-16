import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../../../../../hooks/use-auth.js";
import { commentService } from "../../../../../services";
import { useDispatch } from "react-redux";
import { addComment } from "../../../../../store/reducers/commentSlice";
import { useTranslation } from "react-i18next";

const SendButton = ({ setCommentTxt, commentTxt }) => {
    const { t } = useTranslation();
    const user = useAuth().getUser();
    const username = `${user?.firstname} ${user?.lastname}`;
    const dispatch = useDispatch();

    const handleSendButton = async (e) => {
        if (!commentTxt.trim()) {
            e.preventDefault();
        } else {
            try {
                const { data } = await commentService.createComment(user?._id, {
                    comment: commentTxt.trim(),
                    username,
                });
                console.log(data);
                // eslint-disable-next-line no-restricted-globals
                dispatch(addComment({ ...data, user }));
            } catch (e) {
                console.log(e);
            }
        }

        setCommentTxt("");
    };

    return (
        <Button
            size="large"
            sx={{
                bgcolor: "custom.moderateBlue",
                color: "neutral.white",
                p: "10px 30px",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                fontWeight: 500,
                textTransform: "capitalize",
                transition: "all 0.3s ease",
                "&:hover": {
                    bgcolor: "custom.lightGrayishBlue",
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
            onClick={handleSendButton}
            disabled={!commentTxt.trim()}
        >
            {t("buttons.send")}
        </Button>
    );
};

export default SendButton;