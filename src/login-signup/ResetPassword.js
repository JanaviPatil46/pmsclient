

import React, { useState,useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  Container,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { useParams } from 'react-router-dom';

import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toast } from "material-react-toastify";
import Cookies from "js-cookie";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
}));

const ResetPasswordContainer = styled(Stack)(({ theme }) => ({
  height: "100dvh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

function ResetPassword() {
  const { id, token } = useParams(); 
  const SERVER_PORT = process.env.REACT_APP_SERVER_URI;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const navigate = useNavigate();
console.log("id",id)
  // Store token in localStorage when component mounts
  useEffect(() => {
    if (token && id) {
      localStorage.setItem("resetpasstoken", token);
      console.log("Token extracted from URL:", token);
    } else {
      // Check for existing token in case of page refresh
      const storedToken = localStorage.getItem("resetpasstoken");
      if (!storedToken) {
        toast.error("Invalid reset link. Please request a new password reset.");
        navigate("/client/login");
      }
    }
  }, [token, id, navigate]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleConfirmPasswordPaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    setConfirmPassword(pastedText);
  };

  const getUser = (id) => {
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((user) => {
        const email = user.email;
        const requestBody = JSON.stringify({ email });
        return fetch(`${LOGIN_API}/passwordupdate/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });
      })
      .then((res) => res.text())
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  };




const updatePassword = (id, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("id", id);
    myHeaders.append("Authorization", token);

    console.log(token);
    const raw = JSON.stringify({
      password: confirmPassword,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const baseUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;

    const url = new URL(baseUrl);

    url.searchParams.append("id", id);
    url.searchParams.append("token", token);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);

        getUser(id);
        Cookies.remove("resetpasstoken");
        localStorage.removeItem("resetpasstoken");
        toast.success("Password Updated successfully.");
navigate("/client/login")
        // Handle success, if needed
      })
      .catch((error) => {
        console.error("Error updating password:", error.message);
        // Handle error, if needed
      });
  };
  const validateTokenAndUpdate = async () => {
    const token = localStorage.getItem("resetpasstoken");
    console.log("resetpasstoken",token)
    const res = await fetch(`${LOGIN_API}/common/resetpassword/verifytoken/`, {
      method: "GET",
      
       headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await res.json();
    if (data.message === "Access granted") {
      const userId = data.user.id;
      updatePassword(userId, token);
    } else {
      toast.error("Token expired or invalid. Please try again.");
    }
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    validateTokenAndUpdate();
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ResetPasswordContainer direction="column" justifyContent="center">
        <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

        <Card variant="outlined">
          <Typography variant="h4" component="h1">
            Set New Passwordss
          </Typography>

          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="password">Password</FormLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              fullWidth
              sx={{ borderRadius: "10px", mt: 1 }}
              endAdornment={
                <InputAdornment position="end" onClick={handleTogglePasswordVisibility} sx={{ cursor: "pointer" }}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onPaste={handleConfirmPasswordPaste}
              fullWidth
              sx={{ borderRadius: "10px", mt: 1 }}
              endAdornment={
                <InputAdornment position="end" onClick={handleTogglePasswordVisibility} sx={{ cursor: "pointer" }}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              }
            />
          </FormControl>

          <Box mt={3}>
            <Button fullWidth variant="contained" onClick={handleSubmit}>
              Continue
            </Button>
          </Box>
        </Card>
      </ResetPasswordContainer>
    </AppTheme>
  );
}

export default ResetPassword;
