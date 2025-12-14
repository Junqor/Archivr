import { S3Client } from "@aws-sdk/client-s3";
import { serverConfig, S3_ENDPOINT } from "./secrets.js";

export const s3Client = new S3Client({
  region: serverConfig.S3_REGION,
  endpoint:
    process.env.NODE_ENV === "production" ? S3_ENDPOINT : "http://minio:9000",
  credentials: {
    accessKeyId: serverConfig.S3_ACCESS_TOKEN,
    secretAccessKey: serverConfig.S3_SECRET_TOKEN,
  },
  forcePathStyle: true, // Required for MinIO compatibility
});
