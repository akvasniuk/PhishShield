import { Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next"; // Import i18n hook

const DeleteButton = ({ functionality }) => {
    const { t } = useTranslation(); // Initialize translation hook

    return (
        <Button
            startIcon={<Delete />}
            sx={{
                color: "custom.softRed", // Initial text and icon color
                fontWeight: 500, // Medium bold text weight
                textTransform: "capitalize", // Capitalize the first letter of the text
                backgroundColor: "rgba(255, 82, 82, 0.1)", // Subtle red background to draw attention
                padding: "8px 16px", // Comfortable padding for better click/tap area
                borderRadius: "8px", // Rounded corners for better design
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                transition: "all 0.3s ease", // Smooth animations for hover and focus
                "&:hover": {
                    backgroundColor: "rgba(255, 82, 82, 0.2)", // Slightly darker red background on hover
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // More pronounced shadow on hover
                    transform: "scale(1.05)", // Slight scale-up effect on hover
                },
                "&:active": {
                    transform: "scale(0.95)", // Scale-down effect to simulate a "press"
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // Minimal shadow on press
                },
            }}
            onClick={() => {
                functionality();
            }}
        >
            {t("buttons.delete")} {/* Localized text for the button */}
        </Button>
    );
};

export default DeleteButton;