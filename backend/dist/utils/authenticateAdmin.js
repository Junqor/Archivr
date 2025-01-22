/** Authenticate admin role */
export function authenticateAdmin(req) {
    const token = req.token;
    if (token.user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return true;
}
