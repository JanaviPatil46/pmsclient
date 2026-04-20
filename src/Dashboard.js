
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
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

  if (loading) return <div className="p-10"></div>;

  return (
    <div className="flex">
      <SideMenu
        collapsed={sideMenuCollapsed}
        onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
      />
      <AppNavbar />

      {/* Main content */}
      <main className="w-full">
        <div className="flex items-center mx-3 mt-8 md:mt-0">
          <Header />
        </div>

        <div className="flex-1 bg-background overflow-auto h-[88vh] p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
