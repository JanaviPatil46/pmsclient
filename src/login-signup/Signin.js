

import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { toast } from "material-react-toastify";
import { InputAdornment, IconButton, Fade, Menu, MenuItem } from "@mui/material";

import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

export default function SignIn(props) {
  const navigate = useNavigate();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userList, setUserList] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const [inpval, setInpval] = useState({
    email: "",
    password: "",
    showPassword: false,
    passwordError: false,
    passwordErrorMessage: "",
  });

  const handleChange = (prop) => (event) => {
    setInpval({ ...inpval, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setInpval({
      ...inpval,
      showPassword: !inpval.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    handleUserMenuClose();
    // You could automatically submit the form here if you want
    // Or just let the user enter the password and then submit
  };

  const checkEmailForUsers = async (email) => {
    if (!email || !email.includes("@")) return;

    try {
      const checkUserUrl = `${LOGIN_API}/common/user/email/getuserbyemail/${email}`;
      const checkUserResponse = await fetch(checkUserUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = await checkUserResponse.json();
      
      if (userData.user && userData.user.length > 1) {
        setUserList(userData.user);
        return true; // multiple users
      } else if (userData.user && userData.user.length === 1) {
        setSelectedUser(userData.user[0]);
        return false; // single user
      } else {
        toast.error("User not found");
        return false;
      }
    } catch (error) {
      console.error("Error checking users:", error);
      return false;
    }
  };

  const handleEmailBlur = async () => {
    if (!inpval.email || !inpval.email.includes("@")) return;
    
    const hasMultipleUsers = await checkEmailForUsers(inpval.email);
    if (hasMultipleUsers) {
      // We'll show the dropdown when the user focuses on the password field
    }
  };

  const handlePasswordFocus = () => {
    if (userList.length > 1 && !selectedUser) {
      // Show the user selection dropdown
      const emailField = document.getElementById("email");
      if (emailField) {
        setAnchorEl(emailField);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = inpval;
    const expiryTime = 8 * 60 * 60;

    // Input validation
    if (!email) {
      toast.error("Email is required!");
      return;
    } else if (!email.includes("@")) {
      toast.error("Invalid email format!");
      return;
    }

    if (!password) {
      toast.error("Password is required!");
      return;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (userList.length > 1 && !selectedUser) {
      toast.error("Please select a user from the dropdown");
      return;
    }

    try {
      const loginUrl = `${LOGIN_API}/common/clientlogin/generatetokenforclient`;
      const loginPayload = selectedUser 
        ? { 
            email, 
            password, 
            expiryTime, 
            username:selectedUser.username
          }
        : { 
            email, 
            password, 
            expiryTime,
            // Adding debug note
            note: "No user selected (single user account)"
          };

      // Enhanced console logging
      console.group("Login Payload Details");
console.log("Stringified payload:", JSON.stringify(loginPayload));
      console.log("Email:", email);
      console.log("Password length:", password);
      console.log("Expiry time (seconds):", expiryTime);
      if (selectedUser) {
        console.log("Selected User ID:", selectedUser._id);
        console.log("Selected User Name:", selectedUser.username);
        console.log("Selected User Role:", selectedUser.role);
      } else {
        console.log("No user selected (single user account)");
      }
      console.groupEnd();

      console.log("Sending request to:", loginUrl);
      
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      console.log("Response status:", loginResponse.status);
      
      const loginResult = await loginResponse.json();
      console.log("Full response:", loginResult);

      if (loginResult.status === 200) {
        console.log("Login successful, token received");
        localStorage.setItem("clientdatatoken", loginResult.result.token);
        Cookies.set("clientuserToken", loginResult.result.token);
        navigate("/client/home");
        toast.success("Login Successful");
        setInpval({ ...inpval, email: "", password: "" });
        setUserList([]);
        setSelectedUser(null);
      } else {
        console.error("Login failed with message:", loginResult.message);
        toast.error(loginResult.message || "Login failed");
      }
    } 
    
    
    catch (error) {
      console.group("Login Error");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
      console.groupEnd();
      toast.error("An error occurred. Please try again.");
    }
  };
  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                value={inpval.email}
                onChange={setVal}
                onBlur={handleEmailBlur}
              />
            </FormControl>

            {selectedUser && (
              <Typography variant="body2" color="text.secondary">
                Logging in as: {selectedUser.username} 
              </Typography>
            )}

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
              }}
            >
              {userList.map((user) => (
                <MenuItem 
                  key={user._id} 
                  onClick={() => handleUserSelect(user)}
                  selected={selectedUser && selectedUser._id === user._id}
                >
                  {user.username}  ({user.role})
                </MenuItem>
              ))}
            </Menu>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                value={inpval.password}
                onChange={handleChange("password")}
                error={inpval.passwordError}
                helperText={inpval.passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type={inpval.showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={inpval.passwordError ? "error" : "primary"}
                onFocus={handlePasswordFocus}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Fade in={inpval.password.length > 0}>
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {inpval.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </Fade>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            <Link
             component={RouterLink}
              to="/client/forgotpass"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link
              component={RouterLink}
              to="/client/signup"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign up
            </Link>
          </Typography>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}