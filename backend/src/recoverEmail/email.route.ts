import { Router } from "express";
import  { emailVer } from "./email.js";


export const emailRouter = Router();



emailRouter.post("/emailVer",async (req, res) => {
   
    try {
        const userEmail = req.body.email;
        if (userEmail.error) {
          throw new Error("Invalid body");
        }
        const email = await emailVer(userEmail); 
        res.json({ status: "success" });
      } catch (error) {
        res
          .status(400)
          .json({ status: "failed", message: (error as Error).message });
      }
});