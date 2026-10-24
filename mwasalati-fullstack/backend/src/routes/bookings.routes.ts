import { Router } from "express";
import { confirm, createBooking, getBooking } from "../controllers/bookings.controller.js";

export const bookingsRouter = Router();

bookingsRouter.post("/", createBooking);
bookingsRouter.get("/:bookingId", getBooking);
bookingsRouter.post("/:bookingId/confirm", confirm);
