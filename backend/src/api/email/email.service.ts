import nodemailer from "nodemailer";
import { generateSalt, hashPassword } from "../../utils/hashPassword.js";
import { db } from "../../db/database.js";
import { users as UsersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm/expressions";

// Email Template
export async function sendEmail(email: string, link: string) {
  // Get user by email
  const userResult = await db
    .select({ username: UsersTable.username })
    .from(UsersTable)
    .where(eq(UsersTable.email, email))
    .limit(1);

  const user = userResult[0]?.username;

  const emailTemplate = `
  <html>
    <body>
      <table align="center" cellpadding="0" cellspacing="0" style="background-color: #f2f2f0; font-family: Inter, sans-serif; padding: 2.5rem 1rem; color: #0D0D0D; width: 100%; max-width: 600px;">
        <tr>
          <td align="center" colspan="2">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
              <tr>
                <td style="padding-right: 10px; vertical-align: middle;">
                  <img src="https://i.imgur.com/X4m7lqC.png" alt="Archivr Logo" style="aspect-ratio: 1/1; height: 30px; width: auto;"/>
                </td>
                <td style="vertical-align: middle;">
                  <h1 style="font-size: 2rem; font-weight: 800; margin: 0;">Archivr</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" colspan="2">
            <img src="https://media.tenor.com/X6oLkn9sBewAAAAi/sparklepandalana-penguin.gif" alt="Penguin Typing" style="width: 200px;"/>
          </td>
        </tr>
        <tr>
          <td align="center" colspan="2">
            <h2 style="font-size: 1.5rem; font-weight: 700;">Reset Your Password</h2>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <h3 style="font-size: 1.51188rem; font-weight: 300; color: #0D0D0D;">Hi ${user},</h3>
            <p>We got a request to reset your password for Archivr. No worries, we've got you covered!</p>
            <p>Click the button below to set a new password:</p>
          </td>
        </tr>
        <tr>
          <td align="center" colspan="2">
            <a href="${link}" style="display: inline-block; background-color: #5616EC; color: #ffffff; font-size: 1rem; font-weight: 500; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Reset Password</a>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${link}" style="color: #5616EC;">${link}</a></p>
            <p>If you didn't ask for this, you can ignore this email. Your password will stay the same.</p>
            <p>Let us know if you need any help!</p>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <p><strong>The Archivr Team 🐧</strong></p>
          </td>
        </tr>
        <tr>
          <td align="center" colspan="2">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
              <tr>
                <td style="padding-right: 10px; vertical-align: middle;">
                  <img src="https://i.imgur.com/X4m7lqC.png" alt="Archivr Logo" style="aspect-ratio: 1/1; height: 28px; width: auto;"/>
                </td>
                <td style="vertical-align: middle;">
                  <h3 style="font-size: 1.51188rem; font-weight: 300; color: #0D0D0D;">Archivr</h3>
                </td>
            </tr>
          </table>
        </td>
      </tr>
      </table>
    </body>
  </html>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Archivr" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Password Request",
    html: emailTemplate,
  });
}

// Reset Password
export async function resetPassword(email: string, newPassword: string) {
  // Generate salt
  const salt = generateSalt();

  const { hashedPassword } = await hashPassword(newPassword, salt);

  await db
    .update(UsersTable)
    .set({ passwordHash: hashedPassword, salt: salt })
    .where(eq(UsersTable.email, email));
}
