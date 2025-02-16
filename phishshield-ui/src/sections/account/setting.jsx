import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import { UpdatePasswordForm } from "../../components/account/update-password-form.jsx";
import { DeleteAccount } from "../../components/account/delete-account.jsx";

import { useTranslation } from 'react-i18next';

export default function Setting() {
    const { t } = useTranslation();

    return (
        <Stack spacing={4}>
            <div style={{ marginLeft: "20px" }}>
                <Typography variant="h4">{t('setting.title')}</Typography>
            </div>
            <DeleteAccount />
            <UpdatePasswordForm />
        </Stack>
    );
}