import * as React from "react";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import Search from "./Search";
import SecondSidebar from "./SecondSidebar";
import ThirdSidebar from "./ThirdSidebar";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import NotificationBell from "./NotificationBell";
import { useShortcutContext } from "../context/ShortcutContext";
import { Keyboard } from "lucide-react";
export default function Header() {
  const { openShortcuts } = useShortcutContext();
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
      <div className="hidden md:flex flex-row w-full items-center justify-between max-w-[1700px] px-4 sm:px-6 py-2.5 gap-4">
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

          {/* Keyboard shortcuts */}
          <button
            type="button"
            title="Keyboard Shortcuts (⌘/)"
            onClick={openShortcuts}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <Keyboard size={15} strokeWidth={1.8} />
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-border shrink-0" />

          {/* Theme toggle */}
          <ColorModeIconDropdown />

          {/* Notification bell */}
          <NotificationBell />
        </div>
      </div>
      <hr className="border-border" />
    </div>
  );
}
