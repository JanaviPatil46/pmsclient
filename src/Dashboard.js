
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import AppTheme from "./shared-theme/AppTheme";
import { Outlet, useNavigate } from "react-router-dom";
import { LoginContext } from "./context/Context";
import api from "./utils/api"; 
import axios from "axios";
export default function Dashboard(props) {
  const navigate = useNavigate();
  const { setLoginData } = useContext(LoginContext);
const [loading, setLoading] = useState(true);
  // const [data, setData] = useState(false);
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);

   useEffect(() => {
    validateSession();
  }, []);

  const validateSession = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const accountId = sessionStorage.getItem("accountId");

      if (!token || !accountId) {
        sessionStorage.clear();
        return navigate("/client/login");
      }

      const res = await api.get("/api/client/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          accountId: accountId
        }
      });

      setLoginData(res.data.user);
      setLoading(false);
    } catch (error) {
      // 401/403 auto-logout is already handled by interceptor
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}></div>;

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
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
