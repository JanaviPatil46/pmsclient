

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   CssBaseline,
//   FormControl,
//   FormLabel,
//   TextField,
//   Typography,
//   Container,
//   Stack,
//   Card as MuiCard,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { toast } from "material-react-toastify";
// import { NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";
// import logo from "../Images/snplogo-removebg-preview.png";
// import AppTheme from "../shared-theme/AppTheme";
// import ColorModeSelect from "../shared-theme/ColorModeSelect";

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

// const ForgotPasswordContainer = styled(Stack)(({ theme }) => ({
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

// export default function ForgotPassword() {
//   const SEVER_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = useState("");

//   const handleChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const getResetLink = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!email) {
//       setEmailError(true);
//       setEmailErrorMessage("Email is required");
//       return;
//     } else if (!email.includes("@")) {
//       setEmailError(true);
//       setEmailErrorMessage("Email must include @");
//       return;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage("");
//     }

//     try {
//       const clientResetURL = `${SEVER_PORT}/client/client/resetpassword`;
//       const apiURL = `${LOGIN_API}/resetpass/forgotpassword/`;

//       const response = await fetch(apiURL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           url: clientResetURL,
//         }),
//       });

//       const res = await response.json();

//       if (response.status === 200) {
//         localStorage.setItem("resetpasstoken", res.result.token);
//         Cookies.set("resetpasstoken", res.result.token);
//         toast.success("Check your email for the reset link.");
       
//       } else if (response.status === 400) {
//         toast.error("Invalid user!");
//       } else {
//         toast.error("An error occurred. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Network error. Please try again.");
//     }
//   };

//   return (
//     <AppTheme>
//       <CssBaseline enableColorScheme />
//       <ForgotPasswordContainer direction="column" justifyContent="center">
//         <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

//         {/* Logo & Title */}
//         {/* <Box sx={{ position: "absolute", top: "1rem", left: "1rem" }}>
//           <Box display="flex" alignItems="center">
//             <img
//               src={logo}
//               alt="logo"
//               style={{ height: "40px", marginRight: "10px" }}
//             />
//             <Typography variant="h6">PMS Solutions</Typography>
//           </Box>
//         </Box> */}

//         {/* Card */}
//         <Card variant="outlined">
//           <Typography variant="h4" component="h1">
//             Reset your password
//           </Typography>
//           <Typography variant="body1">
//             To reset your password, enter the email address you use to sign in
//           </Typography>

//           {/* Form */}
//           <Box component="form" onSubmit={getResetLink}>
//             <FormControl fullWidth margin="normal">
//               <FormLabel htmlFor="email">Email Address</FormLabel>
//               <TextField
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={handleChange}
//                 error={emailError}
//                 helperText={emailErrorMessage}
//                 autoComplete="email"
//                 fullWidth
//               />
//             </FormControl>

//             <Box display="flex" gap={2} mt={2}>
//               <Button type="submit" variant="contained" color="primary" fullWidth>
//                 Get Reset Link
//               </Button>
//               <NavLink to="/client/login" style={{ textDecoration: "none", width: "100%" }}>
//                 <Button variant="outlined" fullWidth>
//                   Back to Login
//                 </Button>
//               </NavLink>
//             </Box>
//           </Box>
//         </Card>
//       </ForgotPasswordContainer>
//     </AppTheme>
//   );
// }

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import logo from '../Images/snplogo-removebg-preview.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        'https://www.snptaxes.com/api/auth/forgot-password',
        { email: email }
      );
      setSuccess('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Top bar with logo */}
      <header className="flex items-center px-6 py-4 border-b border-border shrink-0">
        <img src={logo} alt="SNP Tax & Financials" className="h-8 w-auto" />
      </header>

      {/* Centered card */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm flex flex-col gap-6">

          {/* Icon + heading */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail size={22} className="text-primary" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Reset your password</h1>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Enter your email and we'll send you reset instructions.
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">

            {/* Error alert */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3">
                <AlertCircle size={15} className="text-destructive shrink-0 mt-0.5" />
                <p className="text-[13px] text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Success alert */}
            {success && (
              <div className="flex items-start gap-2.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3.5 py-3">
                <CheckCircle size={15} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <p className="text-[13px] text-green-700 dark:text-green-400 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[13px] font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          </div>

          {/* Back to login */}
          <Link
            to="/client/login"
            className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;