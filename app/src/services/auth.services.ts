import { supabase } from "../configs/supabase.config";
import { generateSalt } from "../utils/generateSalt";

export async function signUp(
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

export async function logIn(
  email: string | undefined,
  password: string | undefined
) {
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
