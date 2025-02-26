import {
  NextFunction,
  ParamsDictionary,
  Query,
  RequestHandler,
} from "express-serve-static-core";

// Handler for async routes to propogate errors into our error handler
export const asyncHandler = (
  handler: (
    ...args: Parameters<RequestHandler<ParamsDictionary, any, any, Query>>
  ) => void | Promise<void>
): RequestHandler<ParamsDictionary, any, any, Query> =>
  function asyncHandlerWrap(
    ...args: Parameters<RequestHandler<ParamsDictionary, any, any, Query>>
  ) {
    const next = args[args.length - 1] as NextFunction;
    return Promise.resolve(handler(...args)).catch(next);
  };
