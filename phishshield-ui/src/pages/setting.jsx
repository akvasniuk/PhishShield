import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import Setting from "../sections/account/setting.jsx";

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.chat.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <Setting />
        </>
    );
}