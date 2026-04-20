import * as React from "react";
import { Bell } from "lucide-react";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import Search from "./Search";
import SecondSidebar from "./SecondSidebar";
import ThirdSidebar from "./ThirdSidebar";
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
    <div>
      <div className="hidden md:flex flex-row w-full items-center justify-between max-w-[1700px] pt-3 mb-[10px] gap-4">
        <NavbarBreadcrumbs />

        <div className="flex flex-row items-center gap-1">
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

          <Search />

          <div className="relative">
            <MenuButton aria-label="Open notifications">
              <Bell size={20} />
            </MenuButton>
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-warning text-warning-foreground text-[10px] font-semibold flex items-center justify-center px-1 pointer-events-none">
              4
            </span>
          </div>
        </div>
      </div>
      <hr className="border-border" />
    </div>
  );
}
