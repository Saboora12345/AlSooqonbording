import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Keeps <html lang/dir> and the active font family in sync with the current
 * language, so switching AR ⇄ EN flips the whole layout (RTL/LTR) and
 * typeface (Noto Sans Arabic ⇄ Montserrat) instantly — no reload.
 */
export function useDirection() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    const html = document.documentElement;
    html.lang = i18n.language;
    html.dir = isRtl ? "rtl" : "ltr";
  }, [i18n.language, isRtl]);

  return {
    isRtl,
    fontClass: isRtl ? "font-ar" : "font-en",
    toggle: () => i18n.changeLanguage(isRtl ? "en" : "ar"),
  };
}
