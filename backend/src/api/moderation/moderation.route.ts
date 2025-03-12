import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";

export const moderationRouter = Router();

moderationRouter.get("/", async (req, res) => {
    try {
        res.send("You are inside of the moderation router.")
    }
    catch (error) {
        throw error;
    }
});

moderationRouter.get("/is_user_banned", async (req, res) => {
    try {
        
    }
    catch (error) {
        throw error;
    }
});

moderationRouter.get("/get_user_offences", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        
    }
    catch (error) {
        throw error;
    }
});

moderationRouter.get("/ban_users", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        
    }
    catch (error) {
        throw error;
    }
});

moderationRouter.get("/pardon_users", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        
    }
    catch (error) {
        throw error;
    }
});