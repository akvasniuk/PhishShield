import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import { useTranslation } from "react-i18next";

import { Iconify } from "../../components/iconify/index.js";

export function UserTableToolbar({
                                     numSelected,
                                     filterFirstName,
                                     filterLastName,
                                     filterEmail,
                                     onFilterChange,
                                 }) {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState("firstname");

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (sortBy) => {
        // Reset the filters when a sort is chosen
        onFilterChange("firstname", "");
        onFilterChange("lastname", "");
        onFilterChange("email", "");

        setActiveFilter(sortBy);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <Toolbar
            sx={{
                height: 96,
                display: "flex",
                justifyContent: "space-between",
                p: (theme) => theme.spacing(0, 1, 0, 3),
                ...(numSelected > 0 && {
                    color: "primary.main",
                    bgcolor: "primary.lighter",
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {t("UserTableToolbar.selected", { count: numSelected })}
                </Typography>
            ) : (
                <OutlinedInput
                    fullWidth
                    value={
                        activeFilter === "firstname"
                            ? filterFirstName
                            : activeFilter === "lastname"
                                ? filterLastName
                                : filterEmail
                    }
                    onChange={(e) => onFilterChange(activeFilter, e.target.value)}
                    placeholder={`${t("UserTableToolbar.filter_by")} ${t(
                        `UserTableToolbar.${activeFilter}`
                    )}`}
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify
                                width={20}
                                icon="eva:search-fill"
                                sx={{ color: "text.disabled" }}
                            />
                        </InputAdornment>
                    }
                    sx={{ maxWidth: 320 }}
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title={t("UserTableToolbar.delete")}>
                    <IconButton>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                </Tooltip>
            ) : (
                <>
                    <Tooltip title={t("UserTableToolbar.filter_list")}>
                        <IconButton onClick={handleOpen}>
                            <Iconify icon="ic:round-filter-list" />
                        </IconButton>
                    </Tooltip>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem onClick={() => handleSort("firstname")}>
                            {t("UserTableToolbar.filter_by")} {t("UserTableToolbar.firstname")}
                        </MenuItem>
                        <MenuItem onClick={() => handleSort("lastname")}>
                            {t("UserTableToolbar.filter_by")} {t("UserTableToolbar.lastname")}
                        </MenuItem>
                        <MenuItem onClick={() => handleSort("email")}>
                            {t("UserTableToolbar.filter_by")} {t("UserTableToolbar.email")}
                        </MenuItem>
                    </Popover>
                </>
            )}
        </Toolbar>
    );
}