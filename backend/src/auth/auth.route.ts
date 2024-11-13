import { Router } from "express";
import { logIn, signUp } from "./auth.services.js";

const authRouter = Router();

// (/auth/signup)
authRouter.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const result = await signUp(email, username, password);
    if (result.status === "failed") {
      res.status(409).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Error signing up" });
  }
});

// (/auth/login)
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await logIn(username, password);
    if (result.status === "failed") {
      res.status(401).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Error logging in" });
  }
});

export { authRouter };
