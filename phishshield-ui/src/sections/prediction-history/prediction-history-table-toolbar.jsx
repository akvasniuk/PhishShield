import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { Iconify } from "../../components/iconify/index.js";

export function PredictionHistoryTableToolbar({
                                                  numSelected,
                                                  filterData,
                                                  filterType,
                                                  filterModel,
                                                  onFilterChange,
                                                  onSortChange,
                                              }) {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState("data");

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (sortBy) => {
        onFilterChange("data", "");
        onFilterChange("type", "");
        onFilterChange("model", "");
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
                    {t("toolbar.selected", { count: numSelected })}
                </Typography>
            ) : (
                <OutlinedInput
                    fullWidth
                    value={
                        activeFilter === "data"
                            ? filterData
                            : activeFilter === "type"
                                ? filterType
                                : filterModel
                    }
                    onChange={(e) => onFilterChange(activeFilter, e.target.value)}
                    placeholder={t("toolbar.filterBy", {
                        field:
                            activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1),
                    })}
                    sx={{ maxWidth: 300 }}
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title={t("actions.delete")}>
                    <IconButton>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                </Tooltip>
            ) : (
                <>
                    <Tooltip title={t("actions.filterList")}>
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
                        <MenuItem onClick={() => handleSort("data")}>
                            {t("toolbar.filterByData")}
                        </MenuItem>
                        <MenuItem onClick={() => handleSort("type")}>
                            {t("toolbar.filterByType")}
                        </MenuItem>
                        <MenuItem onClick={() => handleSort("model")}>
                            {t("toolbar.filterByModel")}
                        </MenuItem>
                    </Popover>
                </>
            )}
        </Toolbar>
    );
}