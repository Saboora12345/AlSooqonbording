import { useTranslation } from "react-i18next";
import { useDirection } from "../../hooks/useDirection";

export function Header() {
  const { t } = useTranslation();
  const { isRtl, toggle } = useDirection();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-brand-brown px-4 py-3 text-brand-white">
      <span className="text-lg font-bold">{t("app.name")}</span>
      <button
        onClick={toggle}
        className="rounded-full border border-brand-white/40 px-3 py-1 text-xs font-medium hover:bg-brand-white/10"
        aria-label="Toggle language"
      >
        {isRtl ? "EN" : "AR"}
      </button>
    </header>
  );
}
