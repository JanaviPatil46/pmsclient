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

import { Outlet } from "react-router-dom";

export default function Dashboard(props) {
  const navigate = useNavigate();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const { setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);
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
      navigate("/client/login");
    } else {
      setLoginData(data);
      setloginsData(data.user.id);

      if (data.user.role?.toLowerCase() === "client") {
        fetchUserData(data.user.id);
        // navigate("/home");
      } else {
        navigate("/client/login");

        // }, 1000);
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
            // spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              // pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
          </Box>

          <Box
            sx={(theme) => ({
              flexGrow: 1,
              // mt:0.8,
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
