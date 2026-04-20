import * as React from "react";
import { User, Mail, Briefcase } from "lucide-react";
const mainListItems = [
  { text: "Accounts", icon: <User size={20} /> },
  { text: "Contacts", icon: <Mail size={20} /> },
  { text: "Jobs", icon: <Briefcase size={20} /> },
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
      <div>
        <button
          onClick={() => onItemClick(item.text)}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <span className="text-muted-foreground">{item.icon}</span>
          <span>{item.text}</span>
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <div className="flex flex-col flex-1 p-1 justify-between">
      <nav>{mainListItems.map(renderMenuItem)}</nav>
    </div>
  );
}

