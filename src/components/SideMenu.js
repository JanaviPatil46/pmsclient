// import * as React from 'react';
// import { useEffect,useContext,useState } from "react";
// import { styled } from '@mui/material/styles';
// import Avatar from '@mui/material/Avatar';
// import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
// import Box from '@mui/material/Box';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import SelectContent from './SelectContent';
// import MenuContent from './MenuContent';
// import CardAlert from './CardAlert';
// import OptionsMenu from './OptionsMenu';
// import { LoginContext } from "../context/Context";

// const drawerWidth = 240;

// const Drawer = styled(MuiDrawer)({
//   width: drawerWidth,
//   flexShrink: 0,
//   boxSizing: 'border-box',
//   mt: 10,
//   [`& .${drawerClasses.paper}`]: {
//     width: drawerWidth,
//     boxSizing: 'border-box',
//   },
// });

// export default function SideMenu() {
//   const { logindata, setLoginData } = useContext(LoginContext);
//   const [loginuser, setLoginUser] = useState("");
//   const [userData, setUserData] = useState("");
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUser(logindata.user.id);
//     }
//   }, [logindata]);

//   useEffect(() => {
//     if (loginuser) {
//       fetchUserData(loginuser);
//     }
//   }, [loginuser]);

//   const truncateString = (str, maxLength) => {
//     if (str && str.length > maxLength) {
//       return str.substring(0, maxLength) + "...";
//     }
//     return str;
//   };

//   const fetchUserData = async (id) => {
//     const maxLength = 15;
//     const myHeaders = new Headers();

//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };

//     const url = `http://127.0.0.1/common/user/${id}`;

//     try {
//       const response = await fetch(url, requestOptions);
//       const result = await response.json();
//       console.log("id", result);

//       if (result.email) {
//         setUserData(truncateString(result.email, maxLength));
//       }
//       setUsername(result.username);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   return (
//     <Drawer
//       variant="permanent"
// sx={{
//   display: { xs: 'none', md: 'block' },
//   [`& .${drawerClasses.paper}`]: {
//     backgroundColor: 'background.paper',
//   },
// }}
//     >
//       <Box
//         sx={{
//           display: 'flex',
//           mt: 'calc(var(--template-frame-height, 0px) + 4px)',
//           p: 1.5,
//         }}
//       >
//         <SelectContent />
//       </Box>
//       <Divider />
//       <Box
//         sx={{
//           overflow: 'auto',
//           height: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <MenuContent />
//         {/* <CardAlert /> */}
//       </Box>
//       <Stack
//         direction="row"
//         sx={{
//           p: 2,
//           gap: 1,
//           alignItems: 'center',
//           borderTop: '1px solid',
//           borderColor: 'divider',
//         }}
//       >
//         <Avatar
//           sizes="small"
//           alt="Riley Carter"
//           // src="/static/images/avatar/7.jpg"
//           sx={{ width: 36, height: 36 }}
//         />
//         <Box sx={{ mr: 'auto' }}>
//           <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
//             {username}
//           </Typography>
//           <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//             {userData}
//           </Typography>
//         </Box>
//         <OptionsMenu />
//       </Stack>
//     </Drawer>
//   );
// }

import * as React from "react";
import { useEffect, useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Button, Paper } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Tooltip from "@mui/material/Tooltip";
import { drawerClasses } from "@mui/material/Drawer";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { LoginContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "material-react-toastify";
import MenuButton from "./MenuButton";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
// import Logo from "../Images/snplogo.png";
import Logo from "../Images/snplogo-removebg-preview.png";
const drawerWidth = 240;
const collapsedWidth = 72;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})(({ theme, collapsed }) => ({
  width: collapsed ? collapsedWidth : drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  mt: 10,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  "& .MuiDrawer-paper": {
    width: collapsed ? collapsedWidth : drawerWidth,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SideMenu() {
   const LOGIN_API = process.env.REACT_APP_USER_LOGIN
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loginuser, setLoginUser] = useState("");
  const [userData, setUserData] = useState("");
  const [userEmail,setUserEmail]=useState("")
  const [username, setUsername] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUser(logindata.user.id);
    }
  }, [logindata]);

  useEffect(() => {
    if (loginuser) {
      fetchUserData(loginuser);
    }
  }, [loginuser]);
   useEffect(() => {
    if (loginuser) {
      fetchAccountId();
    }
  }, [loginuser]);
   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const fetchAccountId = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${loginuser}`,
        requestOptions
      );
      const result = await response.json();
      console.log("result", result);
      // if (result.accounts && result.accounts.length > 0) {
      //   setAccountId(result.accounts[0]._id); // ✅ Setting accountId
      // }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  const fetchUserData = async (id) => {
    const maxLength = 15;
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const url = `${LOGIN_API}/common/user/${id}`;

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("users detials", result);
      if (result.email) {
        setUserData(truncateString(result.email, maxLength));
        setUserEmail(result.email)

      }
      // setUsername(result.username);
      setUsername(truncateString(result.username, maxLength))
      // Construct proper profile picture URL
      if (result.profilePicture) {
        // Remove the 'uploads/' prefix since your static route already handles it
        const imagePath = result.profilePicture.replace("uploads/", "");
        const fullImageUrl = `${LOGIN_API}/profilepicture/${imagePath}`;
        setProfilePicture(fullImageUrl);
        console.log("image url", fullImageUrl);
      } else {
        setProfilePicture(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const navigate = useNavigate();
  const logoutuser = async () => {
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
  return (
    <Drawer
      variant="permanent"
      collapsed={collapsed}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
   
      <Box
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          p: 1,
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <img
              src={Logo} // Replace with your logo path
              alt="Company Logo"
              style={{ height: 60 }} // Adjust height as needed
            />
          </Box>
        )}
        {/* title={collapsed ? "Expand" : "Collapse"} */}
        <Tooltip placement="right">
          <Box
            onClick={toggleCollapse}
            sx={{
              cursor: "pointer",
              backgroundColor: "info.main",
              // padding: '2px',
              textAlign: "center",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {collapsed ? (
              <ChevronRightIcon sx={{ color: "white", fontSize: "1.8rem" }} />
            ) : (
              <ChevronLeftIcon sx={{ color: "white", fontSize: "1.8rem" }} />
            )}
          </Box>
        </Tooltip>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent collapsed={collapsed} />
      </Box>
{collapsed && (
  <Stack sx={{ p: 2 }}>
    <MenuButton>
      <SwitchAccountIcon />
    </MenuButton>
  </Stack>
)}
      {collapsed && (
        <Stack sx={{ p: 2 }}>
          <MenuButton onClick={logoutuser}>
            <LogoutRoundedIcon />
          </MenuButton>
        </Stack>
      )}
      {!collapsed ? (
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt={username || "User"}
            src={profilePicture}
          />
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px" }}
            >
              {username}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {userData}
            </Typography>
          </Box>
          <OptionsMenu  email={userEmail}/>
        </Stack>
      ) : (
        <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Tooltip title={username} placement="right">
            <Avatar
              sx={{ width: 36, height: 36, mx: "auto" }}
              alt={username || "User"}
              src={profilePicture}
            />
          </Tooltip>
        </Box>
      )}

      
    </Drawer>
  );
}
