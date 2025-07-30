import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import AppTheme from "../shared-theme/AppTheme"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
const mainListItems = [
  { text: "Accounts", icon: <PersonOutlineIcon />, },
  { text: "Contacts", icon: <MailOutlineIcon />, },
  { text: "Jobs", icon: <WorkOutlineIcon />,  },
];

// export default function SecondMenuContent(props) {
//   const renderMenuItem = (item) => {
//     return (
//       <AppTheme {...props}>
//       <React.Fragment key={item.text}>
//         <ListItem disablePadding sx={{ display: "block" }}>
//           <ListItemButton
          
//             sx={{ borderRadius: 2 }}
//           >
//             <ListItemIcon >{item.icon}</ListItemIcon>
//             <ListItemText  sx={{ color: 'text.menu' ,}} >{item.text}</ListItemText>
         
//           </ListItemButton>
//         </ListItem>
       
//       </React.Fragment>
//       </AppTheme>
//     );
//   };

//   return (
//     <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
//       <List dense>{mainListItems.map(renderMenuItem)}</List>
//     </Stack>
   
//   );
// }
export default function SecondMenuContent({ onItemClick }) {
  const renderMenuItem = (item) => (
    <React.Fragment key={item.text}>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => onItemClick(item.text)} sx={{ borderRadius: 2 }}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText sx={{ color: 'text.menu' }}>{item.text}</ListItemText>
        </ListItemButton>
      </ListItem>
    </React.Fragment>
  );

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>{mainListItems.map(renderMenuItem)}</List>
    </Stack>
  );
}

