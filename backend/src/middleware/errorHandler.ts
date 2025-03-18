import { Request, Response, NextFunction } from "express";
import { logger } from "../configs/logger.js";
import { ClientError, UnauthorizedError } from "../utils/error.class.js";
import { ZodError } from "zod";

// Error-handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ status: "failed", message: "Unauthorized" });
  } else if (err instanceof ZodError) {
    res.status(400).json({ status: "failed", message: "Bad Request" });
  } else if (err instanceof ClientError) {
    // Return error message to the client
    res.status(400).json({ status: "failed", message: err.message });
  } else {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};
