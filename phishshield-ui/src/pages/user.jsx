import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import { UserView } from '../sections/user/view';

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.users.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <UserView />
        </>
    );
}