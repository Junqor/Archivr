import { serverConfig } from "../configs/secrets.js";
import jwt from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from Authorization header (format: Bearer <token>)
    try {
        // Check if token is present
        if (!token) {
            throw new Error("No token found");
        }
        // Verify token
        const tokenBody = jwt.verify(token, serverConfig.JWT_SECRET);
        res.locals.user = tokenBody.user;
        next();
    }
    catch (error) {
        res.status(401).json({ status: "failed", message: "Unauthorized" });
    }
};
