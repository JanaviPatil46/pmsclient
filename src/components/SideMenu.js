import * as React from "react";
import { useEffect, useContext, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, User, ArrowLeftRight } from "lucide-react";
import axios from "axios";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { LoginContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "material-react-toastify";
import MenuButton from "./MenuButton";
import Logo from "../Images/snplogo-removebg-preview.png";

const drawerWidth = 240;
const collapsedWidth = 72;

export default function SideMenu({ collapsed: collapsedProp, onCollapseToggle }) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;

  const toggleCollapse = () => {
    if (onCollapseToggle) {
      onCollapseToggle();
    } else {
      setInternalCollapsed((v) => !v);
    }
  };
  const navigate = useNavigate();

  // const [accounts, setAccounts] = useState(() => {
  //   const savedAccounts = sessionStorage.getItem("accounts");
  //   return savedAccounts ? JSON.parse(savedAccounts) : [];
  // });
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

  const avatarSrc = accountInfo?.profilePicture
    ? `https://www.snptaxes.com/${accountInfo.profilePicture}`
    : null;

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen bg-card border-r border-border z-40 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out shadow-sm font-sans"
      style={{ width: collapsed ? collapsedWidth : drawerWidth }}
    >
      {/* ── Header ── */}
      <div className={`flex items-center px-3 py-3 h-14 shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <img src={Logo} alt="Logo" className="h-9 object-contain shrink-0 max-w-[140px]" />
        )}
        <button
          onClick={toggleCollapse}
          title={collapsed ? "Expand" : "Collapse"}
          className="flex items-center justify-center rounded-full h-6 w-6 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 shrink-0"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      <hr className="border-border" />

      {/* ── Nav ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 scrollbar-sidebar">
        <MenuContent collapsed={collapsed} />
      </div>

      {/* ── Collapsed quick-actions ── */}
      {collapsed && (
        <div className="flex flex-col items-center gap-1 px-1.5 py-2 border-t border-border">
          <MenuButton title="Switch Account">
            <ArrowLeftRight size={15} />
          </MenuButton>
          <MenuButton onClick={logoutuser} title="Logout">
            <LogOut size={15} />
          </MenuButton>
        </div>
      )}

      {/* ── Footer ── */}
      {!collapsed ? (
        <div className="group flex items-center gap-2.5 px-3 py-3 border-t border-border hover:bg-muted/40 transition-colors duration-200 shrink-0 cursor-default">
          {/* Avatar */}
          <div
            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-primary/20"
            title={accountInfo ? `${accountInfo.accountName} • ${accountInfo.clientType}` : "Account"}
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
              : <User size={14} className="text-primary" />}
          </div>
          {/* Name + email */}
          <div className="flex-1 min-w-0">
            {accountInfo ? (
              <>
                <p className="text-[13px] font-semibold text-foreground truncate leading-tight">
                  {truncate(accountInfo.accountName)}
                </p>
                <p className="text-[11px] text-muted-foreground truncate leading-tight">
                  {truncate(email)}
                </p>
              </>
            ) : (
              <p className="text-[11px] text-muted-foreground">Loading…</p>
            )}
          </div>
          {/* 3-dot menu — visible on hover */}
          <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-150">
            <OptionsMenu email={email} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center px-1.5 py-3 border-t border-border shrink-0">
          <div
            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20 cursor-pointer hover:ring-primary/50 transition-all duration-200"
            title={accountInfo ? `${accountInfo.accountName} • ${accountInfo.clientType}` : "No account"}
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
              : <User size={14} className="text-primary" />}
          </div>
        </div>
      )}
    </aside>
  );
}
