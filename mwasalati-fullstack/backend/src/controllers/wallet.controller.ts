import type { Request, Response } from "express";
import { prisma } from "../db.js";

export async function getWallet(_req: Request, res: Response) {
  const wallet = await prisma.wallet.findFirst({ where: { ownerLabel: "demo-rider" } });
  res.json({ balanceSdg: wallet?.balanceSdg ?? 0, currency: "SDG" });
}
