import { logIn, LogInError } from "../auth/auth.services";
import { signUp, SignUpError } from "../auth/auth.services";
import { conn } from "../configs/digitalocean.config";

// Test Suite
describe("Authentication Flow", () => {
  afterAll(async () => {
    await conn.end();
  });

  test("should successfully sign up a user with valid details", async () => {
    const email = "testuser@example.com";
    const username = "testuser";
    const password = "password123";

    const status = await signUp(email, username, password);

    expect(status).toBe(true);
  });

  test("should fail if email already exists", async () => {
    const email = "testuser@example.com"; // Same as previous test
    const username = "newusername";
    const password = "newpassword123";

    await expect(signUp(email, username, password)).rejects.toThrow(
      `Duplicate entry 'testuser@example.com' for key 'Users.email'`
    );
  });

  test("should fail if username already exists", async () => {
    const email = "newuser@example.com";
    const username = "testuser"; // Same as previous test
    const password = "password123";

    await expect(signUp(email, username, password)).rejects.toThrow(
      `Duplicate entry 'testuser' for key 'Users.username'`
    );
  });

  test("should fail if email is missing", async () => {
    const username = "testuser2";
    const password = "password123";

    await expect(signUp(undefined, username, password)).rejects.toThrow(
      SignUpError
    );
  });

  test("should fail if username is missing", async () => {
    const email = "anotheruser@example.com";
    const password = "password123";

    await expect(signUp(email, undefined, password)).rejects.toThrow(
      SignUpError
    );
  });

  test("should fail if password is missing", async () => {
    const email = "userwithoutpassword@example.com";
    const username = "nopassworduser";

    await expect(signUp(email, username, undefined)).rejects.toThrow(
      SignUpError
    );
  });

  // --------------- SIGNING IN ---------------

  test("should successfully sign in with correct email and password", async () => {
    const email = "testuser@example.com";
    const password = "password123"; // Same as the one used during signup

    const user = await logIn(email, password);

    expect(user).toBeDefined();
    expect(user).toHaveProperty("email", email);
    expect(user).toHaveProperty("username");
  });

  test("should fail if the email is incorrect", async () => {
    const email = "wronguser@example.com";
    const password = "password123";

    await expect(logIn(email, password)).rejects.toThrow(LogInError);
  });

  test("should fail if the password is incorrect", async () => {
    const email = "testuser@example.com";
    const password = "wrongpassword";

    await expect(logIn(email, password)).rejects.toThrow(LogInError);
  });

  test("should fail if the email is missing", async () => {
    const password = "password123";

    await expect(logIn(undefined, password)).rejects.toThrow(LogInError);
  });

  test("should fail if the password is missing", async () => {
    const email = "testuser@example.com";

    await expect(logIn(email, undefined)).rejects.toThrow(LogInError);
  });
});
