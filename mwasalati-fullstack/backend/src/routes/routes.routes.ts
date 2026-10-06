import { Router } from "express";
import { getRoute, listRoutes, listTripsForRoute } from "../controllers/routes.controller.js";

export const routesRouter = Router();

routesRouter.get("/", listRoutes);
routesRouter.get("/:routeId", getRoute);
routesRouter.get("/:routeId/trips", listTripsForRoute);
