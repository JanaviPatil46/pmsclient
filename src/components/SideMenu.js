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
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen bg-background border-r border-border z-40 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out"
      style={{ width: collapsed ? collapsedWidth : drawerWidth }}
    >
      {/* Header: logo + collapse toggle */}
      <div className={`flex items-center p-2 mt-1 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center ml-1">
            <img src={Logo} alt="Company Logo" className="h-14 object-contain" />
          </div>
        )}
        <button
          onClick={toggleCollapse}
          title={collapsed ? "Expand" : "Collapse"}
          className="flex items-center justify-center rounded-full bg-primary p-0.5 text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
        >
          {collapsed
            ? <ChevronRight size={22} />
            : <ChevronLeft size={22} />}
        </button>
      </div>

      <hr className="border-border" />

      {/* Nav content — scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <MenuContent collapsed={collapsed} />
      </div>

      {/* Collapsed icon actions */}
      {collapsed && (
        <div className="flex flex-col items-center gap-2 p-2">
          <MenuButton>
            <ArrowLeftRight size={18} />
          </MenuButton>
          <MenuButton onClick={logoutuser}>
            <LogOut size={18} />
          </MenuButton>
        </div>
      )}

      {/* Footer: avatar + account info (expanded) OR avatar only (collapsed) */}
      {!collapsed ? (
        <div className="flex items-center gap-2 p-3 border-t border-border">
          <div
            className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border"
            title={accountInfo ? `${accountInfo.accountName} • ${accountInfo.clientType}` : "Account"}
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
              : <User size={16} className="text-muted-foreground" />}
          </div>
          <div className="flex-1 min-w-0 mr-auto">
            {accountInfo ? (
              <>
                <p className="text-xs font-semibold text-foreground truncate leading-4">
                  {truncate(accountInfo.accountName)}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {truncate(email)}
                </p>
              </>
            ) : null}
          </div>
          <OptionsMenu email={email} />
        </div>
      ) : (
        <div className="flex justify-center p-2 border-t border-border">
          <div
            className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border"
            title={accountInfo ? `${accountInfo.accountName} • ${accountInfo.clientType}` : "No account info"}
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
              : <User size={16} className="text-muted-foreground" />}
          </div>
        </div>
      )}
    </aside>
  );
}
