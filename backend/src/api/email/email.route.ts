import { Router } from "express";
import { sendEmail, resetPassword } from "./email.service.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "../../configs/secrets.js";
import { users as UsersTable } from "../../db/schema.js";
import { db } from "../../db/database.js";
import { eq } from "drizzle-orm/expressions";
import { asyncHandler } from "../../middleware/asyncHandler.js";

export const emailRouter = Router();

// (POST /email/request-password-reset)
emailRouter.post(
  "/request-password-reset",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
      .limit(1);

    if (user.length === 0) {
      res.status(404).json({ message: "User with this email not found." });
      return;
    }

    const token = jwt.sign({ email }, serverConfig.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `${process.env.FRONTEND_URL}/password-reset?token=${token}`;

    await sendEmail(email, resetLink);

    res
      .status(200)
      .json({ message: "Password reset email sent successfully." });
  })
);

// (POST /email/reset-password)
emailRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
      const email = (decoded as JwtPayload).email;

      if (!email) {
        res.status(400).json({ message: "Invalid token." });
        return;
      }

      await resetPassword(email, newPassword);

      res
        .status(200)
        .json({ message: "Password has been reset successfully." });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token." });
    }
  })
);
