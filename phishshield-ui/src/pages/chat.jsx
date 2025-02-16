import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import Chat from "../sections/chat/chat.jsx";

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.accountSetting.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <Chat />
        </>
    );
}