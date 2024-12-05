import { Request, Response, NextFunction } from "express";

// Error-handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ status: "failed", message: err.message });
};
