import { RowDataPacket } from "mysql2";
import { TUser } from "../types/user.js";
import nodemailer  from "nodemailer";

const html = `<h1>Hello world</h1> <p>This is a test for nodemailer</p>`; //<--html

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
        subject: "Testing, testing, 123",
        html: html,
    });

    console.log("Message sent: " + info.messageId);
}


