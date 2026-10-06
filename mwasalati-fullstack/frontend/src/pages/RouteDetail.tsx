import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { RouteMap } from "../components/map/RouteMap";
import { api } from "../lib/api";
import type { RouteSummary, Stop, Trip } from "../types";
import { useDirection } from "../hooks/useDirection";

export function RouteDetail() {
  const { t } = useTranslation();
  const { isRtl } = useDirection();
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();

  const [route, setRoute] = useState<RouteSummary | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  useEffect(() => {
    if (!routeId) return;
    api.getRoute(routeId).then((r) => {
      setRoute(r);
      setSelectedStop(r.stops[0] ?? null);
    });
    api.getTripsForRoute(routeId).then(setTrips);
  }, [routeId]);

  if (!route) return <p className="text-sm text-brand-brown/60">…</p>;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">{isRtl ? route.nameAr : route.name}</h1>

      <RouteMap
        stops={route.stops}
        selectedStopId={selectedStop?.id}
        onSelectStop={setSelectedStop}
      />

      <Card>
        <p className="text-xs uppercase tracking-wide text-brand-brown/60">
          {t("routes.selectStop")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {route.stops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => setSelectedStop(stop)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                selectedStop?.id === stop.id
                  ? "bg-brand-gold text-brand-brown"
                  : "bg-brand-brown/5 text-brand-brown/70"
              }`}
            >
              {isRtl ? stop.nameAr : stop.name}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {trips.map((trip) => (
          <Card key={trip.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {new Date(trip.departureAt).toLocaleString(isRtl ? "ar-SD" : "en-US", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-brand-brown/60">
                {trip.seatCap - trip.seatsBooked - trip.seatsHeld} / {trip.seatCap}{" "}
                {t("routes.seatsLeft", { count: trip.seatCap - trip.seatsBooked - trip.seatsHeld })}
              </p>
            </div>
            <Button
              variant="primary"
              className="w-auto px-4"
              disabled={!selectedStop}
              onClick={() =>
                navigate(`/booking/${trip.id}`, { state: { boardingStopId: selectedStop?.id } })
              }
            >
              {t("booking.title")}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
