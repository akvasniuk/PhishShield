import { TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const EditableCommentField = ({ commentText, setCommentText, placeHolder }) => {
    const { t } = useTranslation();

    return (
        <TextField
            sx={{
                "& .MuiOutlinedInput-root": {
                    bgcolor: "#F9FAFB",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #E5E7EB",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                        borderColor: "#3B82F6",
                    },
                    "&.Mui-focused": {
                        boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.15)",
                        borderColor: "#2563EB",
                    },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                },
                "& .MuiOutlinedInput-input": {
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "#374151",
                    lineHeight: "1.75",
                    padding: "12px",
                },
                "&:hover .MuiOutlinedInput-input": {
                    color: "#111827",
                },
                "& .MuiInputAdornment-root": {
                    alignItems: "flex-start",
                },
            }}
            multiline
            fullWidth
            minRows={4}
            id="comment-field"
            placeholder={t(placeHolder) || t("placeholders.defaultComment")}
            value={commentText}
            onChange={(e) => {
                setCommentText(e.target.value);
            }}
        />
    );
};

export default EditableCommentField;