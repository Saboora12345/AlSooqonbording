import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/Card";

export function Profile() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">{t("nav.profile")}</h1>
      <Card>
        <p className="text-sm text-brand-brown/60">
          Profile, saved boarding points, and ride history go here — placeholder screen for the
          scaffold.
        </p>
      </Card>
    </div>
  );
}
