import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import Account from "../sections/account/account.jsx";

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.account.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <Account />
        </>
    );
}