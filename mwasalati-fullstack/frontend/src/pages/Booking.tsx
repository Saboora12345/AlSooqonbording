import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SeatPicker } from "../components/ui/SeatPicker";
import { api } from "../lib/api";
import { formatSdg, totalFare } from "../lib/fares";
import type { RouteSummary, Trip } from "../types";

export function Booking() {
  const { t, i18n } = useTranslation();
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const boardingStopId = (location.state as { boardingStopId?: string } | null)?.boardingStopId;

  const [trip, setTrip] = useState<(Trip & { route: RouteSummary }) | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    api.getTrip(tripId).then(setTrip);
  }, [tripId]);

  if (!trip) return <p className="text-sm text-brand-brown/60">…</p>;

  const takenSeats = Array.from({ length: trip.seatsBooked + trip.seatsHeld }, (_, i) => i + 1);
  const total = totalFare(trip.route.tier, selectedSeats.length);

  function toggleSeat(seat: number) {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  }

  async function confirm() {
    if (!tripId || !boardingStopId || selectedSeats.length === 0) return;
    setSubmitting(true);
    try {
      const held = await api.holdSeats(tripId, selectedSeats.length, boardingStopId);
      const confirmed = await api.confirmBooking(held.id);
      navigate(`/ticket/${confirmed.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">{t("booking.title")}</h1>
      <p className="text-xs text-brand-brown/60">{t("booking.seatCap")}</p>

      <SeatPicker takenSeats={takenSeats} selectedSeats={selectedSeats} onToggle={toggleSeat} />

      <Card className="flex items-center justify-between">
        <span className="text-sm text-brand-brown/60">{t("booking.total")}</span>
        <span className="text-lg font-bold">{formatSdg(total, i18n.language as "ar" | "en")}</span>
      </Card>

      <p className="text-center text-xs text-brand-brown/50">{t("booking.holdNote")}</p>

      <Button
        disabled={selectedSeats.length === 0 || !boardingStopId || submitting}
        onClick={confirm}
      >
        {t("booking.confirm")}
      </Button>
    </div>
  );
}
