import { Router } from "express";
import  { emailVer, setPass } from "./email.js";
import { URLSearchParams } from "url";


export const emailRouter = Router();


emailRouter.post("/emailVer",async (req, res) => {
   
    try {
        const userEmail = req.body.email;
        const obj = {em: userEmail};
        const searchParams = new URLSearchParams(obj);
        const queryString = searchParams.toString();
        const url = 'http://localhost:8080/api/email/passwordUpdate?' + queryString;
        if (userEmail.error) {
          throw new Error("Invalid body");
        }
        await emailVer(userEmail, url);
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
    const { query: { em } } = req;
    console.log(em);
    if(typeof em !== 'string'){ 
      throw new Error("Invalid body");
    }
    await setPass(newUserPass, em);
    res.json({ status: "success" });
  }catch(error){
    res.status(400).json({ status: "failed", message: (error as Error).message });
  }

});