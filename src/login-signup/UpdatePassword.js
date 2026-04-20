import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "material-react-toastify";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePassword() {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const { _id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async () => {
    let hasError = false;

    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters");
      hasError = true;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match");
      hasError = true;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    if (hasError) return;

    try {
      const url = `${LOGIN_API}/common/resetpassword/verifytoken/`;

      const verifyResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.message === "Access granted") {
        const id = verifyData.user.id;

        const updateUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;
        const fullUrl = `${updateUrl}?id=${id}&token=${token}`;

        const res = await fetch(fullUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            id: id,
            Authorization: token,
          },
          body: JSON.stringify({ password: confirmPassword }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        Cookies.remove("resetpasstoken");
        localStorage.removeItem("resetpasstoken");

        toast.success("Password updated successfully!");
        navigate("/client/login");
      } else {
        toast.error("Token expired or invalid!");
        navigate("/client/resetpassword");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm flex flex-col gap-5 rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Reset Password</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                passwordError ? "border-destructive" : "border-border"
              }`}
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={handleTogglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {passwordError && <p className="text-xs text-destructive">{passwordErrorMessage}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">Confirm Password</label>
          <div className="relative">
            <input
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onPaste={(e) => setConfirmPassword(e.clipboardData.getData("text"))}
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                confirmPasswordError ? "border-destructive" : "border-border"
              }`}
            />
            {confirmPassword.length > 0 && (
              <button
                type="button"
                onClick={handleTogglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {confirmPasswordError && <p className="text-xs text-destructive">{confirmPasswordErrorMessage}</p>}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors mt-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
