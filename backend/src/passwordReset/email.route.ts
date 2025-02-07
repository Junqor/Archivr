import { Router } from "express";
import { emailVer, setPass } from "./email.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "../configs/secrets.js";

export const emailRouter = Router();

emailRouter.post("/emailVer", async (req, res) => {
  try {
    const host = req.get("host"); // Gets the host (domain + port)
    const protocol = req.protocol; // 'http' or 'https'
    const serverUrl = `${protocol}://${host}`; // Construct the full server URL

    const { email } = req.body;
    const payload = jwt.sign({ email }, serverConfig.JWT_SECRET, {
      expiresIn: "15m",
    });
    const queryPayload = encodeURIComponent(payload);
    const url = serverUrl + "/api/email/email?q=" + queryPayload;

    await emailVer(email, url);
    res.json({ status: "success" });
  } catch (error) {
    res
      .status(400)
      .json({ status: "failed", message: (error as Error).message });
  }
});

emailRouter.post("/passwordUpdate", async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    console.log(req.body);
    if (newPassword !== confirmPassword) {
      res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }
    await setPass(newPassword, email);
    console.log("Password updated successfully");
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "failed", message: "Error" });
  }
});

emailRouter.get("/email", (req, res) => {
  const { q } = req.query;
  const decoded = decodeURIComponent(q as string);
  const { email } = jwt.verify(decoded, serverConfig.JWT_SECRET) as JwtPayload;
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Change Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 300px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input[type="password"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      border: none;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>

<div class="container">
  <h2>Change Password</h2>
  <form id="change-password-form" action="/api/email/passwordUpdate" method="POST">
    <div class="form-group">
      <label for="new-password">New Password</label>
      <input type="password" id="newPassword" name="newPassword" required>
    </div>
    <div class="form-group">
      <label for="confirm-password">Confirm New Password</label>
      <input type="password" id="confirmPassword" name="confirmPassword" required>
    </div>
    <input type="hidden" id="email" name="email" value="${email}">
    <button type="submit">Change Password</button>
  </form>
</div>

</body>
</html>
`);
});
