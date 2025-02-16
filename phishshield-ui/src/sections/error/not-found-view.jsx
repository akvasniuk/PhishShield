import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { RouterLink } from '../../routes/components/index.js';
import { SimpleLayout } from '../../layouts/simple/index.js';

export function NotFoundView() {
    const { t } = useTranslation();

    return (
        <SimpleLayout content={{ compact: true }}>
            <Container>
                <Typography variant="h3" sx={{ mb: 2 }}>
                    {t('notFound.title')}
                </Typography>

                <Typography sx={{ color: 'text.secondary' }}>
                    {t('notFound.description')}
                </Typography>

                <Box
                    component="img"
                    src="/assets/illustrations/illustration-404.svg"
                    alt={t('notFound.imageAlt')}
                    sx={{
                        width: 320,
                        height: 'auto',
                        my: { xs: 5, sm: 10 },
                    }}
                />

                <Button
                    component={RouterLink}
                    href="/"
                    size="large"
                    variant="contained"
                    color="inherit"
                >
                    {t('notFound.button')}
                </Button>
            </Container>
        </SimpleLayout>
    );
}