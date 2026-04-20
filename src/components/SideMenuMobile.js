import * as React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useContext, useState } from "react";
import { LogOut, Bell, User } from 'lucide-react';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import axios from 'axios';
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
  const avatarSrc = accountInfo?.profilePicture
    ? `https://www.snptaxes.com/${accountInfo.profilePicture}`
    : null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[1300] bg-black/50"
          onClick={toggleDrawer(false)}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed left-0 top-0 h-full z-[1301] flex flex-col bg-card border-r border-border shadow-xl transition-transform duration-300 ease-in-out font-sans ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ maxWidth: "80dvw", width: 280 }}
      >
        {/* Header: avatar + name + bell */}
        <div className="flex items-center gap-3 px-3 h-14 shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-primary/20">
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
                : <User size={14} className="text-primary" />}
            </div>
            <div className="min-w-0">
              {accountInfo ? (
                <>
                  <p className="text-[13px] font-semibold text-foreground truncate leading-tight">
                    {truncate(accountInfo.accountName)}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate leading-tight">
                    {truncate(email)}
                  </p>
                </>
              ) : null}
            </div>
          </div>
          <MenuButton showBadge>
            <Bell size={17} />
          </MenuButton>
        </div>

        <hr className="border-border" />

        {/* Nav content */}
        <div className="flex-1 overflow-y-auto px-1.5 scrollbar-sidebar">
          <MenuContent />
        </div>

        <hr className="border-border" />

        <CardAlert />

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={logoutuser}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
