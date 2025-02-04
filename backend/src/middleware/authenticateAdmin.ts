import { Request, Response, NextFunction, RequestHandler } from "express";

// Use this after authenticateToken middleware
export const authenticateAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = res.locals;
    if (user.role !== "admin") {
      res.status(401).json({ status: "failed", message: "Unauthorized" });
    }

    next();
  } catch (error) {
    res.status(401).json({ status: "failed", message: "Unauthorized" });
  }
};
