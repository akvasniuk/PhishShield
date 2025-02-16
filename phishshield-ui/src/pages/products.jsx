import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import { ProductsView } from '../sections/product/view';

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.products.title', { appName: CONFIG.appName })}</title>
            </Helmet>

            <ProductsView />
        </>
    );
}