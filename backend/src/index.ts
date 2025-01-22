import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { testConnection } from "./utils/testConnection.js";
import { router } from "./configs/router.js";

const app = express();

const PORT = process.env.PORT || "8080";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use("/api", router); // set base url to /api

// Test db connection
try {
  await testConnection();
  console.log("Database connection successful");
  app.listen(PORT, () => {
    console.log(`ARCHIVR is active and listing on on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection failed", error);
}
