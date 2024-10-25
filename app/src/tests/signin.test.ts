import { supabase } from "../configs/supabase.config";

async function signIn(email: string | undefined, password: string | undefined) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data, error } = await supabase
    .from("Users")
    .select("id, email, username, password_hash")
    .eq("email", email)
    .single(); // Expecting exactly one user

  if (error) {
    throw new Error("User not found");
  }

  // In a real-world app, you'd compare hashed passwords, but for now:
  if (data.password_hash !== password) {
    throw new Error("Invalid credentials");
  }

  return data;
}

describe("User Sign-In", () => {
  test("should successfully sign in with correct email and password", async () => {
    const email = "testuser@example.com";
    const password = "password123"; // Same as the one used during signup

    const data = await signIn(email, password);

    expect(data).toBeDefined();
    expect(data).toHaveProperty("email", email);
    expect(data).toHaveProperty("username");
  });

  test("should fail if the email is incorrect", async () => {
    const email = "wronguser@example.com";
    const password = "password123";

    await expect(signIn(email, password)).rejects.toThrow("User not found");
  });

  test("should fail if the password is incorrect", async () => {
    const email = "testuser@example.com";
    const password = "wrongpassword";

    await expect(signIn(email, password)).rejects.toThrow(
      "Invalid credentials"
    );
  });

  test("should fail if the email is missing", async () => {
    const password = "password123";

    await expect(signIn(undefined, password)).rejects.toThrow(
      "Email and password are required"
    );
  });

  test("should fail if the password is missing", async () => {
    const email = "testuser@example.com";

    await expect(signIn(email, undefined)).rejects.toThrow(
      "Email and password are required"
    );
  });
});
