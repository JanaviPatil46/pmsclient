
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from "react-router-dom";

// // import "./setpassword.css"

// import { Button, Box, Typography, OutlinedInput, InputAdornment,Paper, Container } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// import { toast } from 'material-react-toastify';
// import Cookies from 'js-cookie';

// function ResetPassword() { 
//     const SEVER_PORT =process.env.REACT_APP_SERVER_URI
//     const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//     const history = useNavigate();

//     const [userEmail, setUserEmail] = useState("");

//     const getuser = (id) => {
//         console.log(id);
//         const myHeaders = new Headers();
    
//         const requestOptions = {
//             method: "GET",
//             headers: myHeaders,
//             redirect: "follow"
//         };
//         const url = `${LOGIN_API}/common/user/`;
//         fetch(url + id, requestOptions)
//             .then((response) => response.json()) 
//             .then((result) => {
//                 const email = result.email;
//                 const myHeaders = new Headers();
//                 myHeaders.append("Content-Type", "application/json");
//                 const raw = JSON.stringify({
//                     email: email
//                 });
        
//                 const requestOptions = {
//                     method: "POST",
//                     headers: myHeaders,
//                     body: raw,
//                     redirect: "follow"
//                 };
//                 const url = `${LOGIN_API}/passwordupdate/`;
//                 fetch(url, requestOptions)
//                     .then((response) => response.text())
//                     .then((result) => console.log(result))
//                     .catch((error) => console.error(error));
//             })
//             .catch((error) => console.error(error));
//     }
    
//     console.log(userEmail); // This will log the current value of userEmail
    
//         ///Update Password
//         const updatePassword = (id, token) => {
    
//             const myHeaders = new Headers();
//             myHeaders.append("Content-Type", "application/json");
//             myHeaders.append("id", id);
//             myHeaders.append("Authorization", token);
    
//             console.log(token)
//             const raw = JSON.stringify({
//                 "password": confirmPassword
//             });
    
//             const requestOptions = {
//                 method: "PATCH",
//                 headers: myHeaders,
//                 body: raw,
//                 redirect: "follow"
//             };
//             const baseUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;
        
//             const url = new URL(baseUrl);
    
//             url.searchParams.append("id", id);
//             url.searchParams.append("token", token);
    
    
//             fetch(url, requestOptions)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! Status: ${response.status}`);
//                     }
//                     return response.text();
//                 })
//                 .then((result) => {
//                     console.log(result)
    
//                     getuser(id)
//                     Cookies.remove("resetpasstoken")
//                     localStorage.removeItem("resetpasstoken")
//                     toast("Password Updated successfully.")
                   
//                     // Handle success, if needed
//                 })
//                 .catch((error) => {
//                     console.error("Error updating password:", error.message);
//                     // Handle error, if needed
//                 });
//         }

//     const UserValidToken = async () => {
//         let token = localStorage.getItem("resetpasstoken");
//         const url = `${LOGIN_API}/common/resetpassword/verifytoken/`;
//         const res = await fetch(url, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": token
//             }
//         });

//         const data = await res.json();
//         console.log(data)
//         if (data.message === "Access granted") {
//             const id = data.user.id;
// console.log(id)
//             updatePassword(id, token);

//             //ToDo send to login page

//         } else if (data.message === "Invalid token") {
//             console.log("Time Expired");
//             toast.error('Time Expired!');
//             //ToDo send to resetpasswordlink
//         }
//     }



//     const [showPassword, setShowPassword] = useState(false);
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const handleTogglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     };

//     const handleConfirmPasswordChange = (e) => {
//         setConfirmPassword(e.target.value);
//     };

//     const handleConfirmPasswordPaste = (e) => {
//         const pastedText = e.clipboardData.getData('text');
//         setConfirmPassword(pastedText);
//     };

//     const handleSubmit = () => {
//         history('/')
//            if (password !== confirmPassword) {
//             toast.error('Passwords do not match!');
//             return;
//         }
//         else {
//             UserValidToken()
//         }
//     };


//     return (
//         <>

//             {/* <div className="setpassword-container col-12" style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
//                 <div className='password-sub-container col-12 ' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', maxWidth: '600px' }}>
//                     <div className='pagetitle' style={{ fontSize: '30px', textAlign: 'center' }}>
//                         <h1 style={{ marginBottom: '5%', fontSize: '38px', textAlign: 'center' }}>Set Password</h1>
//                     </div>
//                     <div className="form-password col-9" style={{ marginBottom: '6%', marginTop: '5%' }}>
//                         <div className="password-input" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
//                             <label htmlFor="password">Password</label>
//                             <input
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={password}
//                                 onChange={handlePasswordChange}
//                                 style={{ padding: "8px 12px", width: "100%", border: "2px solid rgb(100, 149, 237)", borderRadius: "10px", margin: "10px 0" }}
//                             />
//                             <div style={{ position: 'absolute', top: '60%', transform: 'translateY(-50%)', right: '20px', cursor: 'pointer',border:'1px solid red' }} onClick={handleTogglePasswordVisibility}>
//                                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="formpassword col-9">
//                         <div className="password-input" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
//                             <label htmlFor="confirmPassword">Confirm Password</label>
//                             <input
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={confirmPassword}
//                                 onChange={handleConfirmPasswordChange}
//                                 onPaste={handleConfirmPasswordPaste} // Allow pasting
//                                 style={{ padding: "8px 12px", width: "100%", border: "2px solid rgb(100, 149, 237)", borderRadius: "10px", margin: "10px 0" }}
//                             />
//                             <div style={{ position: 'absolute', top: '80%', transform: 'translateY(-50%)', right: '20px', cursor: 'pointer' }} onClick={handleTogglePasswordVisibility}>
//                                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//                             </div>
//                         </div>
//                     </div>
//                     <div className='password-btn col-9'>
//                         <div className='btn1' style={{ justifyContent: 'left', }}>
//                             <button style={{ marginLeft: '0', background: "rgb(100, 149, 237)", marginTop: '2%', border: "none", borderRadius: '10px', width: '80px', height: '30px', color: 'white' }}
//                                 onClick={() => {
//                                     handleSubmit()
//                                 }}>Continue</button>
//                         </div>
//                     </div>
//                 </div>
//             </div> */}

//             <Container> 
               
//             <Box className="setpassword-container" sx={{ display: 'flex', justifyContent: 'center', alignItems:'center', mt:20}}>
//                 <Paper height= {'100vh'}>
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  }}> {/* Parent Container */}
//             <Box className='password-sub-container' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', maxWidth: '600px', width: '100%' }}>
//                 <Box className='pagetitle' sx={{ textAlign: 'center', width: '100%' }}>
//                     <Typography variant="h1" sx={{ fontSize: '38px', marginBottom: '5%' }}>Set Password</Typography>
//                 </Box>
//                 <Box className="form-password" sx={{ marginBottom: '6%', marginTop: '5%', width: '75%' }}>
//                     <Typography htmlFor="password">Password</Typography>
//                     <OutlinedInput
//                         type={showPassword ? 'text' : 'password'}
//                         value={password}
//                         onChange={handlePasswordChange}
//                         sx={{ width: "100%",  borderRadius: "10px", margin: "10px 0" }}
//                         endAdornment={
//                             <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={handleTogglePasswordVisibility}>
//                                 {showPassword ? <Visibility /> : <VisibilityOff />}
//                             </InputAdornment>
//                         }
//                     />
//                 </Box>
//                 <Box className="form-password" sx={{ width: '75%' }}>
//                     <Typography htmlFor="confirmPassword">Confirm Password</Typography>
//                     <OutlinedInput
//                         type={showPassword ? 'text' : 'password'}
//                         value={confirmPassword}
//                         onChange={handleConfirmPasswordChange}
//                         onPaste={handleConfirmPasswordPaste} // Allow pasting
//                         sx={{ width: "100%",  borderRadius: "10px", margin: "10px 0" }}
//                         endAdornment={
//                             <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={handleTogglePasswordVisibility}>
//                                 {showPassword ? <Visibility /> : <VisibilityOff />}
//                             </InputAdornment>
//                         }
//                     />
//                 </Box>
//                 <Box className='password-btn' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2%', width: '100%' ,margin:2}}>
//                     <Button
//                         variant="contained"
//                         onClick={handleSubmit}
//                     >
//                         Continue
//                     </Button>
//                 </Box>
//             </Box>
//         </Box>
//                 </Paper> 
//             </Box>
          
//             </Container>
           
//         </>
//     );
// }

// export default ResetPassword;

import React, { useState } from "react";
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
  const SERVER_PORT = process.env.REACT_APP_SERVER_URI;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const navigate = useNavigate();

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

//   const updatePassword = (id, token) => {
//     const body = JSON.stringify({ password: confirmPassword });
//     const url = new URL(`${LOGIN_API}/common/user/password/updateuserpassword/`);
//     url.searchParams.append("id", id);
//     url.searchParams.append("token", token);

//     fetch(url, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//       body,
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
//         return res.text();
//       })
//       .then(() => {
//         Cookies.remove("resetpasstoken");
//         localStorage.removeItem("resetpasstoken");
//         toast.success("Password updated successfully!");
//         getUser(id);
//         navigate("/client/login");
//       })
//       .catch((err) => {
//         console.error("Error updating password:", err.message);
//         toast.error("Failed to update password.");
//       });
//   };


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
      // headers: {
      //   "Content-Type": "application/json",
      //   Authorization: token,
      // },
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
            Set New Password
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
