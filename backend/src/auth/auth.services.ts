import { RowDataPacket } from "mysql2";
import { conn } from "../configs/digitalocean.config.js";
import { TUser } from "../types/user.js";
import { AuthErrorHandler } from "../utils/authErrorHandler.js";
import { generateSalt, hashPassword } from "../utils/hashPassword.js";
import { z } from "zod";

export type TAuthResult = {
  status: "success" | "failed";
  message: string;
  user?: Partial<TUser>;
};

export async function signUp(
  inputEmail: string,
  inputUsername: string,
  inputPassword: string
): Promise<TAuthResult> {
  if (!inputEmail || !inputUsername || !inputPassword) {
    return {
      status: "failed",
      message: "Missing email, username, or password",
    };
  }

  // Validate email
  const parsedEmail = z.string().email().safeParse(inputEmail);
  if (!parsedEmail.success) {
    return {
      status: "failed",
      message: "Invalid email",
    };
  }
  const email = parsedEmail.data;

  // Validate username length
  const parsedUsername = z.string().min(3).max(20).safeParse(inputUsername);
  if (!parsedUsername.success) {
    return {
      status: "failed",
      message: "Username must be between 3 and 20 characters",
    };
  }
  const username = parsedUsername.data;

  // Validate password length
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

  const values = [email, username, hashedPassword, salt];

  const query = `
    INSERT INTO Users (email, username, password_hash, salt) 
    VALUES (?, ?, ?, ?)
  `;

  const result = await conn
    .query(query, values)
    .then(
      (_e) =>
        ({
          status: "success",
          message: "Signed up successfully",
        } as TAuthResult)
    )
    .catch((err) => AuthErrorHandler(err)); // Handle SQL errors

  return result;
}

export async function logIn(
  username: string,
  password: string
): Promise<TAuthResult> {
  if (!username || !password) {
    return { status: "failed", message: "Missing username or password" };
  }

  // First retrieve the user with matching username from the database
  const [rows] = await conn
    .query<(RowDataPacket & TUser)[]>(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    )
    .then((e) => e);
  const user = rows[0];
  if (!user) {
    return { status: "failed", message: "Username not found" };
  }
  const { salt, password_hash } = user; // extract salt and hashed password in db

  // Hash the entered password with the salt
  const { hashedPassword } = await hashPassword(password, salt);

  // Check if the passwords match
  if (hashedPassword !== password_hash) {
    return { status: "failed", message: "Incorrect password" };
  }

  // Return the user object
  return {
    status: "success",
    message: "Logged in successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}
