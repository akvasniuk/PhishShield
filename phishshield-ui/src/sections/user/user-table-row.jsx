import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuList from "@mui/material/MenuList";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import { useTranslation } from "react-i18next";
import { Iconify } from "../../components/iconify/index.js";

export function UserTableRow({ row, selected, onSelectRow, onEditUser, onDeleteUser }) {
    const { t } = useTranslation();

    const [openPopover, setOpenPopover] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [editedUser, setEditedUser] = useState({
        firstname: row.firstname,
        lastname: row.lastname,
        role: row.role,
        isUserActivated: row.isUserActivated,
    });

    const handleOpenPopover = useCallback((event) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleOpenEditDialog = () => {
        setEditedUser({
            firstname: row.firstname,
            lastname: row.lastname,
            role: row.role,
            isUserActivated: row.isUserActivated,
        });
        setOpenEditDialog(true);
        handleClosePopover();
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
        handleClosePopover();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleEditChange = (field, value) => {
        setEditedUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = () => {
        onEditUser(row._id, editedUser);
        setOpenEditDialog(false);
    };

    const handleDeleteConfirm = () => {
        onDeleteUser(row._id);
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell component="th" scope="row">
                    <Box gap={2} display="flex" alignItems="center">
                        <Avatar alt={`${row.firstname} ${row.lastname}`} src={row.avatar} />
                        {`${row.firstname} ${row.lastname}`}
                    </Box>
                </TableCell>

                <TableCell>{row.email}</TableCell>

                <TableCell>{row.role}</TableCell>

                <TableCell align="center">
                    {row.isUserActivated ? (
                        <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: "success.main" }} />
                    ) : (
                        "-"
                    )}
                </TableCell>

                <TableCell align="center">
                    {row.isGoogleAuth ? (
                        <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: "success.main" }} />
                    ) : (
                        "-"
                    )}
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <MenuItem onClick={handleOpenEditDialog}>
                        <Iconify icon="solar:pen-bold" />
                        {t("UserTableRow.edit")}
                    </MenuItem>

                    <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: "error.main" }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        {t("UserTableRow.delete")}
                    </MenuItem>
                </MenuList>
            </Popover>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{t("UserTableRow.edit_user")}</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label={t("UserTableRow.firstname")}
                            value={editedUser.firstname}
                            onChange={(e) => handleEditChange("firstname", e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t("UserTableRow.lastname")}
                            value={editedUser.lastname}
                            onChange={(e) => handleEditChange("lastname", e.target.value)}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">{t("UserTableRow.role")}</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={editedUser.role}
                                onChange={(e) => handleEditChange("role", e.target.value)}
                                label={t("UserTableRow.role")}
                            >
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="USER">User</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="verified-select-label">{t("UserTableRow.is_verified")}</InputLabel>
                            <Select
                                labelId="verified-select-label"
                                value={editedUser.isUserActivated ? "Verified" : "Not Verified"}
                                onChange={(e) =>
                                    handleEditChange("isUserActivated", e.target.value === "Verified")
                                }
                                label={t("UserTableRow.is_verified")}
                            >
                                <MenuItem value="Verified">{t("UserTableRow.verified")}</MenuItem>
                                <MenuItem value="Not Verified">{t("UserTableRow.not_verified")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>{t("UserTableRow.cancel")}</Button>
                    <Button onClick={handleEditSubmit} variant="contained">
                        {t("UserTableRow.save")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
                <DialogTitle>{t("UserTableRow.delete_confirmation")}</DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        {t("UserTableRow.delete_prompt", { firstname: row.firstname, lastname: row.lastname })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>{t("UserTableRow.cancel")}</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        {t("UserTableRow.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}