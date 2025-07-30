// import React from "react";
// import logo from "../Images/snplogo-removebg-preview.png";

// import { NavLink, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "material-react-toastify";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Box, Typography, TextField, Button, Container, Paper ,Link,  } from '@mui/material';
// function ForgotPassword() {
//   const SEVER_PORT =process.env.REACT_APP_SERVER_URI
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const history = useNavigate();
//   const [inpval, setInpval] = useState({
//     email: "",
//   });

//   const setVal = (e) => {
  
//     const { name, value } = e.target;

//     setInpval(() => {
//       return {
//         ...inpval,
//         [name]: value,
//       };
//     });
//   };

//   const getresetlink = async (e) => {
//     e.preventDefault();

//     const { email } = inpval;

//     if (email === "") {
//       toast.error("email is required!", {
//         position: "top-center",
//       });
//     } else if (!email.includes("@")) {
//       toast.warning("includes @ in your email!", {
//         position: "top-center",
//       });
//     } else {
//       e.preventDefault();

//     //   const port = window.location.port;

//       const url = `${SEVER_PORT}/resetpassword`;

//       const urlnew =`${LOGIN_API}/resetpass/forgotpassword/`;
//       const data = await fetch(urlnew, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           url,
//         }),
//       });

//       axios
//         .request(data)
//         .then((response) => {
//           console.log(JSON.stringify(response.data));
//           //toast.success("Check your email ID for OTP", { position: "top-right" });

//           alert("Check your email ID for Link");
//           history("/resetpassword");
//         })
//         .catch((error) => {
//           alert("please check your Email");
//           console.log(error);
//         });

//       const res = await data.json();
//       console.log(res);

//       if (res.status === 200) {
//         localStorage.setItem("resetpasstoken", res.result.token);

//         Cookies.set("resetpasstoken", res.result.token); //, { expiresIn: Date.now() + (parseInt(expiryTime) * 60 * 1000)}); // Set cookie with duration provided
//       } else if (res.status === 400) {
//         toast.error("Invalid user!");
//       } else {
//         toast.error("An error occurred. Please try again.");
//       }
//     }
//   };

//   return (
//     <>
      
//           <Container maxWidth="md">
//               <Box display="flex" justifyContent="flex-start" sx={{ position: 'absolute', top: 0, left: 0, mt: 2 }}>
//                   <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
//                       <img src={logo} alt="logo" style={{ height: '40px', marginRight: '5px' }} />
//                       <Typography variant="h6">PMS Solutions</Typography>
//                   </Box>
//               </Box>

//               <Box display="flex" justifyContent="center" alignItems={'center'} sx={{ minHeight: '100vh' }}>
//                   <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '500px' }}>
//                       <Box>
//                           <Typography variant="h5" sx={{ mb: 1 }}>Reset your password</Typography>
//                           <Typography variant="body1" sx={{ mb: 3 }}>
//                               To reset your password, enter the email address you use to sign in
//                           </Typography>
//                       </Box>

//                       <Box component="form" noValidate autoComplete="off">
//                           <TextField
//                               fullWidth
//                               label="Email Address"
//                               name="email"
//                               value={inpval.email}
//                               onChange={setVal}
//                               placeholder="Email Address"
//                               sx={{ mb: 3 }}
//                           />

//                           <Box display="flex" gap={2}>
//                               <Button variant="contained" color="primary" onClick={getresetlink}>
//                                   Get Reset Link
//                               </Button>

//                               <NavLink to="/" style={{ textDecoration: 'none' }}>
//                                   <Button variant="outlined" color="primary">
//                                       Back to Login
//                                   </Button>
//                               </NavLink>
//                           </Box>
//                       </Box>
//                   </Paper>
//               </Box>

              
//           </Container>


//     </>
//   );
// }

// export default ForgotPassword;

import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Container,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "material-react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../Images/snplogo-removebg-preview.png";
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

const ForgotPasswordContainer = styled(Stack)(({ theme }) => ({
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

export default function ForgotPassword() {
  const SEVER_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const getResetLink = async (e) => {
    e.preventDefault();

    // Validation
    if (!email) {
      setEmailError(true);
      setEmailErrorMessage("Email is required");
      return;
    } else if (!email.includes("@")) {
      setEmailError(true);
      setEmailErrorMessage("Email must include @");
      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    try {
      const clientResetURL = `${SEVER_PORT}/client/client/resetpassword`;
      const apiURL = `${LOGIN_API}/resetpass/forgotpassword/`;

      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          url: clientResetURL,
        }),
      });

      const res = await response.json();

      if (response.status === 200) {
        localStorage.setItem("resetpasstoken", res.result.token);
        Cookies.set("resetpasstoken", res.result.token);
        toast.success("Check your email for the reset link.");
       
      } else if (response.status === 400) {
        toast.error("Invalid user!");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ForgotPasswordContainer direction="column" justifyContent="center">
        <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

        {/* Logo & Title */}
        {/* <Box sx={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <Box display="flex" alignItems="center">
            <img
              src={logo}
              alt="logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
            <Typography variant="h6">PMS Solutions</Typography>
          </Box>
        </Box> */}

        {/* Card */}
        <Card variant="outlined">
          <Typography variant="h4" component="h1">
            Reset your password
          </Typography>
          <Typography variant="body1">
            To reset your password, enter the email address you use to sign in
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={getResetLink}>
            <FormControl fullWidth margin="normal">
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={handleChange}
                error={emailError}
                helperText={emailErrorMessage}
                autoComplete="email"
                fullWidth
              />
            </FormControl>

            <Box display="flex" gap={2} mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Get Reset Link
              </Button>
              <NavLink to="/client/login" style={{ textDecoration: "none", width: "100%" }}>
                <Button variant="outlined" fullWidth>
                  Back to Login
                </Button>
              </NavLink>
            </Box>
          </Box>
        </Card>
      </ForgotPasswordContainer>
    </AppTheme>
  );
}
