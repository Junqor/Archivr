import { conn } from "../configs/digitalocean.config";
import { TUser } from "../types/user";
import { AuthErrorHandler } from "../utils/authErrorHandler";
import { generateSalt, hashPassword } from "../utils/hashPassword";

export type TAuthResult = {
  status: "success" | "failed";
  message: string;
};

export async function signUp(
  email: string,
  username: string,
  password: string
): Promise<TAuthResult> {
  if (!email || !username || !password) {
    return {
      status: "failed",
      message: "Missing email, username, or password",
    };
  }

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

  // First retrieve the user with matching email from the database
  const [rows] = await conn
    .query<TUser[]>("SELECT * FROM Users WHERE email = ?", [username])
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
  return { status: "success", message: "Logged in successfully" };
}
