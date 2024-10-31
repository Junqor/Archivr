import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useEffect, useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

export function LoginPopUp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnLogin, setIsOnLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const url = useLocation();
  const navigate = useNavigate();
  const hash = window.location.hash;

  useEffect(() => {
    if (!isOpen) {
      navigate(url.pathname);
    } else if (isOnLogin) {
      navigate("#login");
    } else {
      navigate("#signup");
    }
  }, [isOnLogin, isOpen]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    setError("");
  }, [error]);

  async function handleLogInSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem("auth", "true");
        window.dispatchEvent(new Event("storage"));
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    }
  }

  async function handleSignUpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem("auth", "true");
        window.dispatchEvent(new Event("storage"));
        toast.success("Registered successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    }
  }

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
          <DialogTitle className="self-center text-center text-[2.074rem] leading-tight">
            {isOnLogin ? (
              <>
                Welcome back to <span className="text-purple">Archivr</span>
              </>
            ) : (
              <>
                Join the <span className="text-purple">Archivr</span> Community
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
              placeholder="username"
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
                placeholder="m@email.com"
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
