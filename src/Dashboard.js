import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
// import MainGrid from "./components/MainGrid";
import SideMenu from "./components/SideMenu";
import AppTheme from "./shared-theme/AppTheme";
import { useNavigate } from "react-router-dom";

import { LoginContext } from "./context/Context";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,Button,Typography
} from "@mui/material";
import { Outlet } from "react-router-dom";

// export default function Dashboard(props) {
//   const navigate = useNavigate();
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const { setLoginData } = useContext(LoginContext);

//   const [data, setData] = useState(false);
//   const [loginsData, setloginsData] = useState("");

  // const fetchUserData = async (id) => {
  //   const myHeaders = new Headers();

  //   const requestOptions = {
  //     method: "GET",
  //     headers: myHeaders,
  //     redirect: "follow",
  //   };
  //   const url = `${LOGIN_API}/common/user/${id}`;
  //   fetch(url + loginsData, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log("selctedid", result);
  //     });
  // };

//   const DashboardValid = async () => {
//     let token = localStorage.getItem("clientdatatoken");

//     const url = `${LOGIN_API}/common/clientlogin/verifytokenforclient`;
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//     });

//     console.log(token);

//     const data = await res.json();
//     console.log("bnsvchd", data);
//     if (data.message === "Invalid token") {
//       navigate("/client/login");
//     } else {
//       setLoginData(data);
//       setloginsData(data.user.id);

//       if (data.user.role?.toLowerCase() === "client") {
//         fetchUserData(data.user.id);
//         // navigate("/home");
//       } else {
//         navigate("/client/login");

//         // }, 1000);
//       }
//     }
//   };
//   useEffect(() => {
//     DashboardValid();
//     setData(true);
//   }, []);
//   const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
//   return (
//     <AppTheme {...props}>
//       <CssBaseline enableColorScheme />
//       <Box sx={{ display: "flex" }}>
//         <SideMenu
//           collapsed={sideMenuCollapsed}
//           onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
//         />

//         <AppNavbar />

//         {/* Main content */}
//         <Box component="main" sx={{ width: "100%" }}>
//           <Box
//             // spacing={2}
//             sx={{
//               alignItems: "center",
//               mx: 3,
//               // pb: 5,
//               mt: { xs: 8, md: 0 },
//             }}
//           >
//             <Header />
//           </Box>

//           <Box
//             sx={(theme) => ({
//               flexGrow: 1,
//               // mt:0.8,
//               backgroundColor: theme.vars
//                 ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
//                 : alpha(theme.palette.background.default, 1),
//               overflow: "auto",
//               height: "88vh",
//               p: 2,

//               transition: theme.transitions.create("margin", {
//                 easing: theme.transitions.easing.sharp,
//                 duration: theme.transitions.duration.leavingScreen,
//               }),
//             })}
//           >
//             <Outlet />
//           </Box>
//         </Box>
//       </Box>
//     </AppTheme>
//   );
// }


// export default function Dashboard(props) {
//   const navigate = useNavigate();
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const { setLoginData ,} = useContext(LoginContext);

//   const [data, setData] = useState(false);
//   const [loginsData, setloginsData] = useState("");
//   const [userList, setUserList] = React.useState([]);
//   const [selectedUser, setSelectedUser] = React.useState(null);
//   const [openUserDialog, setOpenUserDialog] = useState(false);
//  const [isUserSelectionPending, setIsUserSelectionPending] = useState(false);
//   const handleOpenUserDialog = () => setOpenUserDialog(true);
//   const handleCloseUserDialog = () => setOpenUserDialog(false);
//   const fetchUserData = async (id) => {
//     const myHeaders = new Headers();

//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };
//     const url = `${LOGIN_API}/common/user/${id}`;
//     fetch(url + loginsData, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("selctedid", result);
//       });
//   };
//     const handleUserSelect = (user) => {
//       console.log("selecteduser",user)
//     setSelectedUser(user);
//     handleCloseUserDialog();
    
//     // Store the selected user in localStorage
//     localStorage.setItem("selectedUser", JSON.stringify(user));
    
//     // Remove the pending selection flag
//     localStorage.removeItem("pendingUserEmail");
    
//     // Update state to reflect the selected user
//     setIsUserSelectionPending(false);
    
//     // Refresh the dashboard data
//     DashboardValid();
//   };
//  // Function to fetch users by email
//   const fetchUsersByEmail = async (email, token) => {
//     try {
//       const checkUserUrl = `${LOGIN_API}/common/user/client/getuserbyemail/${email}`;
//       const checkUserResponse = await fetch(checkUserUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//       });

//       const userData = await checkUserResponse.json();
//       return userData;
//     } catch (error) {
//       console.error("Error fetching users by email:", error);
//       return null;
//     }
//   };
//   // const DashboardValid = async () => {
//   //   let token = localStorage.getItem("clientdatatoken");

//   //   const url = `${LOGIN_API}/common/clientlogin/verifytokenforclient`;
//   //   const res = await fetch(url, {
//   //     method: "GET",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //       Authorization: token,
//   //     },
//   //   });

//   //   console.log(token);

//   //   const data = await res.json();
//   //   console.log("bnsvchd", data);
    
//   //   // Check if we have pending user selection
//   //   const pendingSelection = localStorage.getItem("pendingUserSelection");
//   //   if (pendingSelection) {
//   //     const { userList } = JSON.parse(pendingSelection);
//   //     setUserList(userList);
//   //     handleOpenUserDialog();
//   //     return;
//   //   }
    
//   //   if (data.message === "Invalid token") {
//   //     navigate("/client/login");
//   //   } else {
//   //     setLoginData(data);
//   //     setloginsData(data.user.id);

//   //     if (data.user.role?.toLowerCase() === "client") {
//   //       fetchUserData(data.user.id);
//   //     } else {
//   //       navigate("/client/login");
//   //     }
//   //   }
//   // };
//   const DashboardValid = async () => {
//     let token = localStorage.getItem("clientdatatoken");

//     // Check if we have a pending user selection first
//     const pendingEmail = localStorage.getItem("pendingUserEmail");
//     if (pendingEmail) {
//       try {
//         // Fetch users by email
//         const userData = await fetchUsersByEmail(pendingEmail, token);
//         console.log("setUserList",userData)
//         if (userData && userData.user && userData.user.length > 1) {
//           setUserList(userData.user);
//           setIsUserSelectionPending(true);
//           handleOpenUserDialog();
//           return;
//         } else if (userData && userData.user && userData.user.length === 1) {
//           // Auto-select if only one user
//           localStorage.setItem("selectedUser", JSON.stringify(userData.user[0]));
//           localStorage.removeItem("pendingUserEmail");
//         } else {
//           // No users found or error
//           localStorage.removeItem("pendingUserEmail");
//         }
//       } catch (error) {
//         console.error("Error processing pending user selection:", error);
//         localStorage.removeItem("pendingUserEmail");
//       }
//     }

//     const url = `${LOGIN_API}/common/clientlogin/verifytokenforclient`;
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//     });

//     const data = await res.json();
    
//     if (data.message === "Invalid token") {
//       navigate("/client/login");
//     } else {
//       setLoginData(data);
//       setloginsData(data.user.id);

//       if (data.user.role?.toLowerCase() === "client") {
//         fetchUserData(data.user.id);
//       } else {
//         navigate("/client/login");
//       }
//     }
//   };
//   useEffect(() => {
//     DashboardValid();
//     setData(true);
//   }, []);
  
//   const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
//   return (
//     // <AppTheme {...props}>
//     //   <CssBaseline enableColorScheme />
//     //   <Box sx={{ display: "flex" }}>
//     //     <SideMenu
//     //       collapsed={sideMenuCollapsed}
//     //       onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
//     //     />

//     //     <AppNavbar />

//     //     {/* Main content */}
//     //     <Box component="main" sx={{ width: "100%" }}>
//     //       <Box
//     //         sx={{
//     //           alignItems: "center",
//     //           mx: 3,
//     //           mt: { xs: 8, md: 0 },
//     //         }}
//     //       >
//     //         <Header />
//     //       </Box>

//     //       <Box
//     //         sx={(theme) => ({
//     //           flexGrow: 1,
//     //           backgroundColor: theme.vars
//     //             ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
//     //             : alpha(theme.palette.background.default, 1),
//     //           overflow: "auto",
//     //           height: "88vh",
//     //           p: 2,
//     //           transition: theme.transitions.create("margin", {
//     //             easing: theme.transitions.easing.sharp,
//     //             duration: theme.transitions.duration.leavingScreen,
//     //           }),
//     //         })}
//     //       >
//     //         {/* User Selection Dialog */}
//     //         <Dialog
//     //           open={openUserDialog}
//     //           onClose={handleCloseUserDialog}
//     //           fullWidth
//     //           maxWidth="sm"
//     //         >
//     //           <DialogTitle>Select User Account</DialogTitle>
//     //           <DialogContent dividers>
//     //             <Stack spacing={2}>
//     //               {userList.map((user) => (
//     //                 <Button
//     //                   key={user._id}
//     //                   variant={selectedUser && selectedUser._id === user._id ? "contained" : "outlined"}
//     //                   onClick={() => handleUserSelect(user)}
//     //                   fullWidth
//     //                 >
//     //                   {user.accountName
//     //                     ? `${user.accountName} `
//     //                     : `${user.username} (${user.role})`}
//     //                 </Button>
//     //               ))}
//     //             </Stack>
//     //           </DialogContent>
//     //           <DialogActions>
//     //             <Button onClick={handleCloseUserDialog}>Cancel</Button>
//     //           </DialogActions>
//     //         </Dialog>
            
//     //         {/* Only show Outlet if no user selection is pending */}
//     //         {!openUserDialog && <Outlet />}
//     //       </Box>
//     //     </Box>
//     //   </Box>
//     // </AppTheme>
//       <AppTheme {...props}>
//       <CssBaseline enableColorScheme />
//       <Box sx={{ display: "flex" }}>
//         <SideMenu
//           collapsed={sideMenuCollapsed}
//           onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
//         />

//         <AppNavbar />

//         {/* Main content */}
//         <Box component="main" sx={{ width: "100%" }}>
//           <Box
//             sx={{
//               alignItems: "center",
//               mx: 3,
//               mt: { xs: 8, md: 0 },
//             }}
//           >
//             <Header />
//           </Box>

//           <Box
//             sx={(theme) => ({
//               flexGrow: 1,
//               backgroundColor: theme.vars
//                 ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
//                 : alpha(theme.palette.background.default, 1),
//               overflow: "auto",
//               height: "88vh",
//               p: 2,
//               transition: theme.transitions.create("margin", {
//                 easing: theme.transitions.easing.sharp,
//                 duration: theme.transitions.duration.leavingScreen,
//               }),
//             })}
//           >
//             {/* User Selection Dialog */}
//             <Dialog
//               open={openUserDialog}
//               onClose={handleCloseUserDialog}
//               fullWidth
//               maxWidth="sm"
//             >
//               <DialogTitle>Select User Account</DialogTitle>
//               <DialogContent dividers>
//                 <Typography variant="body2" sx={{ mb: 2 }}>
//                   Your email is associated with multiple accounts. Please select which account you want to access:
//                 </Typography>
//                 <Stack spacing={2}>
//                   {userList.map((user) => (
//                     <Button
//                       key={user._id}
//                       variant={selectedUser && selectedUser._id === user._id ? "contained" : "outlined"}
//                       onClick={() => handleUserSelect(user)}
//                       fullWidth
//                       sx={{ py: 1.5 }}
//                     >
//                       {user.accountName
//                         ? `${user.accountName} (${user.role})`
//                         : `${user.username} (${user.role})`}
//                     </Button>
//                   ))}
//                 </Stack>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseUserDialog}>Cancel</Button>
//               </DialogActions>
//             </Dialog>
            
//             {/* Only show Outlet if no user selection is pending */}
//             {!isUserSelectionPending && <Outlet />}
//           </Box>
//         </Box>
//       </Box>
//     </AppTheme>
//   );
// }
export default function Dashboard(props) {
  const navigate = useNavigate();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const { setLoginData, loginData } = useContext(LoginContext); // Added loginData

  const [data, setData] = useState(false);
  const [loginsData, setloginsData] = useState("");
  const [userList, setUserList] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isUserSelectionPending, setIsUserSelectionPending] = useState(false);

  const handleOpenUserDialog = () => setOpenUserDialog(true);
  const handleCloseUserDialog = () => setOpenUserDialog(false);

   const fetchUserData = async (id) => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url + loginsData, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("selctedid", result);
      });
  };
  const handleUserSelect = async (user) => {

    console.log("setSelectedUser",user)
    setSelectedUser(user);
    handleCloseUserDialog();
    
    // Store the selected user in localStorage
    localStorage.setItem("selectedUser", JSON.stringify(user));
    
    // Remove the pending selection flag
    localStorage.removeItem("pendingUserEmail");
    
    // Update state to reflect the selected user
    setIsUserSelectionPending(false);
    
    // Update login context with the selected user data
    if (loginData && loginData.user) {
      const updatedLoginData = {
        ...loginData,
        user: {
          ...loginData.user,
          id: user._id, // Use the selected user's ID
          username: user.accountName,
          role: user.role,
          // Add any other user properties you need
        }
      };
      setLoginData(updatedLoginData);
      
      // Also update the user ID for API calls
      setloginsData(user._id);
    }
    
    // Refresh the dashboard data
    DashboardValid();
  };

  // Function to fetch users by email
  const fetchUsersByEmail = async (email, token) => {
    try {
      const checkUserUrl = `${LOGIN_API}/common/user/client/getuserbyemail/${email}`;
      const checkUserResponse = await fetch(checkUserUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const userData = await checkUserResponse.json();
      return userData;
    } catch (error) {
      console.error("Error fetching users by email:", error);
      return null;
    }
  };

  const DashboardValid = async () => {
    let token = localStorage.getItem("clientdatatoken");

    // Check if we have a selected user in localStorage
    const storedSelectedUser = localStorage.getItem("selectedUser");
    if (storedSelectedUser) {
      try {
        const user = JSON.parse(storedSelectedUser);
        setSelectedUser(user);
        
        // Update login context with the selected user
        if (loginData && loginData.user) {
          const updatedLoginData = {
            ...loginData,
            user: {
              ...loginData.user,
              id: user._id,
              username: user.accountName,
              role: user.role,
            }
          };
          setLoginData(updatedLoginData);
          setloginsData(user._id);
        }
      } catch (error) {
        console.error("Error parsing selected user:", error);
        localStorage.removeItem("selectedUser");
      }
    }

    // Check if we have a pending user selection first
    const pendingEmail = localStorage.getItem("pendingUserEmail");
    if (pendingEmail && !storedSelectedUser) {
      try {
        // Fetch users by email
        const userData = await fetchUsersByEmail(pendingEmail, token);
        
        if (userData && userData.user && userData.user.length > 1) {
          setUserList(userData.user);
          setIsUserSelectionPending(true);
          handleOpenUserDialog();
          return;
        } else if (userData && userData.user && userData.user.length === 1) {
          // Auto-select if only one user
          const user = userData.user[0];
          localStorage.setItem("selectedUser", JSON.stringify(user));
          localStorage.removeItem("pendingUserEmail");
          
          // Update login context with the selected user
          if (loginData && loginData.user) {
            const updatedLoginData = {
              ...loginData,
              user: {
                ...loginData.user,
                id: user._id,
                username: user.accountName,
                role: user.role,
              }
            };
            setLoginData(updatedLoginData);
            setloginsData(user._id);
          }
        } else {
          // No users found or error
          localStorage.removeItem("pendingUserEmail");
        }
      } catch (error) {
        console.error("Error processing pending user selection:", error);
        localStorage.removeItem("pendingUserEmail");
      }
    }

    const url = `${LOGIN_API}/common/clientlogin/verifytokenforclient`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();
    
    if (data.message === "Invalid token") {
      navigate("/client/login");
    } else {
      // If we have a selected user, use that data instead of the default
      if (storedSelectedUser) {
        try {
          const user = JSON.parse(storedSelectedUser);
          const updatedData = {
            ...data,
            user: {
              ...data.user,
              id: user._id,
              username: user.accountName,
              role: user.role,
            }
          };
          setLoginData(updatedData);
          setloginsData(user._id);
        } catch (error) {
          console.error("Error updating login data with selected user:", error);
          setLoginData(data);
          setloginsData(data.user._id);
        }
      } else {
        setLoginData(data);
        setloginsData(data.user._id);
      }

      if (data.user.role?.toLowerCase() === "client") {
        fetchUserData(data.user.id);
      } else {
        navigate("/client/login");
      }
    }
  };
  
  useEffect(() => {
    DashboardValid();
    setData(true);
  }, []);
  
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu
          collapsed={sideMenuCollapsed}
          onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
        />

        <AppNavbar />

        {/* Main content */}
        <Box component="main" sx={{ width: "100%" }}>
          <Box
            sx={{
              alignItems: "center",
              mx: 3,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
          </Box>

          <Box
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: "auto",
              height: "88vh",
              p: 2,
              transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            })}
          >
            {/* User Selection Dialog */}
            <Dialog
              open={openUserDialog}
              onClose={handleCloseUserDialog}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Select User Account</DialogTitle>
              <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your email is associated with multiple accounts. Please select which account you want to access:
                </Typography>
                <Stack spacing={2}>
                  {userList.map((user) => (
                    <Button
                      key={user._id}
                      variant={selectedUser && selectedUser._id === user._id ? "contained" : "outlined"}
                      onClick={() => handleUserSelect(user)}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      {user.accountName
                        ? `${user.accountName} (${user.role})`
                        : `${user.username} (${user.role})`}
                    </Button>
                  ))}
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseUserDialog}>Cancel</Button>
              </DialogActions>
            </Dialog>
            
            {/* Only show Outlet if no user selection is pending */}
            {!isUserSelectionPending && <Outlet />}
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}