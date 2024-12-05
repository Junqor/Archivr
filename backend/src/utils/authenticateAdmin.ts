import { Request } from "express";
import { AuthRequest } from "../middleware/authenticateToken.js";
import { TAuthToken } from "../types/user.js";

/** Authenticate admin role */
export function authenticateAdmin(req: Request) {
  const token = (req as AuthRequest).token as TAuthToken;
  if (token.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return true;
}
