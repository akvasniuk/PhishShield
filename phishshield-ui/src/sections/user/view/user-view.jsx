import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from '../../../layouts/dashboard';

import { Scrollbar } from '../../../components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';
import { userService } from "../../../services/index.js";

import { useTranslation } from 'react-i18next';

export function UserView() {
  const { t } = useTranslation();

  const [filterFirstName, setFirstName] = useState("");
  const [filterLastName, setFilterLastName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const handleFilterChange = (filter, value) => {
    if (filter === "firstname") setFirstName(value);
    if (filter === "lastname") setFilterLastName(value);
    if (filter === "email") setFilterEmail(value);
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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterFirstName,
    filterLastName,
    filterEmail,
  });

  const notFound = !dataFiltered.length && !!filterFirstName && !!filterLastName && !!filterEmail;

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(
          page + 1,
          rowsPerPage
      );
      setUsers(response.data.users);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error(t("UserView.errors.fetch_users", { error }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateUser = async (userId, updatedUser) => {
    try {
      await userService.updateUserByAdmin(userId, updatedUser);
      await fetchUsers();
    } catch (e) {
      console.error(t("UserView.errors.update_user", { error: e }));
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUserByAdmin(userId);
      await fetchUsers();
    } catch (e) {
      console.error(t("UserView.errors.delete_user", { error: e }));
    }
  }

  return (
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            {t("UserView.users.title")}
          </Typography>
        </Box>

        <Card>
          <UserTableToolbar
              numSelected={selected.length}
              filterFirstName={filterFirstName}
              filterLastName={filterLastName}
              filterEmail={filterEmail}
              onFilterChange={handleFilterChange}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                        onSelectAllRows(
                            checked,
                            users.map((user) => user._id)
                        )
                    }
                    headLabel={[
                      { id: 'name', label: t('UserView.users.table_headers.name') },
                      { id: 'email', label: t('UserView.users.table_headers.email') },
                      { id: 'role', label: t('UserView.users.table_headers.role') },
                      { id: 'isVerified', label: t('UserView.users.table_headers.verified'), align: 'center' },
                      { id: 'googleAuth', label: t('UserView.users.table_headers.google_auth'), align: 'center' },
                      { id: '' },
                    ]}
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                      <UserTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onEditUser={handleUpdateUser}
                          onDeleteUser={handleDeleteUser}
                      />
                  ))}

                  <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(page, rowsPerPage, users.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterFirstName || t("UserView.users.search_placeholder")} />}
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