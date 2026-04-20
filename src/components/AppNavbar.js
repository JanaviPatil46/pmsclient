import * as React from "react";
import { Menu as MenuIcon, LayoutDashboard } from "lucide-react";
import SideMenuMobile from "./SideMenuMobile";
import MenuButton from "./MenuButton";
import SecondSidebar from "./SecondMobileSidebar";
import ThirdSidebar from "./ThirdSidebarMobile";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const [openNewDrawer, setOpenNewDrawer] = React.useState(false);
const [activeMenuItem, setActiveMenuItem] = React.useState(null);

const toggleNewDrawer = (open) => () => {
  setOpenNewDrawer(open);
  if (!open) setActiveMenuItem(null); // Reset on close
};

const handleMenuItemClick = (itemText) => {
  setActiveMenuItem(itemText); // Set current menu item
};

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="w-full p-3 flex flex-col items-start justify-center gap-3 shrink-0">
        <div className="flex flex-row items-center w-full gap-2">
          <div className="flex flex-row items-center justify-center mr-auto gap-2">
            <NavbarBreadcrumbs />
          </div>
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon size={20} />
          </MenuButton>
          <SecondSidebar
            open={openNewDrawer}
            toggleDrawer={toggleNewDrawer}
            onMenuItemClick={handleMenuItemClick}
          />
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </div>
      </div>
    </header>
  );
}

export function CustomIcon() {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center self-center border"
      style={{
        backgroundImage:
          "linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)",
        color: "hsla(210, 100%, 95%, 0.9)",
        borderColor: "hsl(210, 100%, 55%)",
        boxShadow: "inset 0 2px 5px rgba(255, 255, 255, 0.3)",
      }}
    >
      <LayoutDashboard size={14} />
    </div>
  );
}
