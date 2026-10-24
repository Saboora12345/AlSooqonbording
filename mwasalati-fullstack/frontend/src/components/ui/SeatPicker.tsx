import { SEATS_PER_VAN } from "../../lib/fares";

interface SeatPickerProps {
  takenSeats: number[];
  selectedSeats: number[];
  onToggle: (seat: number) => void;
}

/**
 * A simple 14-seat grid matching the fixed van layout used across Mwasalati
 * (2 seats × 7 rows). Taken seats are disabled; selected seats are
 * highlighted in gold.
 */
export function SeatPicker({ takenSeats, selectedSeats, onToggle }: SeatPickerProps) {
  const seats = Array.from({ length: SEATS_PER_VAN }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Seat selection">
      {seats.map((seat) => {
        const isTaken = takenSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);
        return (
          <button
            key={seat}
            type="button"
            disabled={isTaken}
            aria-pressed={isSelected}
            onClick={() => onToggle(seat)}
            className={`h-11 rounded-md text-sm font-medium transition
              ${isTaken ? "bg-brand-brown/10 text-brand-brown/30 cursor-not-allowed" : ""}
              ${!isTaken && isSelected ? "bg-brand-gold text-brand-brown" : ""}
              ${!isTaken && !isSelected ? "bg-brand-white ring-1 ring-brand-brown/20 text-brand-brown hover:ring-brand-gold" : ""}
            `}
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
}
