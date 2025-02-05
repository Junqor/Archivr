import { Request, Response, NextFunction, RequestHandler } from "express";
import { serverConfig } from "../configs/secrets.js";
import jwt from "jsonwebtoken";
import { TAuthToken } from "../types/index.js";

export const authenticateToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from Authorization header (format: Bearer <token>)
  try {
    // Check if token is present
    if (!token) {
      throw new Error("No token found");
    }

    // Verify token
    const tokenBody = jwt.verify(token, serverConfig.JWT_SECRET) as TAuthToken;
    res.locals.user = tokenBody.user;

    next();
  } catch (error) {
    res.status(401).json({ status: "failed", message: "Unauthorized" });
  }
};
