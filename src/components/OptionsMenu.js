import * as React from "react";

import { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "./MenuButton";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/Context";
import { toast } from "material-react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

// export default function OptionsMenu({ email }) {
//   console.log("{email}", email);
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const { logindata, setLoginData } = useContext(LoginContext);
//   const [openSwitchDialog, setOpenSwitchDialog] = React.useState(false);
//   const [accountUsers, setAccountUsers] = React.useState([]); // list of users for switching
//   const [userList, setUserList] = React.useState([]);
//   const navigate = useNavigate();
//   const logoutuser = async () => {
//     let token = localStorage.getItem("clientdatatoken");
//     const url = `${LOGIN_API}/common/clientlogin/logout/`;

//     const requestOptions = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//     };

//     const res = await fetch(url, requestOptions);

//     const data = await res.json();

//     if (data.status === 200) {
//       console.log("user logout");
//       localStorage.removeItem("clientdatatoken");
//       Cookies.remove("clientuserToken");
//       localStorage.removeItem("selectedUser");
//           localStorage.removeItem("pendingUserEmail");
//       setLoginData(false);

//       navigate("/client/login");
//       toast.success("Logout Successfully");
//     } else {
//       console.log("error");
//     }
//   };
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   // state
// const [canSwitch, setCanSwitch] = React.useState(false); 
//   const checkEmailForUsers = async (email) => {
//     console.log(" checkEmailForUsers(email); ", email);
//     if (!email || !email.includes("@")) return;

//     try {
//       const checkUserUrl = `${LOGIN_API}/common/user/client/getuserbyemail/${email}`;
//       const checkUserResponse = await fetch(checkUserUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       const userData = await checkUserResponse.json();
//       console.log("userlist", userData);

//       if (userData.user && userData.user.length > 1) {
//         // multiple users
//         setAccountUsers(userData.user); // ✅ store whole array
//         return true;
//       } else if (userData.user && userData.user.length === 1) {
//         // single user
//         setAccountUsers(userData.user); // ✅ still array
//         return false;
//       } else {
//         toast.error("User not found");
//         setAccountUsers([]); // ✅ reset
//         return false;
//       }
//     } catch (error) {
//       console.error("Error checking users:", error);
//       setAccountUsers([]);
//       return false;
//     }
//   };
// // ✅ run check when email changes
// React.useEffect(() => {
//   const fetchAndSet = async () => {
//     const hasUsers = await checkEmailForUsers(email);
//     setCanSwitch(hasUsers);
//   };
//   fetchAndSet();
// }, [email]);
  
//   const handleSwitchAccount = async (user) => {
//     try {
//       const expiryTime = 8 * 60 * 60;
//       const switchUrl = `${LOGIN_API}/common/clientlogin/generatetokenforclient`;

//       // Build payload like in handleSubmit
//       const switchPayload = {
//         email: user.email,
//         password: "", // no password needed because already logged in
//         expiryTime,
//         username: user.username,
//         userId: user._id,
//       };

//       console.log("Switch payload:", switchPayload);

//       const switchResponse = await fetch(switchUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(switchPayload),
//       });

//       console.log("Switch response status:", switchResponse.status);

//       const switchResult = await switchResponse.json();
//       console.log("Full switch response:", switchResult);

//       if (switchResult.status === 200) {
//         console.log("Switch successful, token received");
//         localStorage.setItem("clientdatatoken", switchResult.result.token);
//         Cookies.set("clientuserToken", switchResult.result.token);
//         // setLoginData(true);
//         // ✅ update LoginContext with the new user

//         await DashboardValid();
//         // Update context with the proper structure
//         // setLoginData({
//         //   isValid: true,
//         //   user: {
//         //     id: user._id,
//         //     email: user.email,
//         //     username: user.username,
//         //     role: user.role,
//         //     accountName: user.accountName || user.username,
//         //   },
//         //   token: switchResult.result.token,
//         // });
//         setOpenSwitchDialog(false);
//         //
//         toast.success(`Switched to ${user.accountName}`);
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//         // navigate("/client/home", { replace: true });
//       } else {
//         console.error("Switch failed:", switchResult.message);
//         toast.error(switchResult.message || "Switch failed");
//       }
//     } catch (err) {
//       console.group("Switch Error");
//       console.error("Error object:", err);
//       console.error("Error message:", err.message);
//       console.error("Stack trace:", err.stack);
//       console.groupEnd();
//       toast.error("Error switching account");
//     }
//   };
//    const [loginsData, setloginsData] = useState("");
// const fetchUserData = async (id) => {
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
// // 
//     const data = await res.json();
//     console.log("bnsvchd", data);
//     if (data.message === "Invalid token") {
//       // navigate("/client/login");
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

//   return (
//     <React.Fragment>
//       <MenuButton
//         aria-label="Open menu"
//         onClick={handleClick}
//         sx={{ borderColor: "transparent" }}
//       >
//         <MoreVertRoundedIcon />
//       </MenuButton>
//       <Menu
//         anchorEl={anchorEl}
//         id="menu"
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//         sx={{
//           [`& .${listClasses.root}`]: {
//             padding: "4px",
//           },
//           [`& .${paperClasses.root}`]: {
//             padding: 0,
//           },
//           [`& .${dividerClasses.root}`]: {
//             margin: "4px -4px",
//           },
//         }}
//       >
//         <MenuItem onClick={handleClose}>Profile</MenuItem>
//         <MenuItem onClick={handleClose}>My account</MenuItem>
//         <Divider />
//         {/* <MenuItem onClick={handleClose}>Add another account</MenuItem> */}
//         <MenuItem
         
//           disabled={!canSwitch}
//           onClick={async () => {

//     handleClose();
//     const hasUsers = await checkEmailForUsers(email);
//     if (hasUsers) {
//       setOpenSwitchDialog(true); // ✅ only open if users exist
//     }
    
//   }}
//         >
//           Switch Account
//         </MenuItem>

//         <MenuItem onClick={handleClose}>Settings</MenuItem>
//         <Divider />
//         <MenuItem
//           // onClick={handleClose}
//           onClick={logoutuser}
//           sx={{
//             [`& .${listItemIconClasses.root}`]: {
//               ml: "auto",
//               minWidth: 0,
//             },
//           }}
//         >
//           <ListItemText>Logout</ListItemText>
//           <ListItemIcon>
//             <LogoutRoundedIcon fontSize="small" />
//           </ListItemIcon>
//         </MenuItem>
//       </Menu>

//       <Dialog
//         open={openSwitchDialog}
//         onClose={() => setOpenSwitchDialog(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>Switch Account</DialogTitle>
//         <DialogContent dividers>
//           <Stack spacing={2}>
//             {/* {accountUsers.length > 0 ? (
//               accountUsers.map((user) => (
//                 <Button
//                   key={user._id}
//                   variant="outlined"
//                   fullWidth
//                   onClick={() => handleSwitchAccount(user)}
//                 >
//                   {user.accountName
//                     ? `${user.accountName} – ${user.username} (${user.role})`
//                     : `${user.username} (${user.role})`}
//                 </Button>
//               ))
//             ) : (
//               <p>No accounts available</p>
//             )} */}
//             {accountUsers.length > 0 ? (
//   accountUsers
//     .filter((user) => user._id !== logindata?.user?.id)
//  // 👈 exclude logged-in user
//     .map((user) => (
//       <Button
//         key={user._id}
//         variant="outlined"
//         fullWidth
//         onClick={() => handleSwitchAccount(user)}
//       >
//         {/* {user.accountName
//           ? `${user.accountName} – ${user.username} (${user.role})`
//           : `${user.username} (${user.role})`} */}
//            {user.accountName
//           ? `${user.accountName} `
//           : `${user.username} (${user.role})`}
//       </Button>
//     ))
// ) : (
//   <p>No accounts available</p>
// )}

//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenSwitchDialog(false)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }

export default function OptionsMenu({ email }) {
  console.log("{email}", email);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const { logindata, setLoginData } = useContext(LoginContext);
  const [openSwitchDialog, setOpenSwitchDialog] = React.useState(false);
  const [accountUsers, setAccountUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null); // Add selectedUser state
  const navigate = useNavigate();
// React.useEffect(() => {
//   const handleUnload = () => {
//     // 👇 Only clear data if NOT switching account
//     if (!sessionStorage.getItem("isSwitchingAccount")) {
//       localStorage.removeItem("clientdatatoken");
//       localStorage.removeItem("selectedUser");
//       localStorage.removeItem("pendingUserEmail");
//       Cookies.remove("clientuserToken");
//       setLoginData(false);
//     } else {
//       // Remove the flag after handling
//       sessionStorage.removeItem("isSwitchingAccount");
//     }
//   };

//   window.addEventListener("beforeunload", handleUnload);

//   return () => {
//     window.removeEventListener("beforeunload", handleUnload);
//   };
// }, [setLoginData]);

React.useEffect(() => {
  const handleUnload = (e) => {
    // Only logout if not switching account and not logging out manually
    if (!sessionStorage.getItem("isSwitchingAccount") && !sessionStorage.getItem("isManualLogout")) {
      localStorage.removeItem("clientdatatoken");
      localStorage.removeItem("selectedUser");
      localStorage.removeItem("pendingUserEmail");
      Cookies.remove("clientuserToken");
      setLoginData(false);
    } else {
      // Remove the flags after handling
      sessionStorage.removeItem("isSwitchingAccount");
      sessionStorage.removeItem("isManualLogout");
    }
  };

  window.addEventListener("beforeunload", handleUnload);

  return () => {
    window.removeEventListener("beforeunload", handleUnload);
  };
}, [setLoginData]);

  // Check if there's a selected user in localStorage on component mount
  React.useEffect(() => {
    const storedSelectedUser = localStorage.getItem("selectedUser");
    if (storedSelectedUser) {
      try {
        const user = JSON.parse(storedSelectedUser);
        setSelectedUser(user);
      } catch (error) {
        console.error("Error parsing selected user:", error);
        localStorage.removeItem("selectedUser");
      }
    }
  }, []);

  const logoutuser = async () => {
    sessionStorage.setItem("isManualLogout", "true");
    let token = localStorage.getItem("clientdatatoken");
    const url = `${LOGIN_API}/common/clientlogin/logout/`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const res = await fetch(url, requestOptions);
    const data = await res.json();

    if (data.status === 200) {
      console.log("user logout");
      localStorage.removeItem("clientdatatoken");
      Cookies.remove("clientuserToken");
      localStorage.removeItem("selectedUser");
      localStorage.removeItem("pendingUserEmail");
      setLoginData(false);

      navigate("/client/login");
      toast.success("Logout Successfully");
    } else {
      console.log("error");
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [canSwitch, setCanSwitch] = React.useState(false); 

  const checkEmailForUsers = async (email) => {
    console.log(" checkEmailForUsers(email); ", email);
    if (!email || !email.includes("@")) return;

    try {
      const checkUserUrl = `${LOGIN_API}/common/user/client/getuserbyemail/${email}`;
      const checkUserResponse = await fetch(checkUserUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const userData = await checkUserResponse.json();
      console.log("userlist", userData);

      if (userData.user && userData.user.length > 1) {
        setAccountUsers(userData.user);
        return true;
      } else if (userData.user && userData.user.length === 1) {
        setAccountUsers(userData.user);
        return false;
      } else {
        toast.error("User not found");
        setAccountUsers([]);
        return false;
      }
    } catch (error) {
      console.error("Error checking users:", error);
      setAccountUsers([]);
      return false;
    }
  };

  React.useEffect(() => {
    const fetchAndSet = async () => {
      const hasUsers = await checkEmailForUsers(email);
      setCanSwitch(hasUsers);
    };
    fetchAndSet();
  }, [email]);
  
  const handleSwitchAccount = async (user) => {
    try {
      const expiryTime = 8 * 60 * 60;
      const switchUrl = `${LOGIN_API}/common/clientlogin/generatetokenforclient`;

      const switchPayload = {
        email: user.email,
        password: "",
        expiryTime,
        username: user.username,
        userId: user._id,
      };

      console.log("Switch payload:", switchPayload);

      const switchResponse = await fetch(switchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(switchPayload),
      });

      console.log("Switch response status:", switchResponse.status);

      const switchResult = await switchResponse.json();
      console.log("Full switch response:", switchResult);

      if (switchResult.status === 200) {
        console.log("Switch successful, token received");
        localStorage.setItem("clientdatatoken", switchResult.result.token);
        Cookies.set("clientuserToken", switchResult.result.token);
        
        // Store the selected user in localStorage like in Dashboard
        localStorage.setItem("selectedUser", JSON.stringify(user));
        
        // Set the selected user in state
        setSelectedUser(user);
        
        // Update context with the new user data
        if (logindata && logindata.user) {
          const updatedLoginData = {
            ...logindata,
            user: {
              ...logindata.user,
              id: user._id,
              username: user.accountName,
              role: user.role,
              // Add any other user properties you need
            }
          };
          setLoginData(updatedLoginData);
        }
         // ✅ mark session as switching
      sessionStorage.setItem("isSwitchingAccount", "true");
        setOpenSwitchDialog(false);
        toast.success(`Switched to ${user.accountName || user.username}`);
        
        // Reload the page to reflect the changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Switch failed:", switchResult.message);
        toast.error(switchResult.message || "Switch failed");
      }
    } catch (err) {
      console.group("Switch Error");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Stack trace:", err.stack);
      console.groupEnd();
      toast.error("Error switching account");
    }
  };

  // Rest of your component remains the same...
  const [loginsData, setloginsData] = useState("");
  
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
  
  const DashboardValid = async () => {
    let token = localStorage.getItem("clientdatatoken");
    const url = `${LOGIN_API}/common/clientlogin/verifytokenforclient`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    console.log(token);
    const data = await res.json();
    console.log("bnsvchd", data);
    if (data.message === "Invalid token") {
      // navigate("/client/login");
    } else {
      setLoginData(data);
      setloginsData(data.user.id);

      if (data.user.role?.toLowerCase() === "client") {
        fetchUserData(data.user.id);
      } else {
        navigate("/client/login");
      }
    }
  };

  return (
    <React.Fragment>
      {/* Your JSX remains the same... */}
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem
          disabled={!canSwitch}
          onClick={async () => {
            handleClose();
            const hasUsers = await checkEmailForUsers(email);
            if (hasUsers) {
              setOpenSwitchDialog(true);
            }
          }}
        >
          Switch Account
        </MenuItem>

        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <Divider />
        <MenuItem
          onClick={logoutuser}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      <Dialog
        open={openSwitchDialog}
        onClose={() => setOpenSwitchDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Switch Account</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {accountUsers.length > 0 ? (
              accountUsers
                .filter((user) => user._id !== logindata?.user?.id)
                .map((user) => (
                  <Button
                    key={user._id}
                    variant={selectedUser && selectedUser._id === user._id ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => handleSwitchAccount(user)}
                  >
                    {user.accountName
                      ? `${user.accountName} `
                      : `${user.username} (${user.role})`}
                  </Button>
                ))
            ) : (
              <p>No accounts available</p>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSwitchDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}