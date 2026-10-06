import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

// Arabic is the default — Mwasalati is a Khartoum-first product — with English
// as the secondary language for investor-facing / bilingual contexts.
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "ar",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
