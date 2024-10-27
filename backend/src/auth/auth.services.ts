import { conn } from "../configs/digitalocean.config";
import { TUser } from "../types/user";
import { generateSalt, hashPassword } from "../utils/hashPassword";

export class SignUpError extends Error {}

export async function signUp(
  email: string | undefined,
  username: string | undefined,
  password: string | undefined
) {
  if (!email || !username || !password) {
    throw new SignUpError("Missing email, username, or password");
  }

  // Generate a random salt
  const salt = generateSalt();
  const { hashedPassword } = await hashPassword(password, salt);

  const values = [email, username, hashedPassword, salt];

  const query = `
    INSERT INTO Users (email, username, password_hash, salt) 
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await conn.query(query, values);

  return true;
}

export class LogInError extends Error {}

export async function logIn(
  email: string | undefined,
  password: string | undefined
) {
  if (!email || !password) {
    throw new LogInError("Missing email or password");
  }

  // First retrieve the user with matching email from the database
  const [rows] = await conn.query<TUser[]>(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );
  const user = rows[0];
  if (!user) {
    throw new LogInError("User not found");
  }
  const { salt, password_hash } = user;

  // Hash the password with the salt
  const { hashedPassword } = await hashPassword(password, salt);

  // Check if the password matches
  if (hashedPassword !== password_hash) {
    throw new LogInError("Invalid credentials");
  }

  // Return the user object
  return user;
}
