import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import Core from "../sections/comments/Core.jsx";

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.comments.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <Core />
        </>
    );
}