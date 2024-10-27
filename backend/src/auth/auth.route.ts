import { Router } from "express";
import { logIn, signUp } from "./auth.services";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const data = await signUp(email, username, password);
    res.status(200).json({ message: "Signed up successfully", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing up" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await logIn(email, password);
    res.status(200).json({ message: "Logged in successfully", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

export { authRouter };
