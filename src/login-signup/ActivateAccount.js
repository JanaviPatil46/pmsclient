// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Alert,
//   CircularProgress
// } from '@mui/material';

// const UpdatePassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [verifying, setVerifying] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [contactInfo, setContactInfo] = useState(null);
  
//   const [formData, setFormData] = useState({
//     password: '',
//     confirmPassword: ''
//   });

//   useEffect(() => {
//     verifyToken();
//   }, [token]);

//   const verifyToken = async () => {
//     try {
//       const response = await axios.get(
//         `https://www.snptaxes.com/api/contacts/activate/verify/${token}`
//       );
//       setContactInfo(response.data.contact);
//       setVerifying(false);
//     } catch (error) {
//       setError('Invalid or expired activation link. Please request a new one.');
//       setVerifying(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 8) {
//       setError('Password must be at least 8 characters long');
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await axios.post(
//         `https://www.snptaxes.com/api/contacts/activate/set-password/${token}`,
//         { password: formData.password }
//       );
      
//       setSuccess('Password set successfully! You can now login with your new password.');
      
//       // Redirect to login after 3 seconds
//       setTimeout(() => {
//         navigate('/client/login');
//       }, 3000);
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to set password. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (verifying) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <Typography>Verifying activation link...</Typography>
//       </Box>
//     );
//   }

//   if (error && !contactInfo) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <Alert severity="error" sx={{ maxWidth: 400 }}>
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       bgcolor="#f5f5f5"
//     >
//       <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
//         <Typography variant="h4" component="h1" gutterBottom align="center">
//           Set Your Password
//         </Typography>
        
//         {contactInfo && (
//           <Typography variant="body1" gutterBottom align="center">
//             Hello {contactInfo.name}, please set your password to activate your account.
//           </Typography>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {success && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {success}
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             margin="normal"
//             label="New Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             disabled={submitting}
//           />
          
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Confirm Password"
//             name="confirmPassword"
//             type="password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//             disabled={submitting}
//           />
          
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3 }}
//             disabled={submitting}
//           >
//             {submitting ? <CircularProgress size={24} /> : 'Set Password & Continue'}
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default UpdatePassword;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ListItemText
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { toast } from 'material-react-toastify';

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contactInfo, setContactInfo] = useState(null);
  
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
        `https://www.snptaxes.com/api/contacts/activate/verify/${token}`
      );
      setContactInfo(response.data.contact);
      setVerifying(false);
    } catch (error) {
      setError('Invalid or expired activation link. Please request a new one.');
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
        `https://www.snptaxes.com/api/contacts/activate/set-password/${token}`,
        { password: formData.password }
      );
      
    //   setSuccess('Password set successfully! You can now login with your new password.');
      toast.success('Password set successfully! You can now login with your new password.')
      
      // Redirect to login after 1 seconds
      setTimeout(() => {
        navigate('/client/login');
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to set password. Please try again.');
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
        <Typography>Verifying activation link...</Typography>
      </Box>
    );
  }

  if (error && !contactInfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Set Your Password
        </Typography>
        
        {contactInfo && (
          <Typography variant="body1" gutterBottom align="center" color="text.secondary">
            Hello <strong>{contactInfo.name}</strong>, please set your password to activate your account.
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
            {submitting ? <CircularProgress size={24} /> : 'Set Password & Continue'}
          </Button>
        </form>

        {/* Password Strength Indicator */}
        {formData.password.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
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
  );
};

export default UpdatePassword;