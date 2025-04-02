import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import { TAuthToken } from "../types/index.js";
import { serverConfig } from "../configs/secrets.js";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  function getUserFromHeader() {
    if (req.headers.authorization) {
      const token = jwt.verify(
        req.headers.authorization.split(" ")[1],
        serverConfig.JWT_SECRET
      ) as TAuthToken;
      return token.user;
    }
    return null;
  }
  const user = getUserFromHeader();

  return {
    req,
    res,
    user,
  };
};
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
