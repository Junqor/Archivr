type loginArgs = {
  username: string;
  password: string;
};

export const tryLogin = async ({ username, password }: loginArgs) => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (data.status === "success") {
    return data.user;
  } else {
    throw new Error(data.message);
  }
};

type signupArgs = {
  username: string;
  email: string;
  password: string;
};

export const trySignup = async ({ username, email, password }: signupArgs) => {
  // Try to sign up
  const response = await fetch(
    // Send a POST request to the signup endpoint
    import.meta.env.VITE_API_URL + "/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }), // Send the username, email, and password
    }
  );

  const data = await response.json(); // Get the response data
  if (data.status === "success") {
    return data;
  } else {
    throw new Error(data.message);
  }
};
