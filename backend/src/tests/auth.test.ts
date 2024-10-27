import { logIn, signUp } from "../auth/auth.services";
import { conn } from "../configs/digitalocean.config";

// Test Suite
describe("Authentication Flow", () => {
  // End db connection after running all tests
  afterAll(async () => {
    await conn.end();
  });

  test("should successfully sign up a user with valid details", async () => {
    const email = "testuser@example.com";
    const username = "testuser";
    const password = "password123";

    const result = await signUp(email, username, password);

    expect(result.status).toBe("success");
  });

  test("should fail if email already exists", async () => {
    const email = "testuser@example.com"; // Same as previous test
    const username = "newusername";
    const password = "newpassword123";

    const result = await signUp(email, username, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Email is already registered");
  });

  test("should fail if username already exists", async () => {
    const email = "newuser@example.com";
    const username = "testuser"; // Same as previous test
    const password = "password123";

    const result = await signUp(email, username, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Username is already taken");
  });

  test("should fail if email is missing", async () => {
    const username = "testuser2";
    const password = "password123";

    const result = await signUp("", username, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Missing email, username, or password");
  });

  test("should fail if username is missing", async () => {
    const email = "anotheruser@example.com";
    const password = "password123";

    const result = await signUp(email, "", password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Missing email, username, or password");
  });

  test("should fail if password is missing", async () => {
    const email = "userwithoutpassword@example.com";
    const username = "nopassworduser";

    const result = await signUp(email, username, "");

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Missing email, username, or password");
  });

  // --------------- SIGNING IN ---------------

  test("should successfully sign in with correct email and password", async () => {
    const email = "testuser@example.com";
    const password = "password123"; // Same as the one used during signup

    const result = await logIn(email, password);

    expect(result.status).toBe("success");
  });

  test("should fail if the email does not exist", async () => {
    const email = "wronguser@example.com";
    const password = "password123";

    const result = await logIn(email, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Username not found");
  });

  test("should fail if the password is incorrect", async () => {
    const email = "testuser@example.com";
    const password = "wrongpassword";

    const result = await logIn(email, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Incorrect password");
  });

  test("should fail if the email is missing", async () => {
    const password = "password123";

    const result = await logIn("", password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Missing username or password");
  });

  test("should fail if the password is missing", async () => {
    const email = "testuser@example.com";

    const result = await logIn(email, "");

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Missing username or password");
  });
});
