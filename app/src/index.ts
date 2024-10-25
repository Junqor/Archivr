import express from "express";
import path from "node:path";
import fs from "node:fs";
import mysql from "mysql2";
import { ResultSetHeader } from "mysql2";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import "./types/supabase";
const app = express();

const port = 8080;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`);
});
