import { RequestHandler } from "express";
import { cache } from "../configs/cache.js";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { logger } from "../configs/logger.js";

/**
 * @param ttl Time to live in seconds until cache value expires
 */
export const cacheRoute = (ttl: number) =>
  function (
    ...args: Parameters<RequestHandler<ParamsDictionary, any, any, Query>>
  ) {
    const [req, res, next] = args;
    const cacheKey = req.originalUrl;
    const cacheData = cache.get(cacheKey);
    if (cacheData) {
      res.json(cacheData);
      return;
    }

    // Save a reference to the original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to capture the response data
    res.json = (body) => {
      // Set the cache before sending the response
      cache.set(cacheKey, body, ttl);
      return originalJson(body);
    };

    next();
  };
