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
import axios from "axios";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { LoginContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "material-react-toastify";
import MenuButton from "./MenuButton";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
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
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const navigate = useNavigate();

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
        `https://www.snptaxes.com/api/accounts/${accountIdToFetch}`,
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
            alt={accountInfo?.accountName || "Account"}
            // src={profilePicture}
          />

          <Box sx={{ mr: "auto" }}>
            {/* ✅ Account Info Section */}
            {accountInfo ? (
              <>
            
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: "16px" }}
                >
                  {truncate(accountInfo?.accountName)}
                </Typography>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {truncate(email)}
                </Typography>
              </>
            ) : (
              <Typography
                variant="caption"
                sx={{ color: "text.secondary" }}
              ></Typography>
            )}
          </Box>

          <OptionsMenu email={email} />
        </Stack>
      ) : (
        <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Tooltip
            title={
              accountInfo
                ? `${accountInfo.accountName} • ${accountInfo.clientType}`
                : "No account info"
            }
            placement="right"
          >
            <Avatar
              sx={{ width: 36, height: 36, mx: "auto" }}
              alt={accountInfo?.accountName || "Account"}
              // src={profilePicture}
            />
          </Tooltip>
        </Box>
      )}
    </Drawer>
  );
}
