
import * as React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import useShortcuts from "./src/hooks/useShortcuts";
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

  const kbToggleSidebar = useCallback(
    () => setSideMenuCollapsed((v) => !v),
    []
  );

  useShortcuts([
    {
      id: "dashboard_sidebar_toggle",
      keys: ["meta", "b"],
      action: kbToggleSidebar,
      scope: "global",
      description: "Toggle sidebar",
      group: "General",
    },
  ]);

  if (loading) return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] bg-card border-r border-border z-40 shrink-0 p-3 gap-3">
        <div className="flex items-center gap-3 px-2 py-3 h-14">
          <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
        </div>
        <hr className="border-border" />
        <div className="flex flex-col gap-2 pt-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
              <div className="h-4 w-4 rounded bg-muted animate-pulse shrink-0" />
              <div className={`h-3 rounded bg-muted animate-pulse ${i % 3 === 0 ? "w-20" : i % 3 === 1 ? "w-16" : "w-24"}`} />
            </div>
          ))}
        </div>
      </aside>
      {/* Main area skeleton */}
      <main className="flex flex-col flex-1 min-w-0 md:ml-[240px]">
        {/* Header skeleton */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 h-14 border-b border-border bg-background/80">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="h-3 w-3 rounded bg-muted animate-pulse" />
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
        {/* Page content skeleton */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="h-6 w-48 rounded-md bg-muted animate-pulse" />
            <div className="h-3 w-64 rounded-md bg-muted animate-pulse" />
          </div>
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border bg-muted/20">
              <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
            </div>
            <div className="divide-y divide-border/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                    <div className={`h-3 rounded bg-muted animate-pulse ${i % 2 === 0 ? "w-36" : "w-28"}`} />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

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
        <div className="hidden md:flex items-center">
          <Header />
        </div>

        <div className="flex-1 bg-background overflow-auto h-[88vh] p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
