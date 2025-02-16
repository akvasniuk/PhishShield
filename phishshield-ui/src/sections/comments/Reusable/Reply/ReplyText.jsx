import { Typography } from "@mui/material";
import Tag from "./Tag.jsx";

const ReplyText = ({ repText, onTar }) => {
  return (
      <Typography
          component="div"
          sx={{
            color: "neutral.grayishBlue",
            p: "20px 0",
            fontSize: "1rem",
            lineHeight: 1.5,
            wordBreak: "break-word",
            transition: "all 0.3s ease",
            position: "relative",
            "&:hover": {
              color: "neutral.darkBlue",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transform: "scale(1.02)",
            },
          }}
      >
        <Tag onTar={onTar} />
        {" "}
        <span style={{ fontWeight: 500 }}>{repText}</span>
      </Typography>
  );
};

export default ReplyText;