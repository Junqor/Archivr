import { Router } from "express";
import { signUp } from "../services/auth.services";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const data = await signUp(email, username, password);
    res.status(200).json({ message: "Signed up successfully", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing up", error });
  }
});

authRouter.post("/login", async (req, res) => {
  // Do stuff
});

export { authRouter };
