import express from "express";
import path from "node:path";
import fs from "node:fs";
import mysql from "mysql2";
import { ResultSetHeader } from "mysql2";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getMedia } from "./tests/getMedia.test";
import "./types/supabase";
import { addMedia } from "./tests/addMedia.test";
import { deleteMedia } from "./tests/deleteMedia.test";

const app = express();

const port = 8080;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/test", async (req, res) => {
  try {
    await addMedia();
    console.log("Test Case: Add media SUCCESS");
  } catch (error) {
    console.log("Test Case: Add media FAILED");
  }
  try {
    const result = await getMedia();
    console.log("Test Case: Get media SUCCESS");
  } catch (error) {
    console.log("Test Case: Get media FAILED");
  }
  try {
    await deleteMedia();
    console.log("Test Case: Delete media SUCCESS");
  } catch (error) {
    console.log("Test Case: Delete media FAILED");
  }
  res.send("Finished Test Cases");
});

app.post("/submit", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", async (req, res) => {
  res.sendFile(__dirname + "/public/signup/index.html");
  console.log(req.body);
  console.log(req.body["username"]);
  console.log(req.body["password"]);
});

app.post("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login/index.html");
  console.log(req.body);
  console.log(req.body["username"]);
  console.log(req.body["password"]);
});

app.listen(port, () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`);
});
