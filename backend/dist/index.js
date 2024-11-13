import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./auth/auth.route.js";
import { testConnection } from "./utils/testConnection.js";
import cors from "cors";
import { searchRouter } from "./search/search.route.js";
import { mediaRouter } from "./media/media.route.js";
const app = express();
const PORT = process.env.PORT || "8080";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({ origin: "*" }));
app.get("/", (req, res) => {
    res.send("Server is up and running! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧");
});
app.use("/search", searchRouter);
app.use("/auth", authRouter);
app.use("/media", mediaRouter);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "failed", message: err.message });
});
// Test db connection
try {
    await testConnection();
    console.log("Database connection successful");
    app.listen(PORT, () => {
        console.log(`ARCHIVR is active and listing on on port ${PORT}`);
    });
}
catch (error) {
    console.error("Database connection failed", error);
}
