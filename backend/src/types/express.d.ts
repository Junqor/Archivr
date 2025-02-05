import { TPayload, TAuthToken } from "./index.ts";

declare global {
  namespace Express {
    export interface Locals {
      user: TPayload;
    }
  }
}
