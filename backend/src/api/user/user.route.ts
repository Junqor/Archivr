import z, { ZodError } from "zod";
import { Router } from "express";
import { getUserSettings, getUserProfileSettings, setUserSettings } from "./user.services.js";
import bodyParser, { json } from "body-parser";
import { TAuthToken } from "../../types/index.js";
import { authenticateToken } from "../../middleware/authenticateToken.js";

export const userRouter = Router();

userRouter.get("/get-user-settings", authenticateToken, async (req, res) => {
    try {
        const values = await getUserSettings(res.locals.user.id);
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

userRouter.post("/set-user-settings", authenticateToken, bodyParser.text(), async (req, res) => {
    try {
        let body = JSON.parse(req.body, (key, value) => {
            if(typeof value === 'object' && value !== null) {
                if (value.dataType === 'Map') {
                    return new Map(value.value);
                }
            }
            return value;
        });
        body = setSettingsSchema.parse(body);
        await setUserSettings(res.locals.user.id, body.settings);
        res.json({ status:"success" });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: error instanceof ZodError ? "Invalid body" : (error as Error).message,
        });
    }
});