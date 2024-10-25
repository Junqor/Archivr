import "./types/supabase";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./routes/auth";

const app = express();

const PORT = process.env.PORT || "8080";

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`ARCHIVR is active and listing on on port ${PORT}`);
});
