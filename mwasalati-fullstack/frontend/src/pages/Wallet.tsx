import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import { formatSdg } from "../lib/fares";
import type { WalletSummary } from "../types";

export function Wallet() {
  const { t, i18n } = useTranslation();
  const [wallet, setWallet] = useState<WalletSummary | null>(null);

  useEffect(() => {
    api.getWallet().then(setWallet).catch(() => setWallet({ balanceSdg: 0, currency: "SDG" }));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">{t("wallet.title")}</h1>

      <Card className="bg-brand-brown text-brand-white">
        <p className="text-xs uppercase tracking-wide text-brand-white/70">{t("wallet.balance")}</p>
        <p className="mt-1 text-3xl font-bold">
          {wallet ? formatSdg(wallet.balanceSdg, i18n.language as "ar" | "en") : "…"}
        </p>
      </Card>

      <Button variant="secondary">{t("wallet.topUp")}</Button>

      <Card>
        <p className="text-xs uppercase tracking-wide text-brand-brown/60">{t("wallet.history")}</p>
        <p className="mt-2 text-sm text-brand-brown/50">No activity yet.</p>
      </Card>
    </div>
  );
}
