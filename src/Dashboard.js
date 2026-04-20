
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
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const sidebarWidth = sideMenuCollapsed ? 72 : 240;

  return (
    <div className="flex min-h-screen bg-background">
      <SideMenu
        collapsed={sideMenuCollapsed}
        onCollapseToggle={() => setSideMenuCollapsed(!sideMenuCollapsed)}
      />
      <AppNavbar />

      {/* Main content — offset by sidebar width on md+ so fixed sidebar doesn't overlap */}
      <main
        className="flex flex-col flex-1 min-w-0 transition-[margin] duration-300 ease-in-out pt-14 md:pt-0"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <div className="hidden md:flex items-center px-3">
          <Header />
        </div>

        <div className="flex-1 bg-background overflow-auto h-[88vh] p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
