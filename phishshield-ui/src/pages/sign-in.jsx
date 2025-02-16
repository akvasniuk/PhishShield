import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import { SignInView } from '../sections/auth';

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.signIn.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <SignInView />
        </>
    );
}