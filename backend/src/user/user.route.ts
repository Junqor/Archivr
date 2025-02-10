import z, { ZodError } from "zod";
import { Router } from "express";
import { getUserSettings, getUserProfileSettings, setUserSettings } from "./user.services.js";
import { authenticateToken, AuthRequest } from "../middleware/authenticateToken.js";
import { TAuthToken } from "../types/user.js";

export const userRouter = Router();

userRouter.get("/get-user-settings", authenticateToken, async (req, res) => {
    try {
        const token = (req as AuthRequest).token as TAuthToken;
        const values = await getUserSettings(token.user.id);
        res.json({ status:"success", settings:values });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: error instanceof ZodError ? "Invalid body" : (error as Error).message,
        });
    }
});

userRouter.get("/get-user-profile-settings/:userId", async (req, res) => {
    try {
        const user_id = parseInt(req.params.userId);
        const values = await getUserProfileSettings(user_id);
        res.json({ status:"success", settings:values });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: error instanceof ZodError ? "Invalid body" : (error as Error).message,
        });
    }
});

const setSettingsSchema = z.object({
  settings: z.map(z.string(),z.string()),
});

userRouter.post("/set-user-settings", authenticateToken, async (req, res) => {
    try {
        const body = setSettingsSchema.parse(req.body);
        const token = (req as AuthRequest).token as TAuthToken;
        await setUserSettings(token.user.id, body.settings);
        res.json({ status:"success" });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: error instanceof ZodError ? "Invalid body" : (error as Error).message,
        });
    }
});