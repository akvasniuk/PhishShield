import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

import translationEN from "./locales/en.json";
import translationDE from "./locales/de.json";
import translationFR from "./locales/fr.json";
import translationUK from "./locales/uk.json";

const resources = {
    en: {
        translation: translationEN
    },
    de: {
        translation: translationDE
    },
    fr: {
        translation: translationFR
    },
    uk: {
        translation: translationUK
    }
}

// Initialize i18n configuration
i18n
    .use(HttpApi) // Load translations via HTTP (backend plugin)
    .use(LanguageDetector) // Detect user language automatically
    .use(initReactI18next) // Bind i18n to React
    .init({
        fallbackLng: "en", // Fallback language if no match is found
        debug: true, // Enable debug messages in the console
        interpolation: {
            escapeValue: false, // React already escapes by default
        },
        resources,
        detection: {
            order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"], // Language detection order
            caches: ["localStorage", "cookie"], // Cache user language
        },
    });

export default i18n;