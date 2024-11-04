import { Router } from "express";
import { searchRouter } from "./search/search.route";

export const moviesRouter = Router();

moviesRouter.use("/search", searchRouter);
