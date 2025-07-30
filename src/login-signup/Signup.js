import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stepper,
  Step,
  StepLabel,
  InputLabel,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Paper,
  Box,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  FormLabel,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Link } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import OtpInput from "react-otp-input";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "../Images/snplogo.png";
import { toast } from "material-react-toastify";
import axios from "axios";

const steps = ["Email Verification", "Personal Details", "Password & OTP"];
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

const ClientSignUp = (props) => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN
  const CLIENT_DOCS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const SEVER_PORT = process.env.REACT_APP_SERVER_URI;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    middleName: "",
    lastName: "",
    accountName: "",
    phoneNumber: "",
    password: "",
    cpassword: "",
    otp: "",
    termsAccepted: false,
  });

  const [validation, setValidation] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientIdUpdate, setClientIdUpdate] = useState("");

  // Header component for logo
  const Header = () => (
    <Box>
      <img style={{ width: "110px", display: "block" }} src={logo} alt="Logo" />
    </Box>
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Update account name when name fields change
    if (["firstname", "middleName", "lastName"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        accountName:
          `${prev.firstname} ${prev.middleName} ${prev.lastName}`.trim(),
      }));
    }
  };

  const handleOtpChange = (otp) => {
    setFormData((prev) => ({ ...prev, otp }));
  };

  // Password visibility handlers
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSignInClick = () => navigate("/client/login");

  // Step 1: Email verification
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const { email, termsAccepted } = formData;

    if (!email) {
      toast.error("Email is required!", { position: "top-center" });
      return;
    }
    if (!email.includes("@")) {
      toast.warning("Please include @ in your email!", {
        position: "top-center",
      });
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept terms and conditions", {
        position: "top-center",
      });
      return;
    }

    try {
      // Check if user exists
      const userCheck = await fetch(
        `${LOGIN_API}/common/user/email/getuserbyemail/${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      // const result = await userCheck.json();
      // if (result.user?.length > 0) {
      //   toast.error("User with this email already exists", {
      //     position: "top-right",
      //   });
      //   return;
      // }

      // Send OTP
      const otpResponse = await axios.post(
        `${LOGIN_API}/clientsotp/clientrequest-otp/`,
        {
          email: email,
        }
      );

      toast.success("OTP sent to your email. Please check your inbox.");
      handleNext();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Step 2: Personal details
  const handlePersonalDetailsSubmit = (e) => {
    e.preventDefault();
    const { firstname, lastName, phoneNumber } = formData;

    let isValid = true;
    const newValidation = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };

    if (!firstname) {
      newValidation.firstName = "First Name can't be blank";
      isValid = false;
    }
    if (!lastName) {
      newValidation.lastName = "Last Name can't be blank";
      isValid = false;
    }
    if (!phoneNumber || phoneNumber.length < 6) {
      newValidation.phoneNumber = "Phone number must contain at least 6 digits";
      isValid = false;
    }

    setValidation(newValidation);
    if (isValid) handleNext();
  };

  // Step 3: Password and OTP verification
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { password, cpassword, otp } = formData;

    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters", {
        position: "top-center",
      });
      return;
    }
    if (password !== cpassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", {
        position: "top-center",
      });
      return;
    }

    try {
      // Verify OTP
      const otpVerify = await axios.post(
        `${LOGIN_API}/clientsotp/verifyclient-otp/`,
        {
          email: formData.email,
          otp: otp,
        }
      );
console.log("OTP Verification Response:", otpVerify);
      if (otpVerify.data === "Email verified successfully") {
        await registerClient();
        toast.success("Registration successful!");
        navigate("/client/login");
      } else {
        toast.error("OTP verification failed");
        
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during registration");
    }
  };

//   const registerClient = async () => {
//     try {
//       // Register client
//       const clientResponse = await fetch(
//         `${LOGIN_API}/admin/clientsignup/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: formData.email,
//             firstName: formData.firstname,
//             middleName: formData.middleName,
//             lastName: formData.lastName,
//             phoneNumber: formData.phoneNumber,
//             accountName: formData.accountName,
//             password: formData.password,
//             cpassword: formData.cpassword,
//           }),
//         }
//       );
// console.log(clientResponse)
//       const clientResult = await clientResponse.json();
//       setClientIdUpdate(clientResult.client._id);

//       // Create user account
//       await createUserAccount(clientResult.client._id);
//     } catch (error) {
//       console.error("Client registration error:", error);
//       throw error;
//     }
//   };
const registerClient = async () => {
  try {
    const clientResponse = await fetch(`${LOGIN_API}/admin/clientsignup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        firstName: formData.firstname,
        middleName: formData.middleName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        accountName: formData.accountName,
        password: formData.password,
        cpassword: formData.cpassword,
      }),
    });

    const clientResult = await clientResponse.json();

    console.log("Client Signup Response:", clientResult);

    if (!clientResponse.ok) {
      throw new Error(clientResult.message || "Client signup failed");
    }

    if (!clientResult.client || !clientResult.client._id) {
      throw new Error("Client ID not returned in response");
    }

    setClientIdUpdate(clientResult.client._id);

    // Proceed to create user account
    await createUserAccount(clientResult.client._id);
  } catch (error) {
    console.error("Client registration error:", error);
    throw error;
  }
};

  const createUserAccount = async (clientId) => {
    try {
      // Create user
      const userResponse = await fetch(`${LOGIN_API}/common/login/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.firstname,
          email: formData.email,
          password: formData.password,
          role: "Client",
        }),
      });

      const userResult = await userResponse.json();
console.log("User Signup Response:", userResult);
      // Update client with user ID
      await fetch(`${LOGIN_API}/admin/clientsignup/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: userResult._id }),
      });

      // Create financial account
      await createFinancialAccount(userResult._id);

      // Send welcome email
      await clientCreatedmail();
    } catch (error) {
      console.error("User creation error:", error);
      throw error;
    }
  };

  const createFinancialAccount = async (userId) => {
    try {
      // Create account
      const accountResponse = await fetch(
        `${ACCOUNT_API}/accounts/accountdetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientType: "Individual",
            accountName: formData.accountName,
            userid: userId,
          }),
        }
      );

      const accountResult = await accountResponse.json();

      // Update account with user ID
      await fetch(
        `${ACCOUNT_API}/accounts/accountdetails/${accountResult.newAccount._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: userId }),
        }
      );

      // Create client documents folder
      await addFolderTemplate(accountResult.newAccount._id);
    } catch (error) {
      console.error("Account creation error:", error);
      throw error;
    }
  };

  const addFolderTemplate = async (accountId) => {
    try {
      const response = await fetch(`${CLIENT_DOCS}/clientdocs/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      await response.json();
    } catch (error) {
      console.error("Folder creation error:", error);
      throw error;
    }
  };

  const clientCreatedmail = async () => {
    const port = window.location.port;
    const urlportlogin = `${port}/`;

    try {
      await fetch(`http://127.0.0.1/clientmail/clientsavedemail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          url: urlportlogin,
        }),
      });
    } catch (error) {
      console.error("Email sending error:", error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleEmailSubmit}>
            <Box>
              <Typography variant="h5">
                <strong>Welcome to SNP Tax & Financials</strong>
              </Typography>
              <Typography variant="h7">Let's get started</Typography>
            </Box>

            <Box mt={3}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                fullWidth
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
                required
                variant="outlined"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                sx={{mt:3}}
              />
            </Box>

            <Box mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                }
                label="By signing up you agree to TaxDome Terms of Service, Privacy Policy and SMS Policy"
              />
            </Box>

            <Box mt={3}>
              <Button
                type="submit"
                sx={{ borderRadius: "10px", width: "30%", p: 1 }}
                variant="contained"
                color="primary"
              >
                Continue
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box component="form" onSubmit={handlePersonalDetailsSubmit}>
            <Box>
              <Typography variant="h5">
                <strong>Welcome to SNP Tax & Financials</strong>
              </Typography>
              <Typography variant="h7">Some basic details about you</Typography>
            </Box>

            <Box mt={3}>
              <InputLabel sx={{ color: "black" }}>First name</InputLabel>
              <TextField
                fullWidth
                name="firstname"
                placeholder="First name"
                size="small"
                value={formData.firstname}
                onChange={handleChange}
                error={!!validation.firstName}
                helperText={validation.firstName}
              />
            </Box>

            <Box mt={2}>
              <InputLabel sx={{ color: "black" }}>Middle name</InputLabel>
              <TextField
                fullWidth
                name="middleName"
                placeholder="Middle name"
                size="small"
                value={formData.middleName}
                onChange={handleChange}
              />
            </Box>

            <Box mt={2}>
              <InputLabel sx={{ color: "black" }}>Last name</InputLabel>
              <TextField
                fullWidth
                name="lastName"
                placeholder="Last name"
                size="small"
                value={formData.lastName}
                onChange={handleChange}
                error={!!validation.lastName}
                helperText={validation.lastName}
              />
            </Box>

            <Box mt={2}>
              <InputLabel sx={{ color: "black" }}>Account name</InputLabel>
              <TextField
                fullWidth
                name="accountName"
                placeholder="Account name"
                size="small"
                value={formData.accountName}
                onChange={handleChange}
              />
            </Box>

            <Box mt={2}>
              <InputLabel sx={{ color: "black" }}>Phone number</InputLabel>
              <TextField
                fullWidth
                name="phoneNumber"
                placeholder="--- --- ---"
                size="small"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!validation.phoneNumber}
                helperText={validation.phoneNumber}
              />
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button onClick={handleBack} sx={{ borderRadius: "10px", p: 1 }}>
                Back
              </Button>
              <Button
                type="submit"
                sx={{ borderRadius: "10px", p: 1 }}
                variant="contained"
                color="primary"
              >
                Continue
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box component="form" onSubmit={handlePasswordSubmit}>
            <Box>
              <Typography variant="h5">
                <strong>Welcome to SNP Tax & Financials</strong>
              </Typography>
              <Typography variant="h7">Enter password</Typography>
            </Box>

            <Box mt={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Box>

            <Box mt={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="cpassword">Confirm Password</InputLabel>
                <OutlinedInput
                  id="cpassword"
                  name="cpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.cpassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
              </FormControl>
            </Box>

            <Box mt={4}>
              <Typography variant="subtitle2">
                Enter verification code
              </Typography>
              <OtpInput
                value={formData.otp}
                onChange={handleOtpChange}
                numInputs={6}
                separator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                containerStyle={{ display: "flex" }}
                inputStyle={{
                  width: "2rem",
                  height: "2rem",
                  margin: "0 0.5rem",
                  fontSize: "1.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              />
            </Box>

            <Box mt={2}>
              <Typography variant="body2">
                By signing up, you agree to our terms & conditions
              </Typography>
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button onClick={handleBack} sx={{ borderRadius: "10px", p: 1 }}>
                Back
              </Button>
              <Button
                type="submit"
                sx={{ borderRadius: "10px", p: 1 }}
                variant="contained"
                color="primary"
              >
                Let's get started
              </Button>
            </Box>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    // <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', py: 4 }}>

    //     <Paper sx={{ padding: 4, width: '100%', maxWidth: '600px', mx: 'auto' }}>
    //         {getStepContent(activeStep)}

    //         <Box mt={4}>
    //             <Typography>
    //                 Already have an account?{' '}
    //                 <span
    //                     onClick={handleSignInClick}
    //                     style={{ color: '#439cea', cursor: 'pointer', fontWeight: 'bold' }}
    //                 >
    //                     Sign in
    //                 </span>
    //             </Typography>
    //         </Box>
    //     </Paper>

    // </Container>
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container
        direction="column"
        justifyContent="space-between"
        sx={{
          display: "flex",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: "600px",
            mx: "auto",
            p: 4,
          }}
        >
          {getStepContent(activeStep)}

          <Divider sx={{ my: 2 }}>or</Divider>

          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link
              component="button"
              onClick={handleSignInClick}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign in
            </Link>
          </Typography>
        </Card>
      </Container>
    </AppTheme>
  );
};

export default ClientSignUp;
