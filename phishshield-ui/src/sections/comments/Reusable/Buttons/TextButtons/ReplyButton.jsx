import { Button } from "@mui/material";
import replyArrow from "../../../../../assets/images/icons/icon-reply.svg";
import { useTranslation } from "react-i18next"; // Import i18n hook

const ReplyButton = ({ functionality }) => {
    const { t } = useTranslation(); // Initialize translation hook

    return (
        <Button
            startIcon={<img src={replyArrow} alt={t("buttons.replyIconAlt")} />} // Localized alt text
            sx={{
                color: "custom.moderateBlue", // Default text and icon color
                fontWeight: 500, // Medium bold weight
                textTransform: "capitalize", // Capitalize the first letter of the text
                padding: "8px 16px", // Comfortable padding
                backgroundColor: "rgba(59, 130, 246, 0.1)", // Light blue background
                borderRadius: "8px", // Rounded corners for a softer look
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for visual depth
                transition: "all 0.3s ease", // Smooth transition for hover and click interactions
                "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.2)", // Darker blue tint on hover
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Deeper shadow on hover
                    transform: "scale(1.05)", // Slight scale-up effect for interactivity
                },
                "&:active": {
                    transform: "scale(0.95)", // Scale-down effect to simulate press
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // Shadow reduction on press
                },
            }}
            onClick={() => {
                functionality();
            }}
        >
            {t("buttons.reply")} {/* Localized button text */}
        </Button>
    );
};

export default ReplyButton;