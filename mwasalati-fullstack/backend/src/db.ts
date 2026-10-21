import { PrismaClient } from "@prisma/client";

// A single shared Prisma client for the process — avoid instantiating one
// per request, which exhausts SQLite/Postgres connections under load.
export const prisma = new PrismaClient();
