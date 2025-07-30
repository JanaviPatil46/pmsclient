import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { Box, Divider, Badge } from "@mui/material";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import AddIcon from "@mui/icons-material/Add";
import Search from "./Search";
import SecondSidebar from "./SecondSidebar";
import ThirdSidebar from "./ThirdSidebar";
import { IoNotifications } from "react-icons/io5";
import { color } from "framer-motion";
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
    <Box>
      <Stack
        direction="row"
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          maxWidth: { sm: "100%", md: "1700px" },
          pt: 3,
          mb: 2.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />

        <Stack direction="row" sx={{ gap: 1 }}>
          {/* <MenuButton  aria-label="menu" onClick={toggleNewDrawer(true)}>
        <AddIcon /> 
      </MenuButton> */}
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
          {/* <CustomDatePicker /> */}
          {/* <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon sx={{color: "text.menu"}} fontSize="medium"/>
           
          </MenuButton> */}

          <Badge
            badgeContent={4}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#FFA500", // Dark yellow (orange)
                color: "#000000", // Black text for contrast
              },
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuButton aria-label="Open notifications">
              <NotificationsRoundedIcon fontSize="medium" />
            </MenuButton>
          </Badge>
          <Stack sx={{ ml: 1 }}>
            {" "}
            <ColorModeIconDropdown />
          </Stack>
        </Stack>
      </Stack>
      <Divider />
    </Box>
  );
}

// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import Typography from '@mui/material/Typography';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
// import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
// import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
// import Stack from '@mui/material/Stack';
// import NavbarBreadcrumbs from './NavbarBreadcrumbs';
// import MenuButton from './MenuButton';
// import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
// import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
// import CustomDatePicker from './CustomDatePicker';
// import Search from './Search';
// const routeInfo = {
//   '/': { text: 'Home', icon: <HomeRoundedIcon /> },
//   '/analytics': { text: 'Analytics', icon: <AnalyticsRoundedIcon /> },
//   '/clients': { text: 'Clients', icon: <PeopleRoundedIcon /> },
//   '/tasks': { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
// };

// export default function Header() {
//   const location = useLocation();
//   const current = routeInfo[location.pathname] || { text: '', icon: null };

//   return (
//     <Stack
//       direction="row"
//       alignItems="center"
//       spacing={1}
//       sx={{
//         backgroundColor: 'background.default',
//         px: 2,
//         py: 1,
//         width: '100%',
//         borderRadius: 2,
//       }}
//     >

//       <NavbarBreadcrumbs />
//       <Stack direction="row" sx={{ gap: 1 }}>
//         <Search />
//         <CustomDatePicker />
//         <MenuButton showBadge aria-label="Open notifications">
//           <NotificationsRoundedIcon />
//         </MenuButton>
//         <ColorModeIconDropdown />
//       </Stack>
//     </Stack>
//   );
// }
