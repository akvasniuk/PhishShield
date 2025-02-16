import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import { NotFoundView } from '../sections/error';

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.notFound.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <NotFoundView />
        </>
    );
}