import { prisma } from "../db.js";
import { totalFare } from "./fare.service.js";

export class BookingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Hold-to-confirm booking, matching the product rule: no fare negotiation,
 * seats are held for a short window while the rider pays, then confirmed.
 * This scaffold confirms synchronously (no payment gateway wired up yet) —
 * the two-step hold/confirm API shape is kept so a real payment step can
 * slot in between without changing the frontend contract.
 */
export async function holdSeats(tripId: string, seatCount: number, boardingStopId: string) {
  if (seatCount < 1) throw new BookingError("seatCount must be at least 1");

  const trip = await prisma.trip.findUnique({ include: { route: true }, where: { id: tripId } });
  if (!trip) throw new BookingError("Trip not found", 404);

  const vehicle = await prisma.vehicle.findUnique({ where: { id: trip.vehicleId } });
  const seatCap = vehicle?.seatCap ?? 14;
  const seatsTaken = trip.seatsBooked + trip.seatsHeld;

  if (seatsTaken + seatCount > seatCap) {
    throw new BookingError(`Only ${seatCap - seatsTaken} seat(s) left on this trip`, 409);
  }

  const stop = await prisma.stop.findUnique({ where: { id: boardingStopId } });
  if (!stop || stop.routeId !== trip.routeId) {
    throw new BookingError("Boarding stop does not belong to this route", 400);
  }

  const seatNumbers = Array.from({ length: seatCount }, (_, i) => seatsTaken + i + 1);
  const total = totalFare(trip.route.tier, seatCount);

  const [booking] = await prisma.$transaction([
    prisma.booking.create({
      data: {
        tripId,
        boardingStopId,
        seatNumbers: JSON.stringify(seatNumbers),
        seatCount,
        totalFareSdg: total,
        status: "held",
      },
    }),
    prisma.trip.update({ where: { id: tripId }, data: { seatsHeld: seatsTaken + seatCount } }),
  ]);

  return booking;
}

export async function confirmBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new BookingError("Booking not found", 404);
  if (booking.status !== "held") {
    throw new BookingError(`Booking is already ${booking.status}`, 409);
  }

  const [confirmed] = await prisma.$transaction([
    prisma.booking.update({ where: { id: bookingId }, data: { status: "confirmed" } }),
    prisma.trip.update({
      where: { id: booking.tripId },
      data: {
        seatsHeld: { decrement: booking.seatCount },
        seatsBooked: { increment: booking.seatCount },
      },
    }),
  ]);

  return confirmed;
}
