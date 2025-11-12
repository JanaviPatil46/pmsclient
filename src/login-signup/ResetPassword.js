

// import React, { useState,useEffect } from "react";
// import {
//   Box,
//   Button,
//   CssBaseline,
//   FormControl,
//   FormLabel,
//   OutlinedInput,
//   InputAdornment,
//   Typography,
//   Container,
//   Stack,
//   Card as MuiCard,
// } from "@mui/material";
// import { useParams } from 'react-router-dom';

// import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import { toast } from "material-react-toastify";
// import Cookies from "js-cookie";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
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
// }));

// const ResetPasswordContainer = styled(Stack)(({ theme }) => ({
//   height: "100dvh",
//   padding: theme.spacing(2),
//   [theme.breakpoints.up("sm")]: {
//     padding: theme.spacing(4),
//   },
// }));

// function ResetPassword() {
//   const { id, token } = useParams(); 
//   const SERVER_PORT = process.env.REACT_APP_SERVER_URI;
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const navigate = useNavigate();
// console.log("id",id)
//   // Store token in localStorage when component mounts
//   useEffect(() => {
//     if (token && id) {
//       localStorage.setItem("resetpasstoken", token);
//       console.log("Token extracted from URL:", token);
//     } else {
//       // Check for existing token in case of page refresh
//       const storedToken = localStorage.getItem("resetpasstoken");
//       if (!storedToken) {
//         toast.error("Invalid reset link. Please request a new password reset.");
//         navigate("/client/login");
//       }
//     }
//   }, [token, id, navigate]);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

  
//   const handleTogglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handlePasswordChange = (e) => setPassword(e.target.value);
//   const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
//   const handleConfirmPasswordPaste = (e) => {
//     const pastedText = e.clipboardData.getData("text");
//     setConfirmPassword(pastedText);
//   };

//   const getUser = (id) => {
//     const url = `${LOGIN_API}/common/user/${id}`;
//     fetch(url)
//       .then((res) => res.json())
//       .then((user) => {
//         const email = user.email;
//         const requestBody = JSON.stringify({ email });
//         return fetch(`${LOGIN_API}/updatepass/passwordupdate/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: requestBody,
//         });
//       })
//       .then((res) => res.text())
//       .then((result) => console.log(result))
//       .catch((err) => console.error(err));
//   };




// const updatePassword = (id, token) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     myHeaders.append("id", id);
//     myHeaders.append("Authorization", token);

//     console.log(token);
//     const raw = JSON.stringify({
//       password: confirmPassword,
//     });

//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };
//     const baseUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;

//     const url = new URL(baseUrl);

//     url.searchParams.append("id", id);
//     url.searchParams.append("token", token);

//     fetch(url, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((result) => {
//         console.log(result);

//         getUser(id);
//         Cookies.remove("resetpasstoken");
//         localStorage.removeItem("resetpasstoken");
//         toast.success("Password Updated successfully.");
// navigate("/client/login")
//         // Handle success, if needed
//       })
//       .catch((error) => {
//         console.error("Error updating password:", error.message);
//         // Handle error, if needed
//       });
//   };
//   const validateTokenAndUpdate = async () => {
//     const token = localStorage.getItem("resetpasstoken");
//     console.log("resetpasstoken",token)
//     const res = await fetch(`${LOGIN_API}/common/resetpassword/verifytoken/`, {
//       method: "GET",
      
//        headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       }
//     });

//     const data = await res.json();
//     if (data.message === "Access granted") {
//       const userId = data.user.id;
//       updatePassword(userId, token);
//     } else {
//       toast.error("Token expired or invalid. Please try again.");
//     }
//   };

//   const handleSubmit = () => {
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }
//     validateTokenAndUpdate();
//   };

//   return (
//     <AppTheme>
//       <CssBaseline enableColorScheme />
//       <ResetPasswordContainer direction="column" justifyContent="center">
//         <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

//         <Card variant="outlined">
//           <Typography variant="h4" component="h1">
//             Set New Passwordss
//           </Typography>

//           <FormControl fullWidth margin="normal">
//             <FormLabel htmlFor="password">Password</FormLabel>
//             <OutlinedInput
//               id="password"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={handlePasswordChange}
//               fullWidth
//               sx={{ borderRadius: "10px", mt: 1 }}
//               endAdornment={
//                 <InputAdornment position="end" onClick={handleTogglePasswordVisibility} sx={{ cursor: "pointer" }}>
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </InputAdornment>
//               }
//             />
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
//             <OutlinedInput
//               id="confirmPassword"
//               type={showPassword ? "text" : "password"}
//               value={confirmPassword}
//               onChange={handleConfirmPasswordChange}
//               onPaste={handleConfirmPasswordPaste}
//               fullWidth
//               sx={{ borderRadius: "10px", mt: 1 }}
//               endAdornment={
//                 <InputAdornment position="end" onClick={handleTogglePasswordVisibility} sx={{ cursor: "pointer" }}>
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </InputAdornment>
//               }
//             />
//           </FormControl>

//           <Box mt={3}>
//             <Button fullWidth variant="contained" onClick={handleSubmit}>
//               Continue
//             </Button>
//           </Box>
//         </Card>
//       </ResetPasswordContainer>
//     </AppTheme>
//   );
// }

// export default ResetPassword;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    verifyToken();
  }, [token]);

  // Validate password whenever it changes
  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  const validatePassword = (password) => {
    setPasswordValidation({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    });
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(condition => condition);
  };

  const verifyToken = async () => {
    try {
      const response = await axios.get(
        `https://www.snptaxes.com/api/auth/verify-reset-token/${token}`
      );
      setUserInfo(response.data.user);
      setVerifying(false);
    } catch (error) {
      setError('Invalid or expired reset link. Please request a new password reset.');
      setVerifying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (!isPasswordValid()) {
      setError('Please ensure your password meets all the requirements below');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `https://www.snptaxes.com/api/auth/reset-password/${token}`,
        { password: formData.password }
      );
      
      setSuccess('Password reset successfully! You can now login with your new password.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/client/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Validation item component
  const ValidationItem = ({ valid, text }) => (
    <ListItem sx={{ py: 0.5 }}>
      <ListItemIcon sx={{ minWidth: 32 }}>
        {valid ? (
          <CheckCircle color="success" fontSize="small" />
        ) : (
          <Cancel color="error" fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText 
        primary={text} 
        sx={{ 
          color: valid ? 'success.main' : 'error.main',
          textDecoration: valid ? 'none' : 'line-through',
          opacity: valid ? 1 : 0.7
        }}
      />
    </ListItem>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (verifying) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Verifying reset link...</Typography>
      </Box>
    );
  }

  if (error && !userInfo) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Box textAlign="center">
              <Link to="/client/forgot-password" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Request New Reset Link
                </Button>
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Reset Your Password
          </Typography>
          
          {userInfo && (
            <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
              Hello <strong>{userInfo.name}</strong>, please enter your new password.
            </Typography>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Password Field */}
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={submitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={formData.password.length > 0 && !isPasswordValid()}
              helperText={formData.password.length > 0 && !isPasswordValid() ? "Password doesn't meet requirements" : ""}
            />

            {/* Password Requirements */}
            {formData.password.length > 0 && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Password Requirements:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ValidationItem 
                    valid={passwordValidation.hasMinLength} 
                    text="At least 8 characters long" 
                  />
                  <ValidationItem 
                    valid={passwordValidation.hasUpperCase} 
                    text="At least one uppercase letter (A-Z)" 
                  />
                  <ValidationItem 
                    valid={passwordValidation.hasLowerCase} 
                    text="At least one lowercase letter (a-z)" 
                  />
                  <ValidationItem 
                    valid={passwordValidation.hasNumber} 
                    text="At least one number (0-9)" 
                  />
                  <ValidationItem 
                    valid={passwordValidation.hasSpecialChar} 
                    text="At least one special character (!@#$%^&* etc.)" 
                  />
                </List>
              </Box>
            )}

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={submitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword}
              helperText={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={submitting || !isPasswordValid() || formData.password !== formData.confirmPassword}
              size="large"
            >
              {submitting ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link to="/client/login" style={{ textDecoration: 'none' }}>
                <Button color="primary">
                  Back to Login
                </Button>
              </Link>
            </Box>
          </form>

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Password Strength: {' '}
                <Typography 
                  component="span" 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: isPasswordValid() ? 'success.main' : 'warning.main'
                  }}
                >
                  {isPasswordValid() ? 'Strong' : 'Weak'}
                </Typography>
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;