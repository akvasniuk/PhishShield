import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import { SignUpView } from '../sections/auth';

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.signUp.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <SignUpView />
        </>
    );
}