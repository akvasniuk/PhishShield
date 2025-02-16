import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export function TableNoData({ searchQuery, ...other }) {
  const { t } = useTranslation();

  return (
      <TableRow {...other}>
        <TableCell align="center" colSpan={7}>
          <Box sx={{ py: 15, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t("table.noData.title")}
            </Typography>

            <Typography variant="body2">
              {t("table.noData.description", { searchQuery: searchQuery || t("table.noData.defaultSearchQuery") })}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
  );
}