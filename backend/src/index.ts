import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { testConnection } from "./utils/testConnection.js";
import cors from "cors";
import { searchRouter } from "./search/search.route.js";
import { mediaRouter } from "./media/media.route.js";
import { router } from "./configs/router.js";


const app = express();

const PORT = process.env.PORT || "8080";

const __dirname = dirname(fileURLToPath(import.meta.url));


app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is up and running! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});

// Test db connection
try {
  await testConnection();
  console.log("Database connection successful");
  app.listen(PORT, () => {
    console.log(`ARCHIVR is active and listening on on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection failed", error);
}
