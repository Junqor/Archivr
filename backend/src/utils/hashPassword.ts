import crypto from "crypto";

export const generateSalt = (length: number = 16): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

export const hashPassword = async (password: string, salt: string) => {
  // Encode the password and salt before passing in to digest functions
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);

  // Hash password as bytes using SHA-256
  const hashedPasswordData = await crypto.subtle.digest("SHA-256", data);

  // Decode hashed password data into a string
  const hashedPasswordArray = Array.from(new Uint8Array(hashedPasswordData)); // convert buffer to byte array
  const hashedPassword = hashedPasswordArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string

  return { hashedPassword, salt };
};
