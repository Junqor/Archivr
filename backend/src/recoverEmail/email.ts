import { RowDataPacket } from "mysql2";
import { TUser } from "../types/user.js";
import nodemailer  from "nodemailer";
import { generateSalt, hashPassword } from "../utils/hashPassword.js";
import { z } from "zod";
import { conn } from "../configs/digitalocean.config.js";
import jwt from 'jsonwebtoken';
//var fs = require('fs');



export async function emailVer(email: string, url: string){


const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

<div style="  margin: auto;
width: 100%;
text-align: center;
background-color: #5616EC;
padding-bottom: 600px;">
    <img style=" width: 150px;
    height: 150px;" src="https://www.cabq.gov/artsculture/biopark/news/10-cool-facts-about-penguins/@@images/1a36b305-412d-405e-a38b-0947ce6709ba.jpeg" alt="penguin">  
    <h1 style="color: #F2F2F0;">Hello lets reset your password</h1>
    <p style="color: #F2F2F0;">Please clicked the link to change your password.</p>
    <a href="${url}">
    <button style="
    border: none;
    color: #0D0D0D;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    width: 150px;
    border-radius: 15%;
    cursor: pointer;
    background-color: #F2F2F0; "type="button">Reset</button>
    </a>
</div>

</body>
</html>`; //<--html

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'archivrnoreply@gmail.com',
            pass: process.env.EM_PASS,
        }
    });

    const info = await transporter.sendMail({
        from: '"You" <archivrnoreply@gmail.com>',
        to: email,
        subject: "Changing password",
        html: html,
    });

   
    
}



export async function setPass(inputPassword: string, email: string){

  const parsedPassword = z.string().min(6).max(24).safeParse(inputPassword);
  if (!parsedPassword.success) {
    return {
      status: "failed",
      message: "Password must be between 6 and 24 characters",
    };
  }
  const password = parsedPassword.data;

  // Generate a random salt
  const salt = generateSalt();
  const { hashedPassword } = await hashPassword(password, salt);

  const values = [hashedPassword, salt, email];

  const query = `UPDATE Users
  SET password_hash = (?), salt = (?)
  WHERE email = (?)
  `;

  await conn
  .query(query, values);
}


