import * as React from "react";
import { useContext, useState, useEffect, useRef } from "react";
import { LogOut, MoreVertical, ArrowLeftRight, X, Check, Settings } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/Context";
import { toast } from "material-react-toastify";

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
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const [menuPos, setMenuPos] = useState(null);
  const menuOpen = Boolean(menuPos);

  const openMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ bottom: window.innerHeight - rect.top + 6, right: window.innerWidth - rect.right });
  };
  const closeMenu = () => setMenuPos(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        aria-label="Open menu"
        onClick={openMenu}
        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 shrink-0"
      >
        <MoreVertical size={15} />
      </button>

      {/* Dropdown menu — fixed portal, opens upward */}
      {menuOpen && menuPos && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            bottom: menuPos.bottom,
            right: menuPos.right,
            zIndex: 9999,
            animation: "fadeInUp 0.15s ease-out both",
          }}
          className="w-48 rounded-xl border border-border bg-card shadow-2xl py-1.5 overflow-hidden"
        >
          {/* Profile section */}
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Account</p>
          </div>

          <button
            disabled={accounts.length <= 1}
            onClick={() => { closeMenu(); setOpenSwitchDialog(true); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-muted transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed rounded-none"
          >
            <ArrowLeftRight size={13} className="text-muted-foreground shrink-0" />
            <span>Switch Account</span>
          </button>

          <button
            onClick={() => { closeMenu(); navigate("/client/settings"); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-muted transition-colors duration-150"
          >
            <Settings size={13} className="text-muted-foreground shrink-0" />
            <span>Settings</span>
          </button>

          <hr className="border-border my-1" />

          <button
            onClick={() => { closeMenu(); logoutuser(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-destructive hover:bg-destructive/10 transition-colors duration-150"
          >
            <LogOut size={13} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Switch Account modal */}
      {openSwitchDialog && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">Switch Account</h2>
              <button
                onClick={() => setOpenSwitchDialog(false)}
                className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-4 space-y-2 max-h-72 overflow-y-auto">
              {accounts.length > 1 ? (
                accounts.map((acc) => {
                  const isCurrent = selectedAccount === acc._id;
                  return (
                    <button
                      key={acc._id}
                      onClick={() => !isCurrent && handleSwitchAccount(acc._id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        isCurrent
                          ? "bg-primary/10 border-primary/30 text-primary cursor-default"
                          : "border-border text-foreground hover:bg-muted cursor-pointer"
                      }`}
                    >
                      <span className="truncate">{acc.accountName}</span>
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-[10px] text-primary shrink-0">
                          <Check size={11} /> Current
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No other accounts available
                </p>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-5 py-3 border-t border-border flex justify-end">
              <button
                onClick={() => setOpenSwitchDialog(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}