import { Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next"; // Import i18n hook

const EditButton = ({ functionality, editingComm }) => {
    const { t } = useTranslation(); // Initialize translation hook

    return (
        <Button
            startIcon={<Edit />}
            disabled={editingComm}
            sx={{
                color: "custom.moderateBlue", // Default text and icon color
                fontWeight: 500, // Medium bold weight
                textTransform: "capitalize", // Capitalize the first letter
                padding: "8px 16px", // Padding for comfortable clickable area
                borderRadius: "8px", // Rounded corners for a modern design
                backgroundColor: editingComm ? "rgba(0, 0, 0, 0.1)" : "rgba(59, 130, 246, 0.1)", // Adjust background for active/disabled state
                boxShadow: editingComm
                    ? "none" // No shadow when disabled
                    : "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth in normal state
                transition: "all 0.3s ease", // Smooth transitions for hover effects
                "&:hover": !editingComm && {
                    backgroundColor: "rgba(59, 130, 246, 0.2)", // Darker blue tint on hover
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover for depth
                    transform: "scale(1.05)", // Slight scale-up on hover
                },
                "&:active": !editingComm && {
                    transform: "scale(0.95)", // Scale-down effect for "press" feedback
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // Minimal shadow on "press"
                },
                "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.3)", // Grayish tone for disabled text
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Faint background for disabled state
                    cursor: "not-allowed", // Cursor indicating the button is disabled
                },
            }}
            onClick={() => {
                functionality();
            }}
        >
            {t("buttons.edit")} {/* Fetch the localized string for the button */}
        </Button>
    );
};

export default EditButton;