import { Typography } from "@mui/material";
import React from "react";

const CommentText = ({ commentText }) => {
  return (
      <Typography
          sx={{
            color: "neutral.grayishBlue",
            p: "20px 0",
            fontSize: "1rem",
            lineHeight: 1.6,
            wordBreak: "break-word",
            transition: "all 0.3s ease",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transform: "scale(1.02)",
            },
          }}
      >
        {commentText}
      </Typography>
  );
};

export default CommentText;