import express from "express";
import { testConnection } from "./utils/testConnection.js";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import { router } from "./configs/router.js";
import { logger } from "./configs/logger.js";
import { trpcMiddleware } from "./trpc/baseRouter.js";

const app = express();

const PORT = Number(process.env.PORT) || 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({ origin: "*" }));
//app.use(loggerMiddleware);

app.use("/api", router); // set base url to /api
app.use("/api/trpc", trpcMiddleware); // set base url to /api/trpc
app.use(errorHandler); // Error logging middleware

app.get("/health", (_, res) => {
  res.send("ok");
});

// Test db connection
try {
  await testConnection();
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`ARCHIVR is active and listing on on port ${PORT}`);
  });
} catch (error) {
  logger.error(error, "Database connection failed");
}
