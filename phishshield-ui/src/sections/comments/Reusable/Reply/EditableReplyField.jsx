import { TextField } from "@mui/material";
import React from "react";

const EditableReplyField = ({ setText, placeHolder, content, repText }) => {
    return (
        <TextField
            sx={{
                p: "20px 1",
                "& .MuiOutlinedInput-root": {
                    bgcolor: "#F9FAFB",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                    },
                    "&.Mui-focused": {
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                        borderColor: "#3B82F6",
                    },
                    transition: "all 0.3s ease",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#CBD5E1",
                    transition: "all 0.3s ease",
                },
                "& .MuiOutlinedInput-input": {
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "#374151",
                },
                "& .MuiInputLabel-root": {
                    color: "#6B7280",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3B82F6",
                },
            }}
            multiline
            fullWidth
            minRows={4}
            id="outlined-multilined"
            placeholder={placeHolder}
            value={repText}
            onChange={(e) => {
                setText(e.target.value);
            }}
        />
    );
};

export default EditableReplyField;