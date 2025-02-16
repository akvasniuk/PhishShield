import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { CONFIG } from '../config-global';

import { PredictionHistoryView } from "../sections/prediction-history/view";

export default function Page() {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('page.detectionHistory.title', { appName: CONFIG.appName })}</title> {/* Localized title */}
            </Helmet>

            <PredictionHistoryView />
        </>
    );
}