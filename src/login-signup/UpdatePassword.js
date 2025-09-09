// // import React, { useState, useEffect } from "react";
// // import { useNavigate, useParams } from "react-router-dom";

// // import {
// //   Button,
// //   Box,
// //   Typography,
// //   OutlinedInput,
// //   InputAdornment,
// //   Paper,
// //   Container,
// // } from "@mui/material";
// // import Visibility from "@mui/icons-material/Visibility";
// // import VisibilityOff from "@mui/icons-material/VisibilityOff";

// // import { toast } from "material-react-toastify";
// // import Cookies from "js-cookie";

// // function UpdatePassword() {
// //   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
// //   const history = useNavigate();
// //   const { _id, token } = useParams();

// //   const getuser = (id) => {
// //     console.log(id);
// //     const myHeaders = new Headers();

// //     const requestOptions = {
// //       method: "GET",
// //       headers: myHeaders,
// //       redirect: "follow",
// //     };
// //     const url = `${LOGIN_API}/common/user/`;
// //     fetch(url + id, requestOptions)
// //       .then((response) => response.json())
// //       .then((result) => {
// //         const email = result.email;
// //         const myHeaders = new Headers();
// //         myHeaders.append("Content-Type", "application/json");
// //         const raw = JSON.stringify({
// //           email: email,
// //         });

// //         const requestOptions = {
// //           method: "POST",
// //           headers: myHeaders,
// //           body: raw,
// //           redirect: "follow",
// //         };
// //         const url = `${LOGIN_API}/passwordupdate/`;
// //         fetch(url, requestOptions)
// //           .then((response) => response.text())
// //           .then((result) => console.log(result))
// //           .catch((error) => console.error(error));
// //       })
// //       .catch((error) => console.error(error));
// //   };

// //   ///Update Password
// //   const updatePassword = (id, token) => {
// //     const myHeaders = new Headers();
// //     myHeaders.append("Content-Type", "application/json");
// //     myHeaders.append("id", id);
// //     myHeaders.append("Authorization", token);

// //     console.log(token);
// //     const raw = JSON.stringify({
// //       password: confirmPassword,
// //     });

// //     const requestOptions = {
// //       method: "PATCH",
// //       headers: myHeaders,
// //       body: raw,
// //       redirect: "follow",
// //     };
// //     console.log(raw);
// //     const baseUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;

// //     const url = new URL(baseUrl);

// //     url.searchParams.append("id", id);
// //     url.searchParams.append("token", token);

// //     console.log(url);
// //     fetch(url, requestOptions)
// //       .then((response) => {
// //         if (!response.ok) {
// //           throw new Error(`HTTP error! Status: ${response.status}`);
// //         }
// //         return response.text();
// //       })
// //       .then((result) => {
// //         console.log(result);

// //         getuser(id);
// //         Cookies.remove("resetpasstoken");
// //         localStorage.removeItem("resetpasstoken");
// //         toast.success("Password Updated successfully.");

// //         // Handle success, if needed
// //       })
// //       .catch((error) => {
// //         console.error("Error updating password:", error.message);
// //         // Handle error, if needed
// //       });
// //   };
// //   const [passwordValid, setPasswordValid] = useState(false);

// //   const validatePassword = (newPassword) => {
// //     // Check if newPassword is defined before performing operations
// //     if (typeof newPassword !== "undefined") {
// //       // Example validation criteria: password length >= 8 characters, contains at least one number and one letter
// //       const hasNumber = /\d/.test(newPassword);
// //       const hasLetter = /[a-zA-Z]/.test(newPassword);
// //       const isValid = newPassword.length >= 8 && hasNumber && hasLetter;
// //       setPasswordValid(isValid);
// //     }
// //   };
// //   const UserValidToken = async () => {
// //     // let token = localStorage.getItem("resetpasstoken");
// //     validatePassword();
// //     const url = `${LOGIN_API}/common/resetpassword/verifytoken/`;
// //     const res = await fetch(url, {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: token,
// //       },
// //     });

// //     const data = await res.json();
// //     console.log(data);
// //     if (data.message === "Access granted") {
// //       const id = data.user.id;
// //       console.log(id);
// //       updatePassword(id, token);

// //       //ToDo send to login page
// //     } else if (data.message === "Invalid token") {
// //       console.log("Time Expired");
// //       toast.error("Time Expired!");
// //       //ToDo send to resetpasswordlink
// //     }
// //   };

// //   const [showPassword, setShowPassword] = useState(false);
// //   const [password, setPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");

// //   const handleTogglePasswordVisibility = () => {
// //     setShowPassword(!showPassword);
// //   };

// //   const handlePasswordChange = (e) => {
// //     setPassword(e.target.value);
// //   };

// //   const handleConfirmPasswordChange = (e) => {
// //     setConfirmPassword(e.target.value);
// //   };

// //   const handleConfirmPasswordPaste = (e) => {
// //     const pastedText = e.clipboardData.getData("text");
// //     setConfirmPassword(pastedText);
// //   };

// //   const handleSubmit = () => {
// //     history("/");
// //     if (password !== confirmPassword) {
// //       toast.error("Passwords do not match!");
// //       return;
// //     } else {
// //       UserValidToken();
// //     }
// //   };

// //   return (
// //     <>
// //       <Container>
// //         <Box
// //           className="setpassword-container"
// //           sx={{
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             mt: 20,
// //           }}
// //         >
// //           <Paper height={"100vh"}>
// //             <Box
// //               sx={{
// //                 display: "flex",
// //                 justifyContent: "center",
// //                 alignItems: "center",
// //               }}
// //             >
// //               {" "}
// //               {/* Parent Container */}
// //               <Box
// //                 className="password-sub-container"
// //                 sx={{
// //                   display: "flex",
// //                   justifyContent: "center",
// //                   alignItems: "center",
// //                   flexWrap: "wrap",
// //                   maxWidth: "600px",
// //                   width: "100%",
// //                 }}
// //               >
// //                 <Box
// //                   className="pagetitle"
// //                   sx={{ textAlign: "center", width: "100%" }}
// //                 >
// //                   <Typography
// //                     variant="h1"
// //                     sx={{ fontSize: "38px", marginBottom: "5%" }}
// //                   >
// //                     Reset Password
// //                   </Typography>
// //                 </Box>
// //                 <Box
// //                   className="form-password"
// //                   sx={{ marginBottom: "6%", marginTop: "5%", width: "75%" }}
// //                 >
// //                   <Typography htmlFor="password">Password</Typography>
// //                   <OutlinedInput
// //                     type={showPassword ? "text" : "password"}
// //                     value={password}
// //                     onChange={handlePasswordChange}
// //                     sx={{
// //                       width: "100%",
// //                       borderRadius: "10px",
// //                       margin: "10px 0",
// //                     }}
// //                     endAdornment={
// //                       <InputAdornment
// //                         position="end"
// //                         sx={{ cursor: "pointer" }}
// //                         onClick={handleTogglePasswordVisibility}
// //                       >
// //                         {showPassword ? <Visibility /> : <VisibilityOff />}
// //                       </InputAdornment>
// //                     }
// //                   />
// //                 </Box>
// //                 <Box className="form-password" sx={{ width: "75%" }}>
// //                   <Typography htmlFor="confirmPassword">
// //                     Confirm Password
// //                   </Typography>
// //                   <OutlinedInput
// //                     type={showPassword ? "text" : "password"}
// //                     value={confirmPassword}
// //                     onChange={handleConfirmPasswordChange}
// //                     onPaste={handleConfirmPasswordPaste} // Allow pasting
// //                     sx={{
// //                       width: "100%",
// //                       borderRadius: "10px",
// //                       margin: "10px 0",
// //                     }}
// //                     endAdornment={
// //                       <InputAdornment
// //                         position="end"
// //                         sx={{ cursor: "pointer" }}
// //                         onClick={handleTogglePasswordVisibility}
// //                       >
// //                         {showPassword ? <Visibility /> : <VisibilityOff />}
// //                       </InputAdornment>
// //                     }
// //                   />
// //                 </Box>
// //                 <Box
// //                   className="password-btn"
// //                   sx={{
// //                     display: "flex",
// //                     justifyContent: "center",
// //                     alignItems: "center",
// //                     marginTop: "2%",
// //                     width: "100%",
// //                     margin: 2,
// //                   }}
// //                 >
// //                   <Button variant="contained" onClick={handleSubmit}>
// //                     Continue
// //                   </Button>
// //                 </Box>
// //               </Box>
// //             </Box>
// //           </Paper>
// //         </Box>
// //       </Container>
// //     </>
// //   );
// // }

// // export default UpdatePassword;




// import * as React from "react";
// import {
//   Box,
//   Button,
//   CssBaseline,
//   FormControl,
//   FormLabel,
//   IconButton,
//   InputAdornment,
//   Stack,
//   TextField,
//   Typography,
//   Fade,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
// import MuiCard from "@mui/material/Card";
// import { toast } from "material-react-toastify";
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

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   height: "100dvh",
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

// export default function UpdatePassword() {
//   const [password, setPassword] = React.useState("");
//   const [confirmPassword, setConfirmPassword] = React.useState("");

//   const [showPassword, setShowPassword] = React.useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

//   const [passwordError, setPasswordError] = React.useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
//   const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
//   const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState("");

//   const handleClickShowPassword = () => setShowPassword((prev) => !prev);
//   const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let error = false;

//     if (!password) {
//       setPasswordError(true);
//       setPasswordErrorMessage("Password is required");
//       error = true;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage("");
//     }

//     if (confirmPassword !== password) {
//       setConfirmPasswordError(true);
//       setConfirmPasswordErrorMessage("Passwords do not match");
//       error = true;
//     } else {
//       setConfirmPasswordError(false);
//       setConfirmPasswordErrorMessage("");
//     }

//     if (!error) {
//       toast.success("Password updated successfully!");
//       // Submit to backend here
//     }
//   };

//   return (
//     <AppTheme>
//       <CssBaseline enableColorScheme />
//       <SignInContainer direction="column" justifyContent="center">
//         <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
//         <Card variant="outlined">
//           <Typography component="h1" variant="h4">
//             Reset Password
//           </Typography>
//           <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
//             {/* Password Field */}
//             <FormControl fullWidth margin="normal">
//               <FormLabel htmlFor="password">Password</FormLabel>
//               <TextField
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={passwordError}
//                 helperText={passwordErrorMessage}
//                 placeholder="••••••"
//                 type={showPassword ? "text" : "password"}
//                 autoComplete="new-password"
//                 required
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Fade in={password.length > 0}>
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </Fade>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </FormControl>

//             {/* Confirm Password Field */}
//             <FormControl fullWidth margin="normal">
//               <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
//               <TextField
//                 id="confirm-password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 error={confirmPasswordError}
//                 helperText={confirmPasswordErrorMessage}
//                 placeholder="••••••"
//                 type={showConfirmPassword ? "text" : "password"}
//                 autoComplete="new-password"
//                 required
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Fade in={confirmPassword.length > 0}>
//                         <IconButton
//                           aria-label="toggle confirm password visibility"
//                           onClick={handleClickShowConfirmPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                         >
//                           {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </Fade>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </FormControl>

//             <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
//               Continue
//             </Button>
//           </Box>
//         </Card>
//       </SignInContainer>
//     </AppTheme>
//   );
// }

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
