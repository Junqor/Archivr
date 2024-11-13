import { logIn, signUp } from "../auth/auth.services.js";
import { conn } from "../configs/digitalocean.config.js";

// Test Suite
describe("Authentication Flow", () => {
  // Delete test user and end db connection after running all tests
  afterAll(async () => {
    await conn.execute(
      `DELETE FROM Users where email = 'testuser@example.com'`
    );
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

  test("should fail if email is the same but in different case", async () => {
    const email = "TESTUSER@EXAMPLE.COM";
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

  test("should fail if email format is invalid", async () => {
    const email = "invalidemail";
    const username = "invalidemailuser";
    const password = "validpassword123";

    const result = await signUp(email, username, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Invalid email");
  });

  test("should fail if username is too long", async () => {
    const email = "longuser@example.com";
    const username = "a".repeat(256); // Assuming a 255-char limit
    const password = "password123";

    const result = await signUp(email, username, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Username must be between 3 and 20 characters");
  });

  test("should fail if password is too short", async () => {
    const email = "weakpassworduser@example.com";
    const username = "weakuser";
    const password = "123";

    const result = await signUp(email, username, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Password must be between 6 and 24 characters");
  });

  // --------------- SIGNING IN ---------------

  test("should successfully sign in with correct email and password", async () => {
    const username = "testuser";
    const password = "password123"; // Same as the one used during signup

    const result = await logIn(username, password);

    expect(result.status).toBe("success");
  });

  test("should fail if the email does not exist", async () => {
    const username = "wronguser";
    const password = "password123";

    const result = await logIn(username, password);

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Username not found");
  });

  test("should fail if the password is incorrect", async () => {
    const username = "testuser";
    const password = "wrongpassword";

    const result = await logIn(username, password);

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
    const username = "testuser";

    const result = await logIn(username, "");

    expect(result.status).toBe("failed");
    expect(result.message).toBe("Missing username or password");
  });
});
