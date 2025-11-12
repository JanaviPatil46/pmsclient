

import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import {Select} from "@mui/material";
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

import axios from "axios";
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


// export default function SignIn(props) {
//   const navigate = useNavigate();

//   const [emailError, setEmailError] = React.useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
//   const [passwordError, setPasswordError] = React.useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  
//   const [inpval, setInpval] = useState({
//     email: "",
//     password: "",
//     showPassword: false,
//     passwordError: false,
//     passwordErrorMessage: "",
//   });

//   const handleChange = (prop) => (event) => {
//     setInpval({ ...inpval, [prop]: event.target.value });
//   };

//   const handleClickShowPassword = () => {
//     setInpval({
//       ...inpval,
//       showPassword: !inpval.showPassword,
//     });
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const setVal = (e) => {
//     const { name, value } = e.target;
//     setInpval(() => {
//       return {
//         ...inpval,
//         [name]: value,
//       };
//     });
//   };

//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

//   const validateInputs = () => {
//     const email = document.getElementById("email");
//     const password = document.getElementById("password");

//     let isValid = true;

//     if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
//       setEmailError(true);
//       setEmailErrorMessage("Please enter a valid email address.");
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage("");
//     }

//     if (!password.value || password.value.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMessage("Password must be at least 6 characters long.");
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage("");
//     }

//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { email, password } = inpval;
//     const expiryTime = 8 * 60 * 60;

//     // Input validation
//     if (!email) {
//       toast.error("Email is required!");
//       return;
//     } else if (!email.includes("@")) {
//       toast.error("Invalid email format!");
//       return;
//     }

//     if (!password) {
//       toast.error("Password is required!");
//       return;
//     } else if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long!");
//       return;
//     }

//     try {
//       const loginUrl = `${LOGIN_API}/common/clientlogin/generatetokenforclient`;
//       const loginPayload = { 
//         email, 
//         password, 
//         expiryTime
//       };

//       const loginResponse = await fetch(loginUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(loginPayload),
//       });

//       console.log("Response status:", loginResponse.status);
      
//       const loginResult = await loginResponse.json();
//       console.log("Full response:", loginResult);

//       if (loginResult.status === 200) {
//         console.log("Login successful, token received");
//         sessionStorage.setItem("clientdatatoken", loginResult.result.token);
//         Cookies.set("clientuserToken", loginResult.result.token);

//          // Store only the email for potential user selection in dashboard
//         sessionStorage.setItem("pendingUserEmail", email);
//         navigate("/client/client/home");
//         toast.success("Login Successful");
//         setInpval({ ...inpval, email: "", password: "" });
//       } else {
//         console.error("Login failed with message:", loginResult.message);
//         toast.error(loginResult.message || "Login failed");
//       }
//     } catch (error) {
//       console.group("Login Error");
//       console.error("Error object:", error);
//       console.error("Error message:", error.message);
//       console.error("Stack trace:", error.stack);
//       console.groupEnd();
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <AppTheme {...props}>
//       <CssBaseline enableColorScheme />
//       <SignInContainer direction="column" justifyContent="space-between">
//         <ColorModeSelect
//           sx={{ position: "fixed", top: "1rem", right: "1rem" }}
//         />
//         <Card variant="outlined">
//           <Typography
//             component="h1"
//             variant="h4"
//             sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
//           >
//             Sign in
//           </Typography>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             noValidate
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               width: "100%",
//               gap: 2,
//             }}
//           >
//             <FormControl>
//               <FormLabel htmlFor="email">Email</FormLabel>
//               <TextField
//                 error={emailError}
//                 helperText={emailErrorMessage}
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="your@email.com"
//                 autoComplete="email"
//                 autoFocus
//                 required
//                 fullWidth
//                 variant="outlined"
//                 color={emailError ? "error" : "primary"}
//                 value={inpval.email}
//                 onChange={setVal}
//               />
//             </FormControl>

//             <FormControl>
//               <FormLabel htmlFor="password">Password</FormLabel>
//               <TextField
//                 value={inpval.password}
//                 onChange={handleChange("password")}
//                 error={inpval.passwordError}
//                 helperText={inpval.passwordErrorMessage}
//                 name="password"
//                 placeholder="••••••"
//                 type={inpval.showPassword ? "text" : "password"}
//                 id="password"
//                 autoComplete="current-password"
//                 required
//                 fullWidth
//                 variant="outlined"
//                 color={inpval.passwordError ? "error" : "primary"}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Fade in={inpval.password.length > 0}>
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                         >
//                           {inpval.showPassword ? (
//                             <VisibilityOff />
//                           ) : (
//                             <Visibility />
//                           )}
//                         </IconButton>
//                       </Fade>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </FormControl>

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               onClick={validateInputs}
//             >
//               Sign in
//             </Button>
//             <Link
//              component={RouterLink}
//               to="/client/forgotpass"
//               variant="body2"
//               sx={{ alignSelf: "center" }}
//             >
//               Forgot your password?
//             </Link>
//           </Box>
//           <Divider>or</Divider>
//           <Typography sx={{ textAlign: "center" }}>
//             Don&apos;t have an account?{" "}
//             <Link
//               component={RouterLink}
//               to="/client/signup"
//               variant="body2"
//               sx={{ alignSelf: "center" }}
//             >
//               Sign up
//             </Link>
//           </Typography>
//         </Card>
//       </SignInContainer>
//     </AppTheme>
//   );
// }
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const navigate = useNavigate();

  const validateInputs = () => {
    let valid = true;

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMsg("Enter valid email");
      valid = false;
    } else {
      setEmailError(false);
      setEmailErrorMsg("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMsg("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMsg("");
    }

    return valid;
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   if (!validateInputs()) return;

  //   try {
  //     const response = await axios.post(
  //       "https://www.snptaxes.com/api/auth/login",
  //       { email, password }
  //     );

  //     const { token, accounts } = response.data;

  //     localStorage.setItem("jwtToken", token);
  //     localStorage.setItem("email", email);
  //     localStorage.setItem("accounts", JSON.stringify(accounts));

  //     if (accounts.length > 1) {
  //       setAccounts(accounts);
  //     } else if (accounts.length === 1) {
  //       localStorage.setItem("accountId", accounts[0]._id);
  //         toast.success("Login Successful");
  //       navigate("/client/client/home");
  //     } else {
  //       alert("No accounts available for this email.");
  //     }
  //   } catch (err) {
  //       // toast.error("Login failed: " + err.response?.data?.message || err.message);
  //     alert("Login failed: " + err.response?.data?.message || err.message);
  //   }
  // };
const handleLogin = async (e) => {
  e.preventDefault();

  if (!validateInputs()) return;

  try {
    const response = await axios.post(
      "https://www.snptaxes.com/api/auth/login",
      { email, password }
    );

    const { token, accounts } = response.data;

    // Store token and email
    sessionStorage.setItem("jwtToken", token);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("accounts", JSON.stringify(accounts));

    if (accounts.length > 1) {
      // Multiple accounts found → show selection popup
      setAccounts(accounts);
    } else if (accounts.length === 1) {
      // Single account → redirect to dashboard
      sessionStorage.setItem("accountId", accounts[0]._id);
      toast.success("Login Successful");
      navigate("/client/client/home");
    } else {
      alert("No accounts available for this email.");
    }
  } catch (err) {
    alert("Login failed: " + (err.response?.data?.message || err.message));
  }
};

  const handleAccountSelect = () => {
    if (!selectedAccount) return;
    sessionStorage.setItem("accountId", selectedAccount);
     navigate("/client/client/home");
  };

  // ✅ Multiple accounts UI (styled)
  if (accounts.length > 1) {
    return (
      <AppTheme>
        <CssBaseline />
        <SignInContainer direction="column" justifyContent="center">
          <Card variant="outlined">
            <Typography variant="h5">Select an Account</Typography>
            <FormControl fullWidth>
              <FormLabel>Select Account</FormLabel>
              <Select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">-- Select --</MenuItem>
                {accounts.map((acc) => (
                  <MenuItem key={acc._id} value={acc._id}>
                    {acc.accountName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" onClick={handleAccountSelect}>
              Continue
            </Button>
          </Card>
        </SignInContainer>
      </AppTheme>
    );
  }

  // ✅ Login Form UI
  return (
    <AppTheme>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="center">
        <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

        <Card variant="outlined">
          <Typography variant="h4">Login</Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailErrorMsg}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordErrorMsg}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Fade in={password.length > 0}>
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Fade>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>

            <Link
              component={RouterLink}
              to="/client/forgot-password"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>

          <Divider>or</Divider>

          <Typography textAlign="center">
            Don’t have an account?{" "}
            <Link component={RouterLink} to="/signup">
              Sign Up
            </Link>
          </Typography>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
};

export default LoginPage;








