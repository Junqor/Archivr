import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { ban_users, get_user_offences, is_user_banned, pardon_users } from "./moderation.service.js";
import z from "zod";

export const moderationRouter = Router();

moderationRouter.get("/", async (req, res) => {
    try {
        res.send("You are inside of the moderation router.")
    }
    catch (error) {
        res.status(400);
        throw error;
    }
});

const isUserBannedSchema = z.object({
    user_id: z.number(),
})

moderationRouter.post("/is-user-banned", async (req, res) => {
    try {
        const body = isUserBannedSchema.parse(req.body);
        const result = await is_user_banned(body.user_id);
        res.json(result);
    }
    catch (error) {
        res.status(400);
        throw error;
    }
});

const getUserOffencesSchema = z.object({
    limit: z.number(),
    offset: z.number(),
})

moderationRouter.post("/get-user-offences/:userId", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const {userId} = req.params;
        const body = getUserOffencesSchema.parse(req.body);
        const result = await get_user_offences(parseInt(userId),body.limit,body.offset);
        res.json(result[0]);
    }
    catch (error) {
        res.status(400);
        throw error;
    }
});

const banUsersSchema = z.object({
    user_ids: z.array(z.number()),
    message: z.string(),
    expiry_timestamp: z.union([z.string(),z.null()]),
})

moderationRouter.post("/ban-users", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const body = banUsersSchema.parse(req.body);
        const result = await ban_users(body.user_ids,body.expiry_timestamp,body.message);
        res.json(result);
    }
    catch (error) {
        res.status(400);
        throw error;
    }
});

const pardonUsersSchema = z.object({
    user_ids: z.array(z.number()),
})

moderationRouter.post("/pardon-users", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const body = pardonUsersSchema.parse(req.body);
        const result = await pardon_users(body.user_ids);
        res.json(result);
    }
    catch (error) {
        res.status(400);
        throw error;
    }
});