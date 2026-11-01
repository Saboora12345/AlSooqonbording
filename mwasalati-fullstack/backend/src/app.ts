import express from "express";
import cors from "cors";
import { routesRouter } from "./routes/routes.routes.js";
import { tripsRouter } from "./routes/trips.routes.js";
import { bookingsRouter } from "./routes/bookings.routes.js";
import { walletRouter } from "./routes/wallet.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/routes", routesRouter);
  app.use("/api/trips", tripsRouter);
  app.use("/api/bookings", bookingsRouter);
  app.use("/api/wallet", walletRouter);

  app.use(errorHandler);

  return app;
}
