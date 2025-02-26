import { Router } from "express";
import { logIn, signUp } from "./auth.services.js";
import jwt from "jsonwebtoken";
import { serverConfig } from "../../configs/secrets.js";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const authRouter = Router();

// (GET /api/auth)
// Check if the user is authenticated, return the user object stored in the token
authRouter.get("/", authenticateToken, (req, res) => {
  const { user } = res.locals;
  res.status(200).json({ status: "success", user: user });
});

// (POST /api/auth/signup)
authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const result = await signUp(email, username, password);
    if (result.status === "failed") {
      res.status(409).json(result);
    } else {
      res.status(200).json(result);
    }
  })
);

// (POST /api/auth/login)
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const result = await logIn(username, password);
    if (result.status === "failed") {
      res.status(401).json(result);
    } else {
      const token = jwt.sign({ user: result.user }, serverConfig.JWT_SECRET);
      res
        .status(200)
        .json({ status: "success", user: result.user, token: token });
    }
  })
);

export { authRouter };
