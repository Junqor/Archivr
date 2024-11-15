// login.tsx
/*
  What to do:
  - Use REGEX to check if fields are valid
  - Add a loading spinner
  - Add message under the component so the user knows how to close the dialog
    - "Press anywhere outside the dialog to close"
  - Maybe not use hash to control the dialog
*/

import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/context/auth";

// LoginPopUp component
export function LoginPopUp() {
  const { user } = useAuth();
  if (user?.id) return <Navigate to="/" />;
  const [isOnLogin, setIsOnLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate: login } = useLogin();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Should Remove This
  useEffect(() => {
    if (isOnLogin) {
      navigate("#login");
    } else {
      // If the dialog is open and the user is on the signup form
      navigate("#signup");
    }
  }, [isOnLogin]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
    setError("");
  }, [error]);

  // Handle login form submit
  async function handleLogInSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      login({ username, password });
    } catch (err) {
      console.error(err); // Log the error
      setError("An unexpected error occurred"); // Set the error message
    }
  }

  // Handle signup form submit
  async function handleSignUpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      // If the passwords do not match
      setError("Passwords do not match"); // Set the error message
      return;
    }

    try {
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
        localStorage.setItem("auth", "true");
        window.dispatchEvent(new Event("storage"));
        toast.success("Registered successfully");
        login({ username, password });
      } else {
        // If the response status is not success
        setError(data.message); // Set the error message
      }
    } catch (err) {
      // Catch any errors
      console.error(err); // Log the error
      setError("An unexpected error occurred"); // Set the error message
    }
  }

  // Return the login popup component
  return (
    <main className="flex flex-row w-screen h-screen overflow-y-auto font-normal bg-black">
      <section className="h-full w-full bg-black">
        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
          <div className="flex flex-col items-center">
            <h1 className="font-bold">
              Welcome to <span className="text-purple">Archivr</span>
            </h1>
            <p>The best place to discover movies and TV shows</p>
          </div>
          <div className="flex flex-row space-x-4">
            <Link
              to="/" // Link to the home page
              className="bg-purple py-2 px-6 rounded-full transition-colors hover:bg-purple/75"
            >
              Back to Home
            </Link>
            <Link
              to="/random" // Link to the random media page
              className="flex justify-center items-center bg-transparent border border-white py-1 px-6 rounded-full transition-colors hover:bg-white hover:text-black box-border"
            >
              Random Media
            </Link>
          </div>
          <h3>I haven't designed this page yet, so it's just a placeholder.</h3>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center h-full w-fit bg-login-bg bg-cover bg-no-repeat bg-left py-8 px-32 border-l-2 border-gray">
        <div className="max-w-sm p-0 w-max bg-black rounded-lg overflow-hidden">
          <div className="flex flex-row w-full">
            <button
              className={`${
                isOnLogin ? "bg-purple" : "bg-black"
              } w-1/2 m-0 rounded-none hover:bg-purple h-10 transition-colors`}
              onClick={() => setIsOnLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`${
                isOnLogin ? "bg-black" : "bg-purple"
              } w-1/2 m-0 rounded-none hover:bg-purple h-10 transition-colors`}
              onClick={() => setIsOnLogin(false)}
            >
              Sign Up
            </button>
          </div>
          <form
            onSubmit={isOnLogin ? handleLogInSubmit : handleSignUpSubmit}
            className="flex flex-col px-6 py-6 space-y-4"
          >
            <h2 className="text-center font-bold leading-tight">
              {isOnLogin ? (
                <>
                  Welcome back
                  <br />
                  to <span className="text-purple">Archivr</span>
                </>
              ) : (
                <>
                  Join the <span className="text-purple">Archivr</span>
                  <br />
                  Community
                </>
              )}
            </h2>
            <p className="text-left">
              Discover trending movies, top-rated shows, and personalized picks
              chosen just for you.
            </p>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g., john_doe123"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {!isOnLogin && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., name@example.com"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isOnLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            {isOnLogin ? (
              <>
                <button
                  type="submit"
                  className="flex justify-center items-center bg-purple py-2 px-6 rounded-full transition-colors hover:bg-purple/75 w-fit self-center"
                >
                  Continue to Archivr
                </button>
                <Link to="#" className="text-center underline">
                  Forgot your password?
                </Link>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="flex justify-center items-center bg-purple py-2 px-6 rounded-full transition-colors hover:bg-purple/75 w-fit self-center"
                >
                  Start on Archivr
                </button>
                <p className="text-center">
                  Free to join. By clicking Sign Up, you agree to our{" "}
                  <Link to="#" className="underline">
                    Terms of Service
                  </Link>{" "}
                </p>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
