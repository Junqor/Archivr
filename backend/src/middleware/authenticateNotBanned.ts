import { Request, Response, NextFunction, RequestHandler } from "express";
import { is_user_banned } from "../api/moderation/moderation.service.js";

// Use this after authenticateToken middleware
export const authenticateNotBanned: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = res.locals;
    const { is_banned } = await is_user_banned(user.id);
    if (is_banned) {
      res.status(403).json({ status: "failed", message: "Forbidden" });
    }
    else {
      next();
    }
  } catch (error) {
    res.status(403).json({ status: "failed", message: "Forbidden" });
  }
};
