import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { _langs } from '../../_mock/index.js';

import { Iconify } from '../../components/iconify/index.js';

import { Main } from './main.jsx';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav.jsx';
import { navData } from '../config-nav-dashboard';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button.jsx';
import { LayoutSection } from '../core/layout-section.jsx';
import { HeaderSection } from '../core/header-section.jsx';
import { AccountPopover } from '../components/account-popover.jsx';
import { LanguagePopover } from '../components/language-popover.jsx';
import { useAuth } from '../../hooks/use-auth.js';

export function DashboardLayout({ sx, children, header }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { userIsAuthenticated } = useAuth();
    const data = navData();

    const [navOpen, setNavOpen] = useState(false);

    const layoutQuery = 'lg';

    return (
        <LayoutSection
            /** **************************************
             * Header
             *************************************** */
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{
                        container: {
                            maxWidth: false,
                            sx: { px: { [layoutQuery]: 5 } },
                        },
                    }}
                    sx={header?.sx}
                    slots={{
                        topArea: userIsAuthenticated() ? (
                            <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                                {t('dashboard.info_alert')}
                            </Alert>
                        ): null,
                        leftArea: userIsAuthenticated() ? (
                            <>
                                <MenuButton
                                    onClick={() => setNavOpen(true)}
                                    sx={{
                                        ml: -1,
                                        [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                                    }}
                                />
                                <NavMobile
                                    data={data}
                                    open={navOpen}
                                    onClose={() => setNavOpen(false)}
                                    workspaces={_workspaces}
                                />
                            </>
                        ) : null,
                        rightArea: userIsAuthenticated() ?  (
                            <Box gap={1} display="flex" alignItems="center">
                                <LanguagePopover data={_langs} />
                                <AccountPopover
                                    data={[
                                        {
                                            label: 'home',
                                            href: '/',
                                            icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                                        },
                                        {
                                            label: 'profile',
                                            href: '/account',
                                            icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                                        },
                                        {
                                            label: 'settings',
                                            href: '/settings',
                                            icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                                        },
                                    ]}
                                />
                            </Box>
                        ) : null,
                    }}
                />
            }
            /** **************************************
             * Sidebar
             *************************************** */
            sidebarSection={
                <NavDesktop data={data} layoutQuery={layoutQuery} workspaces={_workspaces} />
            }
            /** **************************************
             * Footer
             *************************************** */
            footerSection={null}
            /** **************************************
             * Style
             *************************************** */
            cssVars={{
                '--layout-nav-vertical-width': '300px',
                '--layout-dashboard-content-pt': theme.spacing(1),
                '--layout-dashboard-content-pb': theme.spacing(8),
                '--layout-dashboard-content-px': theme.spacing(5),
            }}
            sx={{
                [`& .${layoutClasses.hasSidebar}`]: {
                    [theme.breakpoints.up(layoutQuery)]: {
                        pl: 'var(--layout-nav-vertical-width)',
                    },
                },
                ...sx,
            }}
        >
            <Main>{children}</Main>
        </LayoutSection>
    );
}