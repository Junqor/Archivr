import { NextFunction, Response, Request } from "express";
import { logger } from "../configs/logger.js";

export const loggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = performance.now();
  const { method, url } = req;
  logger.info(
    { method, url, headers: req.headers, body: req.body },
    "Incoming Request"
  );
  next();
  logger.info(
    {
      reqUrl: url,
      responseStatus: res.statusCode,
      responseTime: `${Math.round((performance.now() - start) * 100) / 100}ms`,
    },
    "Request Completed"
  );
};
