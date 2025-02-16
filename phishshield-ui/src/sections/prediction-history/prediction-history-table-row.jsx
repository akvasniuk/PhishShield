import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import { Iconify } from "../../components/iconify/index.js";

export function PredictionHistoryTableRow({ row, selected, onSelectRow }) {
    const { t } = useTranslation();

    const [openPopover, setOpenPopover] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenPopover = useCallback((event) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
        handleClosePopover();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell></TableCell>
                <TableCell>
                    {row.predictions.map((pred, index) => (
                        <Box key={index}>
                            <strong>{pred.model}: </strong>
                            {pred.prediction === 1
                                ? t("prediction.phishing")
                                : t("prediction.legitimate")}{" "}
                            ({(pred.probability * 100).toFixed(2)}%)
                        </Box>
                    ))}
                </TableCell>
                <TableCell>
                    {row.data.length > 60 ? `${row.data.slice(0, 60)}...` : row.data}
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
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
                <MenuList>
                    <MenuItem onClick={handleOpenDialog}>
                        <Iconify icon="solar:eye-bold" />
                        {t("actions.viewDetails")}
                    </MenuItem>
                </MenuList>
            </Popover>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>{t("dialog.title")}</DialogTitle>
                <DialogContent dividers>
                    <Box mb={2}>
                        <Typography variant="h6" gutterBottom>
                            {t("dialog.generalInformation")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle1">
                            <strong>{t("dialog.data")}: </strong> {row.data}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>{t("dialog.type")}: </strong> {row.type}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>{t("dialog.createdAt")}: </strong>{" "}
                            {new Date(row.createdAt).toLocaleString()}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {t("dialog.modelPredictions")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {row.predictions.map((pred, index) => (
                            <Card
                                key={index}
                                sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>{t("dialog.model")}:</strong> {pred.model}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>{t("dialog.prediction")}:</strong>{" "}
                                        {pred.prediction === 1
                                            ? t("prediction.phishing")
                                            : t("prediction.legitimate")}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <strong>{t("dialog.probability")}:</strong>{" "}
                                        {(pred.probability * 100).toFixed(2)}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </DialogContent>
                <Box sx={{ p: 2, textAlign: "right" }}>
                    <Button onClick={handleCloseDialog} variant="contained">
                        {t("dialog.closeButton")}
                    </Button>
                </Box>
            </Dialog>
        </>
    );
}