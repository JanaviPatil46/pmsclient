import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import axios from 'axios';
import { useEffect,useContext,useState } from "react";
import { LoginContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from 'material-react-toastify';
function SideMenuMobile({ open, toggleDrawer }) {
 const LOGIN_API = process.env.REACT_APP_USER_LOGIN
//   const { logindata, setLoginData } = useContext(LoginContext);
//   const [loginuser, setLoginUser] = useState("");
//   // const [userData, setUserData] = useState("");
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
  

//    const [profilePicture, setProfilePicture] = useState("")
//   const fetchUserData = async (id) => {
 
//     const myHeaders = new Headers();
    
//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };
    
//     const url = `${LOGIN_API}/common/user/${id}`;
    
//     try {
//       const response = await fetch(url, requestOptions);
//       const result = await response.json();
//       console.log("id", result);
      
     
//       setUsername(result.username);
//       if (result.profilePicture) {
//       // Remove the 'uploads/' prefix since your static route already handles it
//       const imagePath = result.profilePicture.replace('uploads/', '');
//       const fullImageUrl = `${LOGIN_API}/profilepicture/${imagePath}`;
//       setProfilePicture(fullImageUrl);
//       console.log("image url",fullImageUrl)
//     } else {
//       setProfilePicture(null);
//     }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   // const { logindata, setLoginData } = useContext(LoginContext);
//   const navigate = useNavigate();
//   const logoutuser = async () => {
//     let token = localStorage.getItem("clientdatatoken");
//     const url = `${LOGIN_API}/common/clientlogin/logout/`;

//     const requestOptions = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//         },
//     };

//     const res = await fetch(url, requestOptions);

//     const data = await res.json();

//     if (data.status === 200) {
//         console.log("user logout");
//         localStorage.removeItem("clientdatatoken");
//         Cookies.remove("clientuserToken");
//         setLoginData(false);

//         navigate("/client/login");

//         toast.success("Logout Successfully")
//     } else {
//         console.log("error");
//     }
// };
const [accounts, setAccounts] = useState(() => {
    const savedAccounts = sessionStorage.getItem("accounts");
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  });
  const [selectedAccount, setSelectedAccount] = useState(
    sessionStorage.getItem("accountId")
  );
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = sessionStorage.getItem("email");
  // const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const fetchAccountInfo = async (accountIdToFetch) => {
    setLoading(true);
    const token = sessionStorage.getItem("jwtToken");

    if (!token || !accountIdToFetch) {
      setError("No authentication or account selected");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/accounts/${accountIdToFetch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccountInfo(response.data);
      console.log("account responce", response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch account information");
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedAccount) {
      fetchAccountInfo(selectedAccount);
    }
  }, [selectedAccount]);
  const logoutuser = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("accountId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("accounts");
    // Optionally call logout API if backend session invalidation is needed
        navigate("/client/login");

  };
  const maxLength = 15;

  const truncate = (text) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            {/* <Avatar
              sizes="small"
              alt="Profile"
               src={profilePicture}
              // src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />
            <Typography component="p" variant="h6">
            {username}
            </Typography> */}
              {accountInfo ? (
              <>
            
                {/* <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: "16px" }}
                >
                  {truncate(accountInfo?.accountName)}
                </Typography> */}
                 <Avatar
              sizes="small"
              alt="Profile"
              //  src={profilePicture}
              // src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />

                 <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: "16px" }}
                >
                  {truncate(accountInfo?.accountName)}
                </Typography> 
              </>
            ) : (
              <Typography
                variant="caption"
                sx={{ color: "text.secondary" }}
              ></Typography>
            )}
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <CardAlert />
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}  onClick={logoutuser}>
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
