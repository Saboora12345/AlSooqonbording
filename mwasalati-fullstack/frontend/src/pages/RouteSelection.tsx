import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { TierBadge } from "../components/ui/Badge";
import { api } from "../lib/api";
import { formatSdg } from "../lib/fares";
import type { RouteSummary } from "../types";
import { useDirection } from "../hooks/useDirection";

export function RouteSelection() {
  const { t, i18n } = useTranslation();
  const { isRtl } = useDirection();
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getRoutes()
      .then(setRoutes)
      .catch(() => setError("offline"));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">{t("routes.title")}</h1>

      {error && (
        <Card className="text-sm text-brand-brown/70">
          Could not reach the backend — start it with{" "}
          <code className="rounded bg-brand-brown/10 px-1">npm run dev</code> in{" "}
          <code className="rounded bg-brand-brown/10 px-1">/backend</code>.
        </Card>
      )}

      {routes.map((route) => (
        <Link key={route.id} to={`/routes/${route.id}`}>
          <Card className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{isRtl ? route.nameAr : route.name}</p>
              <p className="text-sm text-brand-brown/60">
                {formatSdg(route.fareSdg, i18n.language as "ar" | "en")}
              </p>
            </div>
            <TierBadge tier={route.tier} label={t(`routes.${route.tier}`)} />
          </Card>
        </Link>
      ))}
    </div>
  );
}
