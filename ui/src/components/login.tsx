import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

export function LoginPopUp() {
  const [isLogin, setIsLogin] = useState(true);

  function handleLogInClick() {
    setIsLogin(true);
  }
  function handleSignUpClick() {
    setIsLogin(false);
  }

  return (
    <Dialog>
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
              isLogin ? "bg-purple" : "bg-black"
            } w-1/2 m-0 rounded-none hover:bg-purple rounded-tl-lg h-10`}
            onClick={handleLogInClick}
          >
            Sign In
          </Button>
          <Button
            className={`${
              isLogin ? "bg-black" : "bg-purple"
            } w-1/2 m-0 rounded-none hover:bg-purple rounded-tr-lg h-10`}
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
        </div>
        <div className="flex flex-col px-6 pb-6 space-y-4">
          <DialogTitle className="self-center">
            {isLogin ? (
              <h2 className="text-center">
                Welcome back to <span className="text-purple">Archivr</span>
              </h2>
            ) : (
              <h2 className="text-center">
                Join the <span className="text-purple">Archivr</span> Community
              </h2>
            )}
          </DialogTitle>
          <DialogDescription>
            <p className="text-sm text-left">
              Discover trending movies, top-rated shows, and personalized picks
              chosen just for you.
            </p>
          </DialogDescription>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              autoComplete="off"
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@email.com"
                autoComplete="off"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          )}
          {isLogin ? (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
