// login.tsx
/*
  What to do:
  - Use REGEX to check if fields are valid
  - Add a loading spinner
  - Add message under the component so the user knows how to close the dialog
    - "Press anywhere outside the dialog to close"
  - Maybe not use hash to control the dialog
*/

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useEffect, useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

// LoginPopUp component
export function LoginPopUp() {
  const [isOpen, setIsOpen] = useState(false); // State to control the dialog
  const [isOnLogin, setIsOnLogin] = useState(true); // State to control the login/signup form
  const [username, setUsername] = useState(""); // State to store the username
  const [email, setEmail] = useState(""); // State to store the email
  const [password, setPassword] = useState(""); // State to store the password
  const [confirmPassword, setConfirmPassword] = useState(""); // State to store the confirm password
  const [error, setError] = useState(""); // State to store the error message
  const url = useLocation(); // Get the current URL
  const navigate = useNavigate(); // Get the navigate function
  const hash = window.location.hash; // Get the hash from the URL

  // Check if the dialog is open
  useEffect(() => {
    if (!isOpen) {
      // If the dialog is closed
      navigate(url.pathname);
    } else if (isOnLogin) {
      // If the dialog is open and the user is on the login form
      navigate("#login");
    } else {
      // If the dialog is open and the user is on the signup form
      navigate("#signup");
    }
  }, [isOnLogin, isOpen]);

  // Reset form fields when the dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isOpen]);

  // Show error message and reset form fields
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
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/auth/login", // Send a POST request to the login endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }), // Send the username and password
        }
      );

      const data = await response.json(); // Get the response data
      if (data.status === "success") {
        // If the response status is success
        localStorage.setItem("auth", "true"); // Set the auth state to true
        window.dispatchEvent(new Event("storage")); // Trigger the storage event
        toast.success("Logged in successfully"); // Show a success message
        setIsOpen(false); // Close the dialog
      } else {
        setError(data.message); // Set the error message
      }
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
        // If the response status is success
        localStorage.setItem("auth", "true"); // Set the auth state to true
        window.dispatchEvent(new Event("storage")); // Trigger the storage event
        toast.success("Registered successfully"); // Show a success message
        setIsOpen(false); // Close the dialog
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
    <Dialog
      open={hash === "#login" || hash === "#signup"}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex flex-row items-center">
          <AccountCircleIcon className="mr-2" />
          <p>Sign in</p>
        </Button>
      </DialogTrigger>
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
