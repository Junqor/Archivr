// Use this after authenticateToken middleware
export const authenticateAdmin = (req, res, next) => {
    try {
        const { user } = res.locals;
        if (user.role !== "admin") {
            res.status(403).json({ status: "failed", message: "Forbidden" });
        }
        next();
    }
    catch (error) {
        res.status(403).json({ status: "failed", message: "Forbidden" });
    }
};
