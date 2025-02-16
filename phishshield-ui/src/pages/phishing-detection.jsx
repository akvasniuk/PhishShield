import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next'; // Import i18next translation hook

import { CONFIG } from '../config-global';

import { PhishingDetectionView } from "../sections/phishing-detection/index.js";

export default function Page() {
    const { t } = useTranslation(); // Initialize translation hook

    return (
        <>
            <Helmet>
                <title>{t('page.phishingDetection.title', { appName: CONFIG.appName })}</title> {/* Localized title */}
            </Helmet>

            <PhishingDetectionView />
        </>
    );
}