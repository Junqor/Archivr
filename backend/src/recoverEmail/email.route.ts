import { Router } from "express";
import  { emailVer, setPass } from "./email.js";


export const emailRouter = Router();



emailRouter.post("/emailVer",async (req, res) => {
   
    try {
        const userEmail = req.body.email;
        if (userEmail.error) {
          throw new Error("Invalid body");
        }
        await emailVer(userEmail); 
        res.json({ status: "success" });
      } catch (error) {
        res
          .status(400)
          .json({ status: "failed", message: (error as Error).message });
      }
});


emailRouter.post("/passwordUpdate", async (req, res) => {
  try{
    const newUserPass = req.body.password; 
    const userEmail = req.body.email; // Change so your able to get users email through the website and not input
    await setPass(newUserPass, userEmail);
    res.json({ status: "success" });
  }catch(error){
    res.status(400).json({ status: "failed", message: (error as Error).message });
  }

});