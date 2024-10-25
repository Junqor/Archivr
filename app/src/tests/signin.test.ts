import { logIn } from "../services/auth.services";

describe("User Sign-In", () => {
  test("should successfully sign in with correct email and password", async () => {
    const email = "testuser@example.com";
    const password = "password123"; // Same as the one used during signup

    const data = await logIn(email, password);

    expect(data).toBeDefined();
    expect(data).toHaveProperty("email", email);
    expect(data).toHaveProperty("username");
  });

  test("should fail if the email is incorrect", async () => {
    const email = "wronguser@example.com";
    const password = "password123";

    await expect(logIn(email, password)).rejects.toThrow("User not found");
  });

  test("should fail if the password is incorrect", async () => {
    const email = "testuser@example.com";
    const password = "wrongpassword";

    await expect(logIn(email, password)).rejects.toThrow("Invalid credentials");
  });

  test("should fail if the email is missing", async () => {
    const password = "password123";

    await expect(logIn(undefined, password)).rejects.toThrow(
      "Email and password are required"
    );
  });

  test("should fail if the password is missing", async () => {
    const email = "testuser@example.com";

    await expect(logIn(email, undefined)).rejects.toThrow(
      "Email and password are required"
    );
  });
});
