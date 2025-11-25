import * as React from "react";

import { useContext, useState,useEffect } from "react";
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

export default function OptionsMenu({ email }) {
  console.log("{email}", email);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const { logindata, setLoginData } = useContext(LoginContext);
  const [openSwitchDialog, setOpenSwitchDialog] = React.useState(false);
  const [accountUsers, setAccountUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null); // Add selectedUser state
  const navigate = useNavigate();



  // // Check if there's a selected user in localStorage on component mount
  // React.useEffect(() => {
  //   const storedSelectedUser = sessionStorage.getItem("selectedUser");
  //   if (storedSelectedUser) {
  //     try {
  //       const user = JSON.parse(storedSelectedUser);
  //       setSelectedUser(user);
  //     } catch (error) {
  //       console.error("Error parsing selected user:", error);
  //       sessionStorage.removeItem("selectedUser");
  //     }
  //   }
  // }, []);

  // const logoutuser = async () => {
  
  //   let token = sessionStorage.getItem("clientdatatoken");
  //   const url = `${LOGIN_API}/common/clientlogin/logout/`;

  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //   };

  //   const res = await fetch(url, requestOptions);
  //   const data = await res.json();

  //   if (data.status === 200) {
  //     console.log("user logout");
  //     sessionStorage.removeItem("clientdatatoken");
  //     Cookies.remove("clientuserToken");
  //     sessionStorage.removeItem("selectedUser");
  //     sessionStorage.removeItem("pendingUserEmail");
  //     setLoginData(false);

  //     navigate("/client/login");
  //     toast.success("Logout Successfully");
  //   } else {
  //     console.log("error");
  //   }
  // };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [canSwitch, setCanSwitch] = React.useState(false); 

  // const checkEmailForUsers = async (email) => {
  //   console.log(" checkEmailForUsers(email); ", email);
  //   if (!email || !email.includes("@")) return;

  //   try {
  //     const checkUserUrl = `${LOGIN_API}/common/user/client/getuserbyemail/${email}`;
  //     const checkUserResponse = await fetch(checkUserUrl, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const userData = await checkUserResponse.json();
  //     console.log("userlist", userData);

  //     if (userData.user && userData.user.length > 1) {
  //       setAccountUsers(userData.user);
  //       return true;
  //     } else if (userData.user && userData.user.length === 1) {
  //       setAccountUsers(userData.user);
  //       return false;
  //     } else {
  //       toast.error("User not found");
  //       setAccountUsers([]);
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error checking users:", error);
  //     setAccountUsers([]);
  //     return false;
  //   }
  // };

  // React.useEffect(() => {
  //   const fetchAndSet = async () => {
  //     const hasUsers = await checkEmailForUsers(email);
  //     setCanSwitch(hasUsers);
  //   };
  //   fetchAndSet();
  // }, [email]);
  
  // const handleSwitchAccount = async (user) => {
  //   try {
  //     const expiryTime = 8 * 60 * 60;
  //     const switchUrl = `${LOGIN_API}/common/clientlogin/generatetokenforclient`;

  //     const switchPayload = {
  //       email: user.email,
  //       password: "",
  //       expiryTime,
  //       username: user.username,
  //       userId: user._id,
  //     };

  //     console.log("Switch payload:", switchPayload);

  //     const switchResponse = await fetch(switchUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(switchPayload),
  //     });

  //     console.log("Switch response status:", switchResponse.status);

  //     const switchResult = await switchResponse.json();
  //     console.log("Full switch response:", switchResult);

  //     if (switchResult.status === 200) {
  //       console.log("Switch successful, token received");
  //       sessionStorage.setItem("clientdatatoken", switchResult.result.token);
  //       Cookies.set("clientuserToken", switchResult.result.token);
        
  //       // Store the selected user in sessionStorage like in Dashboard
  //       sessionStorage.setItem("selectedUser", JSON.stringify(user));
        
  //       // Set the selected user in state
  //       setSelectedUser(user);
        
  //       // Update context with the new user data
  //       if (logindata && logindata.user) {
  //         const updatedLoginData = {
  //           ...logindata,
  //           user: {
  //             ...logindata.user,
  //             id: user._id,
  //             username: user.accountName,
  //             role: user.role,
  //             // Add any other user properties you need
  //           }
  //         };
  //         setLoginData(updatedLoginData);
  //       }
    
  //       setOpenSwitchDialog(false);
  //       toast.success(`Switched to ${user.accountName || user.username}`);
        
  //       // Reload the page to reflect the changes
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 1000);
  //     } else {
  //       console.error("Switch failed:", switchResult.message);
  //       toast.error(switchResult.message || "Switch failed");
  //     }
  //   } catch (err) {
  //     console.group("Switch Error");
  //     console.error("Error object:", err);
  //     console.error("Error message:", err.message);
  //     console.error("Stack trace:", err.stack);
  //     console.groupEnd();
  //     toast.error("Error switching account");
  //   }
  // };

  // Rest of your component remains the same...
  // const [loginsData, setloginsData] = useState("");
  
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
  
  // const DashboardValid = async () => {
  //   let token = sessionStorage.getItem("clientdatatoken");
  //   const url = `${LOGIN_API}/common/clientlogin/verifytokenforclient`;
  //   const res = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //   });

  //   console.log(token);
  //   const data = await res.json();
  //   console.log("bnsvchd", data);
  //   if (data.message === "Invalid token") {
  //     // navigate("/client/login");
  //   } else {
  //     setLoginData(data);
  //     setloginsData(data.user.id);

  //     if (data.user.role?.toLowerCase() === "client") {
  //       fetchUserData(data.user.id);
  //     } else {
  //       navigate("/client/login");
  //     }
  //   }
  // };
const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(sessionStorage.getItem('accountId'));
  // const [openSwitchDialog, setOpenSwitchDialog] = useState(false);

  useEffect(() => {
    const savedAcc = sessionStorage.getItem('accounts');
    if (savedAcc) {
      setAccounts(JSON.parse(savedAcc));
    }
  }, []);

  const handleSwitchAccount = (accountId) => {
    sessionStorage.setItem("accountId", accountId);
    setSelectedAccount(accountId);

    // Update UI or context if needed
    if (setLoginData) {
      setLoginData(prev => ({
        ...prev,
        selectedAccount: accountId
      }));
    }

    toast.success("Switched Successfully");
    setOpenSwitchDialog(false);

    // reload page to fetch new account info like dashboard
    setTimeout(() => window.location.reload(), 600);
  };

  const logoutuser = () => {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('accountId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('accounts');
      navigate("/client/login");
  toast.success("Logout Successfully");

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
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        {/* <Divider /> */}
     
<MenuItem
        disabled={accounts.length <= 1}
        onClick={() => setOpenSwitchDialog(true)}
      >
        Switch Account
      </MenuItem>
        {/* <MenuItem onClick={handleClose}>Settings</MenuItem> */}
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

      {/* <Dialog
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
      </Dialog> */}
     <Dialog open={openSwitchDialog} onClose={() => setOpenSwitchDialog(false)}>
  <DialogTitle>Switch Account</DialogTitle>
  <DialogContent dividers>
    {accounts.length > 1 ? (
      accounts.map(acc => {
        const isCurrent = selectedAccount === acc._id;
        return (
          <Button
            key={acc._id}
            fullWidth
            sx={{ mb: 1, justifyContent: "space-between" }}
            variant={isCurrent ? "contained" : "outlined"}
            // disabled={isCurrent} // prevent switching on same account
            onClick={() => !isCurrent && handleSwitchAccount(acc._id)}
          >
            {acc.accountName}
            {isCurrent && (
              <span style={{ fontSize: "12px", opacity: 0.8 }}>
                (Current)
              </span>
            )}
          </Button>
        );
      })
    ) : (
      <p>No other accounts available</p>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenSwitchDialog(false)}>Close</Button>
  </DialogActions>
</Dialog>

    </React.Fragment>
  );
}