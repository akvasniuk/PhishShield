import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export function TableNoData({ searchQuery, ...other }) {
  const { t } = useTranslation();

  return (
      <TableRow {...other}>
        <TableCell align="center" colSpan={7}>
          <Box sx={{ py: 15, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('TableNoData.not_found')}
            </Typography>

            <Typography variant="body2">
              {t('TableNoData.no_results_found')} &nbsp;
              <strong>&quot;{searchQuery}&quot;</strong>.
              <br /> {t('TableNoData.hint')}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
  );
}