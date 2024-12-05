import { Request, Response, NextFunction } from "express";
import { serverConfig } from "../configs/secrets.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  token: string | JwtPayload;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from Authorization header (format: Bearer <token>)

    // Check if token is present
    if (!token) {
      res.status(401).json({ status: "failed", message: "Missing auth token" });
      return;
    }

    // Verify token
    const tokenBody = jwt.verify(token, serverConfig.JWT_SECRET);
    (req as AuthRequest).token = tokenBody;
    next();
  } catch (error) {
    res.status(403).json({ status: "failed", message: "Invalid token" });
  }
};
