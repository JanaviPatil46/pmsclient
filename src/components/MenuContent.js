
// import * as React from "react";
// import {
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Stack,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import AppTheme from "../shared-theme/AppTheme";
// import HomeFilledIcon from "@mui/icons-material/Home";
// import DescriptionIcon from "@mui/icons-material/Description";
// import TelegramIcon from "@mui/icons-material/Telegram";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import ArticleIcon from "@mui/icons-material/Article";
// import PaymentsIcon from "@mui/icons-material/Payments";
// import SettingsIcon from "@mui/icons-material/Settings";


// export default function MenuContent(props) {
//   const iconMapping = {
//     HomeFilledIcon: HomeFilledIcon,
//     DescriptionIcon: DescriptionIcon,
//     TelegramIcon: TelegramIcon,
//     EventNoteIcon: EventNoteIcon,
//     ArticleIcon: ArticleIcon,
//     PaymentsIcon: PaymentsIcon,
//     SettingsIcon: SettingsIcon,
//   };
  
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [menuItems, setMenuItems] = React.useState([]);

//   React.useEffect(() => {
//     fetch("http://127.0.0.1/clientsidebar/")
//       .then((res) => res.json())
//       .then((data) => setMenuItems(data))
//       .catch((err) => console.error("Failed to fetch menu:", err));
//   }, []);

  

//   const renderMenuItem = (item) => {
//     const isActive =
//       location.pathname === item.path ||
//       location.pathname.startsWith(item.path + "/");
//       const IconComponent = iconMapping[item.icon];
//     return (
//       <ListItem key={item._id} disablePadding sx={{ display: "block" }}>
//         <ListItemButton
//           selected={isActive}
//           onClick={() => navigate(item.path)}
//           sx={{ borderRadius: 2,mb:1.2 }}
//         >
         
//           <ListItemText primary={item.label} sx={{ color: "text.menu" }} />
//         </ListItemButton>
//       </ListItem>
//     );
//   };

//   return (
//     <AppTheme {...props}>
//       <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
//         <List dense>{menuItems.map(renderMenuItem)}</List>
//       </Stack>
//     </AppTheme>
//   );
// }


import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AppTheme from "../shared-theme/AppTheme";
import HomeFilledIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import TelegramIcon from "@mui/icons-material/Telegram";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ArticleIcon from "@mui/icons-material/Article";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";

export default function MenuContent({ collapsed }) {
  const iconMapping = {
    HomeFilledIcon: HomeFilledIcon,
    DescriptionIcon: DescriptionIcon,
    TelegramIcon: TelegramIcon,
    EventNoteIcon: EventNoteIcon,
    ArticleIcon: ArticleIcon,
    PaymentsIcon: PaymentsIcon,
    SettingsIcon: SettingsIcon,
  };
  
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = React.useState([]);
const SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL
  React.useEffect(() => {
    fetch(`${SIDEBAR_API}/clientsidebar/`)
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  const renderMenuItem = (item) => {
    const isActive =
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/");
    const IconComponent = iconMapping[item.icon];
    
    return (
      <Tooltip 
        title={collapsed ? item.label : ""} 
        placement="right"
        key={item._id}
      >
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            selected={isActive}
            onClick={() => navigate(item.path)}
            sx={{ 
              borderRadius: 2,
              mb: 1.2,
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
              // color: 'text.menu',
    // '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            {IconComponent && (
              <ListItemIcon 
                sx={{ 
                  // color: "text.menu",
                  minWidth: 0,
                  mr: collapsed ? 'auto' : 3,
                  justifyContent: 'center',
                }}
              >
                <IconComponent />
              </ListItemIcon>
            )}
            {!collapsed && (
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  // color: "text.menu",
                  opacity: collapsed ? 0 : 1,
                  transition: 'opacity 0.2s',
                }} 
              />
            )}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    );
  };

  return (
    <AppTheme>
      <Stack sx={{ 
        flexGrow: 1, 
        p: 1, 
        justifyContent: "space-between",
        overflow: 'hidden',
      }}>
        <List dense sx={{ overflow: 'hidden' }}>
          {menuItems.map(renderMenuItem)}
        </List>
      </Stack>
    </AppTheme>
  );
}