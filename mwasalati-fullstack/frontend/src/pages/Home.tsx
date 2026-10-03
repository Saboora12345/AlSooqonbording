import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-brand-brown text-brand-white">
        <h1 className="text-xl font-bold">{t("home.greeting")}</h1>
        <p className="mt-1 text-sm text-brand-white/80">{t("home.sub")}</p>
      </Card>

      <Link to="/routes">
        <Button variant="secondary">{t("home.cta")}</Button>
      </Link>

      <Card>
        <p className="text-xs uppercase tracking-wide text-brand-brown/60">
          {t("wallet.balance")}
        </p>
        <p className="mt-1 text-2xl font-bold">2,500 SDG</p>
      </Card>
    </div>
  );
}
