import { TAuthResult } from "../auth/auth.services";

type TAuthError = Error & {
  code: string;
};

// Handles errors related to authentication
export function AuthErrorHandler(error: any): TAuthResult {
  if ((error as TAuthError).code === "ER_DUP_ENTRY") {
    // Check which field caused the conflict based on the unique key's name.
    if (error.message.includes("email")) {
      return { status: "failed", message: "Email is already registered" };
    } else if (error.message.includes("username")) {
      return { status: "failed", message: "Username is already taken" };
    } else {
      return { status: "failed", message: "Duplicate entry detected" };
    }
  }
  throw new Error(error);
}
