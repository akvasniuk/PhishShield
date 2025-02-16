import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from "@mui/material/Stack";

import { useTranslation } from 'react-i18next';

import { AccountDetailsForm } from '../../components/account/account-details-form';
import { AccountInfo } from '../../components/account/account-info.jsx';

export default function Account() {
    const { t } = useTranslation();

    return (
        <Stack spacing={4}>
            <div style={{ marginLeft: "20px" }}>
                <Typography variant="h4">{t('account.title')}</Typography>
            </div>
            <Grid container spacing={3}>
                <Grid lg={4} md={6} xs={12}>
                    <AccountInfo />
                </Grid>
                <Grid lg={8} md={6} xs={12}>
                    <AccountDetailsForm />
                </Grid>
            </Grid>
        </Stack>
    );
}