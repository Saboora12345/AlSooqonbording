import { Router } from "express";
import { getTrip } from "../controllers/trips.controller.js";

export const tripsRouter = Router();

tripsRouter.get("/:tripId", getTrip);
