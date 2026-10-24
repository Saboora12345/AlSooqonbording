import type { Request, Response } from "express";
import { prisma } from "../db.js";

function serializeRoute(route: {
  id: string;
  name: string;
  nameAr: string;
  tier: string;
  fareSdg: number;
  stops: { id: string; name: string; nameAr: string; lat: number; lng: number; order: number }[];
}) {
  return {
    id: route.id,
    name: route.name,
    nameAr: route.nameAr,
    tier: route.tier,
    fareSdg: route.fareSdg,
    stops: [...route.stops]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ id: s.id, name: s.name, nameAr: s.nameAr, lat: s.lat, lng: s.lng })),
  };
}

export async function listRoutes(_req: Request, res: Response) {
  const routes = await prisma.route.findMany({ include: { stops: true } });
  res.json(routes.map(serializeRoute));
}

export async function getRoute(req: Request, res: Response) {
  const route = await prisma.route.findUnique({
    where: { id: req.params.routeId },
    include: { stops: true },
  });
  if (!route) return res.status(404).json({ message: "Route not found" });
  res.json(serializeRoute(route));
}

interface TripWithVehicle {
  id: string;
  routeId: string;
  departureAt: Date;
  vehicleId: string;
  seatsHeld: number;
  seatsBooked: number;
  vehicle: { seatCap: number };
}

export async function listTripsForRoute(req: Request, res: Response) {
  const trips: TripWithVehicle[] = await prisma.trip.findMany({
    where: { routeId: req.params.routeId },
    include: { vehicle: true },
    orderBy: { departureAt: "asc" },
  });
  res.json(
    trips.map((t: TripWithVehicle) => ({
      id: t.id,
      routeId: t.routeId,
      departureAt: t.departureAt.toISOString(),
      vehicleId: t.vehicleId,
      seatCap: t.vehicle.seatCap,
      seatsHeld: t.seatsHeld,
      seatsBooked: t.seatsBooked,
    })),
  );
}
