// Request Password Reset
export const requestPasswordReset = async (email: string) => {
  const url = import.meta.env.VITE_API_URL + "/email/request-password-reset";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send password reset email");
    }
  } catch (error) {
    console.error(error);
  }
};

// Reset Password
export const resetPassword = async (token: string, newPassword: string) => {
  const url = import.meta.env.VITE_API_URL + "/email/reset-password";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error("Failed to reset password");
    }
  } catch (error) {
    console.error(error);
  }
};
