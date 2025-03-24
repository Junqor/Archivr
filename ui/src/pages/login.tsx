// login.tsx
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { tryLogin, trySignup } from "@/api/auth";
import { requestPasswordReset } from "@/api/email";
import {
  LockResetRounded,
  NotificationsActiveRounded,
} from "@mui/icons-material";
import loginBackground from "@/assets/login-bg.png";

// LoginPopUp component
export function Login() {
  const { user, setLoginData } = useAuth();
  if (user) return <Navigate to="/" />;

  const [isOnLogin, setIsOnLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Capture the current location
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);

  const { mutate: login } = useMutation({
    mutationFn: tryLogin,
    onSuccess: async (_data) => {
      await setLoginData();
      toast.success("Logged in successfully");

      // Redirect the user back to the page they were on before logging in
      const from = location.state.from || "/";
      navigate(from);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      // setUsername("");
      // setEmail("");
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
      await trySignup({ username, email, password });
      toast.success("Registered successfully");
      login({ username, password }); // Automatically log the user in after registration
    } catch (err) {
      console.error(err); // Log the error
      toast.error((err as Error).message);
    }
  }

  // Return the login popup component
  return (
    <main className="flex h-screen w-screen flex-row overflow-y-auto bg-black font-normal">
      <link rel="preload" as="image" href={loginBackground}></link>
      <section className="hidden h-full w-full bg-black sm:block">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <h1 className="font-bold">
              Welcome to <span className="text-purple">Archivr</span>
            </h1>
            <p>The best place to discover movies and TV shows</p>
          </div>
          <div className="flex flex-row space-x-4">
            <Link
              to="/" // Link to the home page
              className="rounded-full bg-purple px-6 py-2 transition-colors hover:bg-purple/75"
            >
              Back to Home
            </Link>
            <Link
              to="/random" // Link to the random media page
              className="box-border flex items-center justify-center rounded-full border border-white bg-transparent px-6 py-1 transition-colors hover:bg-white hover:text-black"
            >
              Random Media
            </Link>
          </div>
        </div>
      </section>
      <section className="flex h-full w-full flex-col items-center justify-center gap-4 bg-login-bg bg-cover bg-left bg-no-repeat px-8 py-4 sm:w-fit sm:border-l-2 sm:border-gray sm:px-32 sm:py-8">
        <motion.div
          className="w-max max-w-sm overflow-hidden rounded-lg bg-black p-0"
          layout
          transition={{ duration: 0.1 }}
        >
          {isForgotPassword ? (
            <>
              {isResetEmailSent ? (
                <motion.div
                  layout
                  className="flex flex-col items-start space-y-4 p-5"
                >
                  <motion.div
                    layout
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="flex items-center justify-center text-8xl">
                      <NotificationsActiveRounded fontSize="inherit" />
                    </div>
                    <h2>Check Your Email</h2>
                    <p>
                      We've sent a password reset link to your email. Follow the
                      instructions in the email to reset your password.
                    </p>
                  </motion.div>
                  <motion.div layout className="flex w-full flex-col space-y-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetEmailSent(false);
                        setIsForgotPassword(false);
                      }}
                      className="flex w-fit items-center justify-center self-center rounded-full bg-purple px-6 py-2 transition-colors hover:bg-purple/75"
                    >
                      Return to Sign In
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="flex flex-col items-start space-y-4 p-5"
                >
                  <motion.div
                    layout
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="flex items-center justify-center text-8xl">
                      <LockResetRounded fontSize="inherit" />
                    </div>
                    <h2>Forgot Password?</h2>
                    <p>
                      Enter your email address, and we'll send you instructions
                      to reset your password.
                    </p>
                  </motion.div>
                  <motion.form
                    layout
                    transition={{ duration: 0.1 }}
                    className="align-center flex w-full flex-col space-y-4"
                  >
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
                    <button
                      type="submit"
                      className="flex w-fit items-center justify-center self-center rounded-full bg-purple px-6 py-2 transition-colors hover:bg-purple/75"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!email) {
                          toast.error("Please enter your email");
                          return;
                        }

                        try {
                          await requestPasswordReset(email);
                          toast.success("Password reset email sent!");
                          setIsResetEmailSent(true);
                        } catch (error) {
                          console.error(error);
                          toast.error("Failed to send password reset email");
                        }
                      }}
                    >
                      Send Reset Instructions
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-center underline"
                    >
                      Back to Sign In
                    </button>
                  </motion.form>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <div className="flex w-full flex-row">
                <button
                  className={`${
                    isOnLogin ? "bg-purple" : "bg-black"
                  } m-0 h-10 w-1/2 rounded-none transition-colors hover:bg-purple`}
                  onClick={() => setIsOnLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className={`${
                    isOnLogin ? "bg-black" : "bg-purple"
                  } m-0 h-10 w-1/2 rounded-none transition-colors hover:bg-purple`}
                  onClick={() => setIsOnLogin(false)}
                >
                  Sign Up
                </button>
              </div>
              <motion.form
                layout
                transition={{ duration: 0.1 }}
                onSubmit={isOnLogin ? handleLogInSubmit : handleSignUpSubmit}
                className="flex flex-col space-y-4 px-6 py-6"
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
                  Discover trending movies, top-rated shows, and personalized
                  picks chosen just for you.
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
                      className="flex w-fit items-center justify-center self-center rounded-full bg-purple px-6 py-2 transition-colors hover:bg-purple/75"
                    >
                      Continue to Archivr
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-center underline"
                    >
                      Forgot your password?
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="flex w-fit items-center justify-center self-center rounded-full bg-purple px-6 py-2 transition-colors hover:bg-purple/75"
                    >
                      Start on Archivr
                    </button>
                    <p className="text-center">
                      Free to join. By clicking Sign Up, you agree to our{" "}
                      <Link to="/tos" className="underline">
                        Terms of Service
                      </Link>
                    </p>
                  </>
                )}
              </motion.form>
            </>
          )}
        </motion.div>
        <Link to="/" className="block text-white underline sm:hidden">
          Go back to the home page
        </Link>
      </section>
    </main>
  );
}
