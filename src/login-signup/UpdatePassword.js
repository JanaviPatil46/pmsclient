

import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "material-react-toastify";
import Cookies from "js-cookie";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "450px",
    },
    boxShadow:
      "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    ...theme.applyStyles("dark", {
      boxShadow:
        "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
  }));
  
  const SignInContainer = styled(Stack)(({ theme }) => ({
    height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
    minHeight: "100%",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(4),
    },
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      zIndex: -1,
      inset: 0,
      backgroundImage:
        "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
      backgroundRepeat: "no-repeat",
      ...theme.applyStyles("dark", {
        backgroundImage:
          "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
      }),
    },
  }));

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
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center">
        <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
        <Card variant="outlined">
          <Typography variant="h4" component="h1">
            Reset Password
          </Typography>

          {/* Password */}
          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordErrorMessage}
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Fade in={password.length > 0}>
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Fade>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* Confirm Password */}
          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <TextField
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onPaste={(e) =>
                setConfirmPassword(e.clipboardData.getData("text"))
              }
              error={confirmPasswordError}
              helperText={confirmPasswordErrorMessage}
              placeholder="••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Fade in={confirmPassword.length > 0}>
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Fade>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
