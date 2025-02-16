import { useCallback, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";

import { DashboardContent } from "../../../layouts/dashboard";
import { Scrollbar } from "../../../components/scrollbar";
import { TableNoData } from "../table-no-data";
import { PredictionHistoryTableHead } from "../prediction-history-table-head.jsx";
import { TableEmptyRows } from "../table-empty-rows";
import { PredictionHistoryTableToolbar } from "../prediction-history-table-toolbar.jsx";
import { PredictionHistoryTableRow } from "../prediction-history-table-row.jsx";
import {
    applyFilter,
    emptyRows,
    getComparator,
} from "../utils";
import { phishingDetectionService } from "../../../services/index.js";

import { useTranslation } from "react-i18next";

export function PredictionHistoryView() {
    const { t } = useTranslation();
    const [filterData, setFilterData] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterModel, setFilterModel] = useState("");
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState("name");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [order, setOrder] = useState("asc");
    const [predictions, setPredictions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const handleFilterChange = (filter, value) => {
        if (filter === "data") setFilterData(value);
        if (filter === "type") setFilterType(value);
        if (filter === "model") setFilterModel(value);
        onResetPage();
    };

    const onSort = useCallback(
        (id) => {
            const isAsc = orderBy === id && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked, newSelecteds) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback(
        (inputValue) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const dataFiltered = applyFilter({
        inputData: predictions,
        comparator: getComparator(order, orderBy),
        filterData,
        filterType,
        filterModel,
    });

    const notFound = !dataFiltered.length && !!filterData && !!filterType && !!filterModel;

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await phishingDetectionService.getPredictionHistory(
                    page + 1,
                    rowsPerPage
                );
                setPredictions(response.data.phishingItems);
                setTotalCount(response.data.totalCount);
            } catch (error) {
                console.error(t("error.fetchingPredictions"), error);
            }
        };

        fetchPredictions();
    }, [page, rowsPerPage, t]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    {t("predictionHistory.title")}
                </Typography>
            </Box>

            <Card>
                <PredictionHistoryTableToolbar
                    numSelected={selected.length}
                    filterData={filterData}
                    filterType={filterType}
                    filterModel={filterModel}
                    onFilterChange={handleFilterChange}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: "unset" }}>
                        <Table sx={{ minWidth: 800 }}>
                            <PredictionHistoryTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={predictions.length}
                                numSelected={selected.length}
                                onSort={onSort}
                                onSelectAllRows={(checked) =>
                                    onSelectAllRows(
                                        checked,
                                        predictions.map((prediction) => prediction._id)
                                    )
                                }
                                headLabel={[
                                    { id: "model", label: t("table.headers.result") },
                                    { id: "data", label: t("table.headers.data") },
                                    { id: "type", label: t("table.headers.type") },
                                    { id: "createdAt", label: t("table.headers.createdAt") },
                                    { id: "" },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered.map((row) => (
                                    <PredictionHistoryTableRow
                                        key={row._id}
                                        row={row}
                                        selected={selected.includes(row._id)}
                                        onSelectRow={() => onSelectRow(row._id)}
                                    />
                                ))}

                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(page, rowsPerPage, predictions.length)}
                                />

                                {notFound && <TableNoData searchQuery={filterData || t("default.searchQuery")} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={page}
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </DashboardContent>
    );
}