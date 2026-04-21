import * as React from "react";
import { Bell } from "lucide-react";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import Search from "./Search";
import SecondSidebar from "./SecondSidebar";
import ThirdSidebar from "./ThirdSidebar";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
export default function Header() {
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
    <div className="font-sans w-full sticky top-0 z-30 bg-background/80 backdrop-blur-md">
      <div className="hidden md:flex flex-row w-full items-center justify-between max-w-[1700px] py-2.5 gap-4">
        {/* Left: breadcrumbs */}
        <NavbarBreadcrumbs />

        {/* Right: toolbar */}
        <div className="flex flex-row items-center gap-2">
          <SecondSidebar
            open={openNewDrawer}
            toggleDrawer={toggleNewDrawer}
            onMenuItemClick={handleMenuItemClick}
          />

          <ThirdSidebar
            open={!!activeMenuItem}
            toggleDrawer={() => setActiveMenuItem(null)}
            title={activeMenuItem}
          />

          {/* Search */}
          <Search />

          {/* Divider */}
          <div className="h-5 w-px bg-border shrink-0" />

          {/* Theme toggle */}
          <ColorModeIconDropdown />

          {/* Notification bell */}
          <div className="relative shrink-0">
            <button
              aria-label="Open notifications"
              className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Bell size={17} strokeWidth={1.8} />
            </button>
            {/* Badge */}
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1 pointer-events-none ring-2 ring-background">
              4
            </span>
          </div>
        </div>
      </div>
      <hr className="border-border" />
    </div>
  );
}
