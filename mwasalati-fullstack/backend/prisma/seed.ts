import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Illustrative pilot routes, matching the three speculative Day-1 corridors
// discussed for Mwasalati (University Line, Bahri Crossing, East Nile Link).
// Coordinates are approximate Khartoum-area points for map display only.
const ROUTES = [
  {
    name: "University Line",
    nameAr: "خط الجامعات",
    tier: "short" as const,
    fareSdg: 3000,
    stops: [
      { name: "Souq Arabi", nameAr: "السوق العربي", lat: 15.5921, lng: 32.5342 },
      { name: "University of Khartoum", nameAr: "جامعة الخرطوم", lat: 15.5878, lng: 32.5299 },
      { name: "Al-Mogran", nameAr: "المقرن", lat: 15.6042, lng: 32.4994 },
    ],
  },
  {
    name: "Bahri Crossing",
    nameAr: "معبر بحري",
    tier: "medium" as const,
    fareSdg: 10000,
    stops: [
      { name: "Khartoum Central", nameAr: "وسط الخرطوم", lat: 15.5921, lng: 32.5342 },
      { name: "Blue Nile Bridge", nameAr: "كوبري النيل الأزرق", lat: 15.6289, lng: 32.5325 },
      { name: "Bahri Central Station", nameAr: "محطة بحري المركزية", lat: 15.6445, lng: 32.5453 },
    ],
  },
  {
    name: "East Nile Link",
    nameAr: "رابط شرق النيل",
    tier: "long" as const,
    fareSdg: 15000,
    stops: [
      { name: "Khartoum Central", nameAr: "وسط الخرطوم", lat: 15.5921, lng: 32.5342 },
      { name: "Al-Kalakla", nameAr: "الكلاكلة", lat: 15.4767, lng: 32.5453 },
      { name: "East Nile", nameAr: "شرق النيل", lat: 15.6103, lng: 32.6244 },
    ],
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.wallet.deleteMany();

  await prisma.wallet.create({ data: { ownerLabel: "demo-rider", balanceSdg: 2500 } });

  const vehicles = await Promise.all(
    ["Van 01", "Van 02", "Van 03"].map((label) =>
      prisma.vehicle.create({ data: { label, seatCap: 14 } }),
    ),
  );

  for (const [i, r] of ROUTES.entries()) {
    const route = await prisma.route.create({
      data: {
        name: r.name,
        nameAr: r.nameAr,
        tier: r.tier,
        fareSdg: r.fareSdg,
        stops: {
          create: r.stops.map((s, order) => ({ ...s, order })),
        },
      },
    });

    // A couple of upcoming trips per route, each on a different van, with a
    // few seats already taken so the seat picker has something to show.
    const now = Date.now();
    await prisma.trip.create({
      data: {
        routeId: route.id,
        vehicleId: vehicles[i % vehicles.length].id,
        departureAt: new Date(now + 1000 * 60 * 60 * 14), // ~14h out — forward-booking model
        seatsBooked: 4,
      },
    });
    await prisma.trip.create({
      data: {
        routeId: route.id,
        vehicleId: vehicles[(i + 1) % vehicles.length].id,
        departureAt: new Date(now + 1000 * 60 * 60 * 24), // next day
        seatsBooked: 0,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
