import { S3Client } from "@aws-sdk/client-s3";
import { serverConfig } from "./secrets.js";

export const s3Client = new S3Client({
  region: "sfo3",
  endpoint: "https://" + serverConfig.S3_REGION + "." + serverConfig.S3_HOST,
  credentials: {
    accessKeyId: serverConfig.S3_ACCESS_TOKEN,
    secretAccessKey: serverConfig.S3_SECRET_TOKEN,
  },
});
