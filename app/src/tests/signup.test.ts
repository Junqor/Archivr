import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import dotenv from "dotenv";
import { Database } from "../types/supabase";
dotenv.config();

const supabaseUrl = "https://iytqjhvicbyuhxnoeqot.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const generateSalt = (length: number = 16): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}; // use salts later

// Function under test
async function signUp(
  email: string | undefined,
  username: string | undefined,
  password: string | undefined
) {
  if (!email) {
    throw new Error("Email is required");
  }
  if (!username) {
    throw new Error("Username is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
  const id = crypto.randomUUID();
  const { data, error } = await supabase
    .from("Users")
    .insert([
      {
        id,
        email,
        username,
        password_hash: password,
        salt: generateSalt(),
        role: "user",
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Test Suite
describe("User Signup", () => {
  test("should successfully sign up a user with valid details", async () => {
    const email = "testuser@example.com";
    const username = "testuser";
    const password = "password123";

    const data = await signUp(email, username, password);

    expect(data).toBeDefined();
    expect(data?.length).toBe(1);
    expect(data[0]).toHaveProperty("email", email);
    expect(data[0]).toHaveProperty("username", username);
  });

  test("should fail if email already exists", async () => {
    const email = "testuser@example.com"; // Same as previous test
    const username = "newusername";
    const password = "newpassword123";

    await expect(signUp(email, username, password)).rejects.toThrow(
      "duplicate key value violates unique constraint"
    );
  });

  test("should fail if username already exists", async () => {
    const email = "newuser@example.com";
    const username = "testuser"; // Same as previous test
    const password = "password123";

    await expect(signUp(email, username, password)).rejects.toThrow(
      "duplicate key value violates unique constraint"
    );
  });

  test("should fail if email is missing", async () => {
    const username = "testuser2";
    const password = "password123";

    await expect(signUp(undefined, username, password)).rejects.toThrow(
      "Email is required"
    );
  });

  test("should fail if username is missing", async () => {
    const email = "anotheruser@example.com";
    const password = "password123";

    await expect(signUp(email, undefined, password)).rejects.toThrow(
      "Username is required"
    );
  });

  test("should fail if password is missing", async () => {
    const email = "userwithoutpassword@example.com";
    const username = "nopassworduser";

    await expect(signUp(email, username, undefined)).rejects.toThrow(
      "Password is required"
    );
  });
});
