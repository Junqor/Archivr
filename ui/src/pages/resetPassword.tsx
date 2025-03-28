import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword, verifyResetToken } from "@/api/email";
import { LockResetRounded } from "@mui/icons-material";
import { LazyMotion } from "motion/react";
import * as m from "motion/react-m";

const loadFeatures = () =>
  import("../lib/motion.js").then((res) => res.default); // Dynamic import for code splitting since we only use it on this page

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");

    if (!tokenFromURL) {
      toast.error("Invalid or missing reset token.");
      navigate("/login"); // Redirect if no token
      return;
    }

    setToken(tokenFromURL);

    // Verify the reset token
    verifyResetToken(tokenFromURL)
      .then(() => {
        setIsTokenValid(true);
      })
      .catch(() => {
        toast.error("Invalid or expired token.");
        navigate("/login"); // Redirect if token is invalid
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [location, navigate]);

  // Fixing mutation to accept an object with token and password
  const { mutate: submitReset, isPending } = useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to reset password.");
    },
  });

  // Handle form submission
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!token) {
      toast.error("Missing reset token. Please request a new reset link.");
      return;
    }

    // Submit password reset request with correct argument format
    submitReset({ token, newPassword });
  }

  if (isVerifying) {
    return (
      <main className="flex h-screen w-screen items-center justify-center">
        <p>Verifying reset token...</p>
      </main>
    );
  }

  if (!isTokenValid) {
    return (
      <main className="flex h-screen w-screen items-center justify-center">
        <p>Invalid or expired reset token.</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-4 overflow-y-auto bg-login-bg bg-cover bg-left bg-no-repeat px-8 py-4 font-normal">
      <link rel="preload" as="image" href="/assets/login-bg.png"></link>
      <LazyMotion strict features={loadFeatures}>
        <m.div
          className="w-max max-w-md overflow-hidden rounded-lg bg-black p-0"
          layout
          transition={{ duration: 0.1 }}
        >
          <m.div layout className="flex flex-col items-start space-y-4 p-5">
            <m.div layout className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center text-8xl">
                <LockResetRounded fontSize="inherit" />
              </div>
              <h2>
                Reset <span className="text-purple">Archivr</span> Password
              </h2>
              <p>Enter a new password for your account</p>
            </m.div>
            <m.form
              layout
              transition={{ duration: 0.1 }}
              className="align-center flex w-full flex-col space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="flex w-fit items-center justify-center self-center rounded-full bg-purple px-6 py-2 transition-colors hover:bg-purple/75"
                disabled={isPending}
              >
                {isPending ? "Resetting..." : "Reset Password"}
              </button>
            </m.form>
          </m.div>
        </m.div>
      </LazyMotion>
    </main>
  );
}
