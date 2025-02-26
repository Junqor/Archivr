import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/email";
import { LockResetRounded } from "@mui/icons-material";
import { motion } from "framer-motion";

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [token, setToken] = useState("");

  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } else {
      toast.error("Invalid or missing reset token.");
      navigate("/login"); // Redirect if no valid token
    }
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

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-4 overflow-y-auto bg-login-bg bg-cover bg-left bg-no-repeat px-8 py-4 font-normal">
      <link rel="preload" as="image" href="/assets/login-bg.png"></link>
      <motion.div
        className="w-max max-w-md overflow-hidden rounded-lg bg-black p-0"
        layout
        transition={{ duration: 0.1 }}
      >
        <motion.div layout className="flex flex-col items-start space-y-4 p-5">
          <motion.div layout className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center text-8xl">
              <LockResetRounded fontSize="inherit" />
            </div>
            <h2>
              Reset <span className="text-purple">Archivr</span> Password
            </h2>
            <p>Enter a new password for your account</p>
          </motion.div>
          <motion.form
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
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
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
          </motion.form>
        </motion.div>
      </motion.div>
    </main>
  );
}
