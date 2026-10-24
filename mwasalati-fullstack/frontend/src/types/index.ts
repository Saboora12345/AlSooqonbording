export type FareTier = "short" | "medium" | "long";

export interface Stop {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
}

export interface RouteSummary {
  id: string;
  name: string;
  nameAr: string;
  tier: FareTier;
  fareSdg: number;
  stops: Stop[];
}

export interface Trip {
  id: string;
  routeId: string;
  departureAt: string; // ISO timestamp
  vehicleId: string;
  seatCap: number;
  seatsHeld: number;
  seatsBooked: number;
}

export interface Booking {
  id: string;
  tripId: string;
  seatNumbers: number[];
  totalFareSdg: number;
  status: "held" | "confirmed" | "cancelled";
  boardingStopId: string;
  createdAt: string;
}

export interface WalletSummary {
  balanceSdg: number;
  currency: "SDG";
}
