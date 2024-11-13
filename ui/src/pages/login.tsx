// login.tsx
/*
  What to do:
  - Use REGEX to check if fields are valid
  - Add a loading spinner
  - Add message under the component so the user knows how to close the dialog
    - "Press anywhere outside the dialog to close"
  - Maybe not use hash to control the dialog
*/

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
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
    <Dialog open={true}>
      <DialogTrigger>{null}</DialogTrigger>
      <DialogContent className="max-w-sm p-0">
        <div className="flex flex-row w-full">
          <Button
            className={`${
              isOnLogin ? "bg-purple" : "bg-black"
            } w-1/2 m-0 rounded-none hover:bg-purple rounded-tl-lg h-10`}
            onClick={() => setIsOnLogin(true)}
          >
            Sign In
          </Button>
          <Button
            className={`${
              isOnLogin ? "bg-black" : "bg-purple"
            } w-1/2 m-0 rounded-none hover:bg-purple rounded-tr-lg h-10`}
            onClick={() => setIsOnLogin(false)}
          >
            Sign Up
          </Button>
        </div>
        <form
          onSubmit={isOnLogin ? handleLogInSubmit : handleSignUpSubmit}
          className="flex flex-col px-6 pb-6 space-y-4"
        >
          <DialogTitle className="self-center text-center text-[2.074rem] font-bold leading-tight">
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
          </DialogTitle>
          <DialogDescription className="text-sm text-left">
            Discover trending movies, top-rated shows, and personalized picks
            chosen just for you.
          </DialogDescription>
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
              <Button type="submit" className="self-center w-full ">
                Login
              </Button>
              <a href="#" className="block text-sm text-center underline">
                Forgot your password?
              </a>
            </>
          ) : (
            <Button type="submit" className="self-center w-full ">
              Sign Up
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
