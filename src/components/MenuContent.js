
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
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Send,
  CalendarDays,
  Newspaper,
  CreditCard,
  Settings,
} from "lucide-react";

export default function MenuContent({ collapsed }) {
  const iconMapping = {
    HomeFilledIcon: Home,
    DescriptionIcon: FileText,
    TelegramIcon: Send,
    EventNoteIcon: CalendarDays,
    ArticleIcon: Newspaper,
    PaymentsIcon: CreditCard,
    SettingsIcon: Settings,
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
      <div key={item._id} title={collapsed ? item.label : ""}>
        <button
          onClick={() => navigate(item.path)}
          className={[
            "w-full flex items-center rounded-lg mb-[6px] min-h-[48px] px-2.5 gap-3 transition-colors text-sm",
            collapsed ? "justify-center" : "justify-start",
            isActive
              ? "bg-primary/10 text-primary border-l-2 border-primary"
              : "text-foreground hover:bg-muted",
          ].join(" ")}
        >
          {IconComponent && (
            <span className="flex-shrink-0 flex items-center justify-center">
              <IconComponent size={20} />
            </span>
          )}
          {!collapsed && (
            <span className="font-medium transition-opacity duration-200">
              {item.label}
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 p-1 justify-between overflow-hidden">
      <nav className="overflow-hidden">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  );
}