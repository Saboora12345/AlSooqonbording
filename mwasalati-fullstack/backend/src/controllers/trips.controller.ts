import type { Request, Response } from "express";
import { prisma } from "../db.js";

export async function getTrip(req: Request, res: Response) {
  const trip = await prisma.trip.findUnique({
    where: { id: req.params.tripId },
    include: { vehicle: true, route: { include: { stops: true } } },
  });
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  res.json({
    id: trip.id,
    routeId: trip.routeId,
    departureAt: trip.departureAt.toISOString(),
    vehicleId: trip.vehicleId,
    seatCap: trip.vehicle.seatCap,
    seatsHeld: trip.seatsHeld,
    seatsBooked: trip.seatsBooked,
    route: {
      id: trip.route.id,
      name: trip.route.name,
      nameAr: trip.route.nameAr,
      tier: trip.route.tier,
      fareSdg: trip.route.fareSdg,
      stops: [...trip.route.stops]
        .sort((a, b) => a.order - b.order)
        .map((s) => ({ id: s.id, name: s.name, nameAr: s.nameAr, lat: s.lat, lng: s.lng })),
    },
  });
}
