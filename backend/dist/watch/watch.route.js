import { Router } from "express";
import { getWatchProviders } from "./watch.service.js";
const watchRouter = Router();
// (GET /watch/:id)
watchRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getWatchProviders(parseInt(id));
        res.status(200).json({ status: "success", result });
    }
    catch (error) {
        res.status(500).json({ status: "failed", message: "Something went wrong" });
    }
});
export { watchRouter };
