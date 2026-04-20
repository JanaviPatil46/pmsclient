// import * as React from "react";
// import { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import { Select } from "@mui/material";
// import Button from "@mui/material/Button";
// import CssBaseline from "@mui/material/CssBaseline";
// import Divider from "@mui/material/Divider";
// import FormLabel from "@mui/material/FormLabel";
// import FormControl from "@mui/material/FormControl";
// import Link from "@mui/material/Link";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import MuiCard from "@mui/material/Card";
// import { styled } from "@mui/material/styles";
// import { toast } from "material-react-toastify";
// import {
//   InputAdornment,
//   IconButton,
//   Fade,
//   Menu,
//   MenuItem,
// } from "@mui/material";

// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import AppTheme from "../shared-theme/AppTheme";
// import ColorModeSelect from "../shared-theme/ColorModeSelect";

// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { Link as RouterLink } from "react-router-dom";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// const Card = styled(MuiCard)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignSelf: "center",
//   width: "100%",
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   margin: "auto",
//   [theme.breakpoints.up("sm")]: {
//     maxWidth: "450px",
//   },
//   boxShadow:
//     "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
//   ...theme.applyStyles("dark", {
//     boxShadow:
//       "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
//   }),
// }));

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
//   minHeight: "100%",
//   padding: theme.spacing(2),
//   [theme.breakpoints.up("sm")]: {
//     padding: theme.spacing(4),
//   },
//   "&::before": {
//     content: '""',
//     display: "block",
//     position: "absolute",
//     zIndex: -1,
//     inset: 0,
//     backgroundImage:
//       "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
//     backgroundRepeat: "no-repeat",
//     ...theme.applyStyles("dark", {
//       backgroundImage:
//         "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
//     }),
//   },
// }));

// // =====================================
// // AUTO LOGOUT FUNCTION
// // =====================================
// // =====================================
// // AUTO LOGOUT USING JWT EXPIRY (4 MIN)
// // =====================================
// const setupAutoLogout = (token, logoutFunc) => {
//   try {
//     const decoded = jwtDecode(token);
//     const expiresAt = decoded.exp * 1000; // convert to ms
//     const now = Date.now();

//     if (expiresAt <= now) {
//       logoutFunc();
//       return;
//     }

//     const remaining = expiresAt - now;

//     // Auto-logout timer
//     setTimeout(() => {
//       logoutFunc();
//     }, remaining);
//   } catch (err) {
//     logoutFunc();
//   }
// };

// const logoutUser = (navigate) => {
//   sessionStorage.clear();
//   toast.info("Session expired. Please login again.");
//   navigate("/client/login");
// };

// // axios global logout on 401
// axios.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       sessionStorage.clear();
//       window.location.href = "/client/login"; // force redirect
//     }
//     return Promise.reject(err);
//   }
// );

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [emailError, setEmailError] = useState(false);
//   const [emailErrorMsg, setEmailErrorMsg] = useState("");
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

//   const navigate = useNavigate();

//   // 🚀 Auto logout check when page loads / refreshes
//   useEffect(() => {
//     const token = sessionStorage.getItem("jwtToken");
//     if (token) {
//       setupAutoLogout(token, () => logoutUser(navigate));
//     }
//   }, [navigate]);
//   const validateInputs = () => {
//     let valid = true;

//     if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
//       setEmailError(true);
//       setEmailErrorMsg("Enter valid email");
//       valid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMsg("");
//     }

//     if (!password || password.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMsg("Password must be at least 6 characters");
//       valid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMsg("");
//     }

//     return valid;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!validateInputs()) return;

//     try {
//       const response = await axios.post(
//         "https://www.snptaxes.com/api/auth/login",
//         { email, password }
//       );

//       const { token, accounts } = response.data;

//       // Store token and email
//       sessionStorage.setItem("jwtToken", token);
//       sessionStorage.setItem("email", email);
//       sessionStorage.setItem("accounts", JSON.stringify(accounts));
//       setupAutoLogout(token, () => logoutUser(navigate));
//       if (accounts.length > 1) {
//         // Multiple accounts found → show selection popup
//         setAccounts(accounts);
//       } else if (accounts.length === 1) {
//         // Single account → redirect to dashboard
//         sessionStorage.setItem("accountId", accounts[0]._id);
//         toast.success("Login Successful");
//         navigate("/client/client/home");
//       } else {
//         toast.info("No accounts available for this email.");
//       }
//     } catch (err) {
//         toast.error(err.response?.data?.message || "Invalid email or password");
//     }
//   };

//   const handleAccountSelect = () => {
//     if (!selectedAccount) return;
//     sessionStorage.setItem("accountId", selectedAccount);
//     navigate("/client/client/home");
//   };

//   // ✅ Multiple accounts UI (styled)
//   if (accounts.length > 1) {
//     return (
//       <AppTheme>
//         <CssBaseline />
//         <SignInContainer direction="column" justifyContent="center">
//           <Card variant="outlined">
//             <Typography variant="h5">Select an Account</Typography>
//             <FormControl fullWidth>
//               <FormLabel>Select Account</FormLabel>
//               <Select
//                 value={selectedAccount}
//                 onChange={(e) => setSelectedAccount(e.target.value)}
//                 displayEmpty
//               >
//                 <MenuItem value="">-- Select --</MenuItem>
//                 {accounts.map((acc) => (
//                   <MenuItem key={acc._id} value={acc._id}>
//                     {acc.accountName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Button variant="contained" onClick={handleAccountSelect}>
//               Continue
//             </Button>
//           </Card>
//         </SignInContainer>
//       </AppTheme>
//     );
//   }

//   // ✅ Login Form UI
//   return (
//     <AppTheme>
//       <CssBaseline />
//       <SignInContainer direction="column" justifyContent="center">
//         <ColorModeSelect
//           sx={{ position: "fixed", top: "1rem", right: "1rem" }}
//         />

//         <Card variant="outlined">
//           <Typography variant="h4">Login</Typography>

//           <Box
//             component="form"
//             onSubmit={handleLogin}
//             sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//           >
//             <FormControl>
//               <FormLabel>Email</FormLabel>
//               <TextField
//                 fullWidth
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 error={emailError}
//                 helperText={emailErrorMsg}
//               />
//             </FormControl>

//             <FormControl>
//               <FormLabel>Password</FormLabel>
//               <TextField
//                 fullWidth
//                 required
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={passwordError}
//                 helperText={passwordErrorMsg}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Fade in={password.length > 0}>
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </Fade>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </FormControl>

//             <Button type="submit" variant="contained" fullWidth>
//               Login
//             </Button>

//             <Link
//               component={RouterLink}
//               to="/client/forgot-password"
//               variant="body2"
//               sx={{ alignSelf: "center" }}
//             >
//               Forgot your password?
//             </Link>
//           </Box>

//           <Divider>or</Divider>

//           <Typography textAlign="center">
//             Don’t have an account?{" "}
//             <Link component={RouterLink} to="/signup">
//               Sign Up
//             </Link>
//           </Typography>
//         </Card>
//       </SignInContainer>
//     </AppTheme>
//   );
// };

// export default LoginPage;

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "material-react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


const setupAutoLogout = (token, logoutFunc) => {
  try {
    const decoded = jwtDecode(token);
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();

    if (expiresAt <= now) {
      logoutFunc();
      return;
    }

    const remaining = expiresAt - now;

    setTimeout(() => {
      logoutFunc();
    }, remaining);
  } catch (err) {
    logoutFunc();
  }
};

const logoutUser = (navigate) => {
  sessionStorage.clear();
  toast.info("Session expired. Please login again.");
  navigate("/client/login");
};

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

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      setupAutoLogout(token, () => logoutUser(navigate));
    }
  }, [navigate]);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ACCOUNTS_URL}/api/auth/login`,
        { email, password }
      );
      const { token, accounts } = response.data;

      // Save token in sessionStorage
      sessionStorage.setItem("jwtToken", token);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("accounts", JSON.stringify(accounts));
      setupAutoLogout(token, () => logoutUser(navigate));
      
      if (accounts.length > 1) {
        // If multiple accounts, prompt user to select
        setAccounts(accounts);
      } else if (accounts.length === 1) {
        // Single account, redirect to dashboard
        sessionStorage.setItem("accountId", accounts[0]._id);
        toast.success("Login Successful");
        navigate("/client/client/home");
      } else {
        toast.info("No accounts available for this email.");
      }
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAccountSelect = () => {
    if (!selectedAccount) {
      toast.error("Please select an account");
      return;
    }
    sessionStorage.setItem("accountId", selectedAccount);
    toast.success("Login Successful");
    navigate("/client/client/home");
  };

  // Multiple accounts UI
  if (accounts.length > 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm flex flex-col gap-4 rounded-xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Select an Account</h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Select Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">-- Select --</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>{acc.accountName}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAccountSelect}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Login Form UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm flex flex-col gap-5 rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                emailError ? "border-destructive" : "border-border"
              }`}
            />
            {emailError && <p className="text-xs text-destructive">{emailErrorMsg}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  passwordError ? "border-destructive" : "border-border"
                }`}
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
            {passwordError && <p className="text-xs text-destructive">{passwordErrorMsg}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Login
          </button>

          <RouterLink
            to="/client/forgot-password"
            className="self-center text-sm text-primary hover:underline"
          >
            Forgot your password?
          </RouterLink>
        </form>

        <div className="flex items-center gap-2">
          <hr className="flex-1 border-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <hr className="flex-1 border-border" />
        </div>

        <p className="text-center text-sm text-foreground">
          Don't have an account?{" "}
          <RouterLink to="/signup" className="text-primary hover:underline font-medium">
            Sign Up
          </RouterLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;