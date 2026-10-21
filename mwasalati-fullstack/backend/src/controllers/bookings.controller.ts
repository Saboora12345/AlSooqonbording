import type { Request, Response } from "express";
import { prisma } from "../db.js";
import { BookingError, confirmBooking, holdSeats } from "../services/booking.service.js";

function serialize(booking: {
  id: string;
  tripId: string;
  seatNumbers: string;
  totalFareSdg: number;
  status: string;
  boardingStopId: string;
  createdAt: Date;
}) {
  return {
    id: booking.id,
    tripId: booking.tripId,
    seatNumbers: JSON.parse(booking.seatNumbers) as number[],
    totalFareSdg: booking.totalFareSdg,
    status: booking.status,
    boardingStopId: booking.boardingStopId,
    createdAt: booking.createdAt.toISOString(),
  };
}

export async function createBooking(req: Request, res: Response) {
  const { tripId, seatCount, boardingStopId } = req.body as {
    tripId?: string;
    seatCount?: number;
    boardingStopId?: string;
  };
  if (!tripId || !seatCount || !boardingStopId) {
    return res.status(400).json({ message: "tripId, seatCount and boardingStopId are required" });
  }
  try {
    const booking = await holdSeats(tripId, seatCount, boardingStopId);
    res.status(201).json(serialize(booking));
  } catch (err) {
    if (err instanceof BookingError) return res.status(err.status).json({ message: err.message });
    throw err;
  }
}

export async function confirm(req: Request, res: Response) {
  try {
    const booking = await confirmBooking(req.params.bookingId);
    res.json(serialize(booking));
  } catch (err) {
    if (err instanceof BookingError) return res.status(err.status).json({ message: err.message });
    throw err;
  }
}

export async function getBooking(req: Request, res: Response) {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.bookingId } });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(serialize(booking));
}
