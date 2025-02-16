import Alert from '@mui/material/Alert';
import {useTranslation} from 'react-i18next';

import {stylesMode} from '../../theme/styles';

import {Logo} from '../../components/logo/index.js';
import {Main} from './main.jsx';
import {HeaderSection} from '../core/header-section';
import {LayoutSection} from '../core/layout-section';
import {LanguagePopover} from "../components/language-popover.jsx";
import {_langs} from "../../_mock/index.js";

export function AuthLayout({sx, children, header}) {
    const layoutQuery = 'md';
    const {t} = useTranslation();

    return (
        <LayoutSection
            /** **************************************
             * Header
             *************************************** */
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{
                        container: {maxWidth: false},
                        toolbar: {sx: {bgcolor: 'transparent', backdropFilter: 'unset'}},
                    }}
                    sx={{
                        position: {[layoutQuery]: 'fixed'},

                        ...header?.sx,
                    }}
                    slots={{
                        topArea: (
                            <Alert severity="info" sx={{display: 'none', borderRadius: 0}}>
                                {t('authLayout.alertMessage')}
                            </Alert>
                        ),
                        leftArea: <Logo/>,
                        rightArea: <LanguagePopover data={_langs}/>
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
            cssVars={{'--layout-auth-content-width': '420px'}}
            sx={{
                '&::before': {
                    width: 1,
                    height: 1,
                    zIndex: -1,
                    content: "''",
                    opacity: 0.24,
                    position: 'fixed',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundImage: `url(/assets/background/overlay.jpg)`,
                    [stylesMode.dark]: {opacity: 0.08},
                },
                ...sx,
            }}
        >
            <Main layoutQuery={layoutQuery}>{children}</Main>
        </LayoutSection>
    );
}