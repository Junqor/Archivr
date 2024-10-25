import express from "express";
import path from "node:path";
import fs from "node:fs";
import mysql from "mysql2";
import session from "express-session";
import { ResultSetHeader } from "mysql2";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { database } from "./database/database"
//import { getMedia } from "./tests/getMedia.test";
//import "./types/supabase";
//import { addMedia } from "./tests/addMedia.test";
//import { deleteMedia } from "./tests/deleteMedia.test";

const app = express();

const port = 8080;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
	secret: '1',
	resave: false,
	saveUninitialized: true
}))

/*
app.get("/test", async (req, res) => {
  try {
    await addMedia();
    const result = await getMedia();
    await deleteMedia();
    res.send(result);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).send("Error fetching media");
  }
});
*/

app.get("/logout", (req, res) => {
  if (!req.session.user){
    res.send("You can't log out because you aren't logged in.");
    return;
  }
  console.log(req.session.user.username + " logged out")
	req.session.user = null
	req.session.save(function(err){
		if (err) return;
		req.session.regenerate(function(err){
			if (err) return;
			res.send("you logged out")
      return;
		})
	})
})

app.get("/home", (req, res) => {
  if (!req.session.user){
    res.send("I don't even know who you are!! What are you logged out or something!?");
    return;
  }
  res.send("Oh hi, "+req.session.user.username);
  return;
})

app.post("/submit", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", async (req, res) => {
  let found_user = await database.getUserFromEmail(req.body.email);
  if (found_user == null){
    try{
      let pl = 0;
      if (req.body.admin == "on"){
        pl = 1;
      }
      if (typeof(req.body.email) != "string" || typeof(req.body.username) != "string" || typeof(req.body.password) != "string"){
        res.send("you are doing something weird stop doing that")
        return;
      }
      await database.addUser({email:req.body.email,username:req.body.username,password:req.body.password,privilege_level:pl})
      res.send("thanank you for signing up mr/mrs '"+req.body.username+"'.\ngo back and log in now and have a nice day");
      return;
    }
    catch{
      res.send("there was an error or something. go back now");
      return;
    }
  }
  else{
    res.send("Your email used already! go back and try again");
    return;
  }
});

app.post("/login", async (req, res) => {
  let found_user = await database.getUserFromEmail(req.body.email);
  if (found_user == null){
    res.send("this email is not an account go back and type a real one stupid");
    return;
  }
  else{
    if (found_user.password != req.body.password){
      res.send("Your password is wrong! go back.");
      return;
    }
    else{
      req.session.regenerate(function(err){
        if (err) return;
        req.session.user = found_user;
        req.session.save(function(err){
          if (err) return;
          if (req.session.user){
            console.log(req.session.user.username + " logged in");
            res.send("you logged in to session!!!!");
          }
          else{
            res.send("something wrong happened");
          }
        })
      })
    }
  }
});

app.listen(port, async () => {
  console.log(`ARCHIVR is active and listing on on port ${port}`);
  let found_user = await database.getUserFromEmail("skibidi");
  if (found_user != null){
    console.log(found_user.email);
  }
  await database.addMedia({email:"grug",username:"grug",password:"grug",privilege_level:1});
});
