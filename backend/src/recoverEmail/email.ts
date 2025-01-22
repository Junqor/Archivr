import { RowDataPacket } from "mysql2";
import { TUser } from "../types/user.js";
import nodemailer  from "nodemailer";
import { generateSalt, hashPassword } from "../utils/hashPassword.js";
import { z } from "zod";
import { conn } from "../configs/digitalocean.config.js";
import jwt from 'jsonwebtoken';
var fs = require('fs');


const html = `<h1>Hello</h1> 
<p>Please click this link to change your password</p>`; //<--html

export async function emailVer(email: string){

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'archivrnoreply@gmail.com',
            pass: 'cmpn qlsd dmsb gera'
        }
    });

    const info = await transporter.sendMail({
        from: '"You" <archivrnoreply@gmail.com>',
        to: email,
        subject: "Changing password",
        html: html,
    });

   // sign with RSA SHA256
  var privateKey = fs.readFileSync('private.key');
  var token = jwt.sign({ email: email }, privateKey, { algorithm: 'RS256' }); //store token in data base

    console.log("Message sent: " + info.messageId);
}



export async function setPass(inputPassword: string, email: string){
  //use token to verify 
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


