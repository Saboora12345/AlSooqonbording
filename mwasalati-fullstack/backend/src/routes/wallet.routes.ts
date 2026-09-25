import { Router } from "express";
import { getWallet } from "../controllers/wallet.controller.js";

export const walletRouter = Router();

walletRouter.get("/", getWallet);
