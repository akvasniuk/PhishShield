import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';

import { Logo } from '../../components/logo/index.js';

import { Main, CompactContent } from './main.jsx';
import { LayoutSection } from '../core/layout-section.jsx';
import { HeaderSection } from '../core/header-section.jsx';

export function SimpleLayout({ sx, children, header, content }) {
    const { t } = useTranslation();
    const layoutQuery = 'md';

    return (
        <LayoutSection
            /** **************************************
             * Header
             *************************************** */
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{ container: { maxWidth: false } }}
                    sx={header?.sx}
                    slots={{
                        topArea: (
                            <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                                {t('layout.info_alert')}
                            </Alert>
                        ),
                        leftArea: <Logo />,
                    }}
                />
            }
            /** **************************************
             * Footer
             *************************************** */
            footerSection={null}
            /** **************************************
             * Style
             *************************************** */
            cssVars={{
                '--layout-simple-content-compact-width': '448px',
            }}
            sx={sx}
        >
            <Main>
                {content?.compact ? (
                    <CompactContent layoutQuery={layoutQuery}>{children}</CompactContent>
                ) : (
                    children
                )}
            </Main>
        </LayoutSection>
    );
}