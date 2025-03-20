import NodeCache from "@cacheable/node-cache";

export const cache = new NodeCache({
  stdTTL: 60 * 60 * 1, // default ttl 1 hour
  checkperiod: 600, // check every 10 minutes
  useClones: true,
  deleteOnExpire: true,
  maxKeys: -1, // unlimited
});
