import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";
import { formatSdg } from "../lib/fares";
import type { Booking, RouteSummary, Trip } from "../types";
import { useDirection } from "../hooks/useDirection";

export function Ticket() {
  const { t, i18n } = useTranslation();
  const { isRtl } = useDirection();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [trip, setTrip] = useState<(Trip & { route: RouteSummary }) | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    api.getBooking(bookingId).then((b) => {
      setBooking(b);
      api.getTrip(b.tripId).then(setTrip);
    });
  }, [bookingId]);

  if (!booking || !trip) return <p className="text-sm text-brand-brown/60">…</p>;

  const stop = trip.route.stops.find((s) => s.id === booking.boardingStopId);
  const qrPayload = encodeURIComponent(`mwasalati:booking:${booking.id}`);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">{t("ticket.title")}</h1>

      <Card className="ticket-edge flex flex-col items-center gap-3 border-2 border-dashed border-brand-brown/20 py-6">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrPayload}`}
          alt="Booking QR code"
          width={160}
          height={160}
          className="rounded-md"
        />
        <p className="text-xs text-brand-brown/60">{t("ticket.showQr")}</p>
      </Card>

      <Card className="flex flex-col gap-2 text-sm">
        <Row label={t("ticket.boarding")} value={isRtl ? stop?.nameAr : stop?.name} />
        <Row
          label={t("ticket.departure")}
          value={new Date(trip.departureAt).toLocaleString(isRtl ? "ar-SD" : "en-US")}
        />
        <Row label={t("ticket.seat")} value={booking.seatNumbers.join(", ")} />
        <Row
          label={t("booking.total")}
          value={formatSdg(booking.totalFareSdg, i18n.language as "ar" | "en")}
        />
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-brand-brown/10 pb-2 last:border-0 last:pb-0">
      <span className="text-brand-brown/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
