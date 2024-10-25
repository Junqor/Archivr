import dotenv from "dotenv";
import { signUp } from "../services/auth.services";
dotenv.config();

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
