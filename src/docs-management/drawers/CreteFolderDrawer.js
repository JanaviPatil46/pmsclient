

// ============================
// 📁 Drawer: Create Folder (MUI version)
// ============================

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,  Collapse,  ListItemIcon,
} from "@mui/material";
import axios from "axios";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { toast } from "material-react-toastify";
const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,accountId
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder(""); // reset selection when drawer closes
      setFolderName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
    if (!folderName) {
      setMessage("⚠️ Folder name is required!");
      return;
    }
console.log("foldername",folderName)
console.log("selected path", selectedFolder)
    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/folder",
        {
          name: folderName,
          parentPath: selectedFolder || "",
          accountId,
        }
      );
console.log("res",res)
      setMessage(`✅ Folder created: ${res.data.metaData.name}`);
      toast.success(`Folder created: ${res.data.metaData.name}`)
      setFolderName("");
     
      // fetchFolderTree();
      // ✅ Wait for folder tree refresh
    await fetchFolderTree();
       onClose();
    } catch (err) {
      console.error(err);
      setMessage(
        `❌ Error creating folder: ${err.response?.data?.error || "Server Error"}`
      );
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 500, p: 3,  height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Create New Folder
        </Typography>

        <TextField
         
          placeholder="Enter new folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          fullWidth
          margin="dense"
        />

       

        <Button
          // variant="contained"
          color="primary"
          onClick={handleCreateFolder}
          fullWidth
           sx={{
              backgroundColor: 'text.menu',
              mt:2,
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'menu.dark',
                boxShadow: 1,
              },
              transition: 'background-color 0.2s ease'
            }}
        >
          Create Folder
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Close
        </Button>

        {/* {!selectedFolder && ( */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Parent Folder from Tree
            </Typography>
            <FolderTreeSelector
              items={folderTree}
              onSelect={handleFolderSelect}
              selectedFolder={selectedFolder}
            />
          </Box>
        {/* )} */}
      </Box>
    </Drawer>
  );
};

// 🔹 Recursive Folder Selector with Highlight (MUI)
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List sx={{ pl: level * 2 }}>
//       {items?.map((item) => {
//         const isSelected = selectedFolder === item.path;

//         return (
//           <ListItem
//             key={item.path}
//             sx={{
//               bgcolor: isSelected ? "#b2d8ff" : "transparent",
//               borderRadius: 1,
//               mb: 0.5,
//             }}
//             secondaryAction={
//               item.type === "folder" && (
//                 <Button
//                   size="small"
//                   onClick={() => onSelect(item.path)}
//                   disabled={item.meta?.readOnly}
//                   sx={{ ml: 1 }}
//                 >
//                   Select
//                 </Button>
//               )
//             }
//           >
//             {item.type === "folder" && (
//               <ListItemText
//                 primary={
//                   <span
//                     onClick={() => toggleExpand(item.path)}
//                     style={{
//                       cursor: "pointer",
//                       fontWeight: isSelected ? "bold" : "normal",
//                       color: isSelected ? "#0056b3" : "#0b5ed7",
//                     }}
//                   >
//                     {expanded[item.path] ? "📂" : "📁"} {item.name}
//                   </span>
//                 }
//               />
//             )}

//             {expanded[item.path] &&
//               item.children &&
//               item.children.length > 0 && (
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   level={level + 1}
//                 />
//               )}
//           </ListItem>
//         );
//       })}
//     </List>
//   );
// };
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];

//         return (
//           <React.Fragment key={item.path}>
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 "&:hover": { bgcolor: "#dbefff",color:'black', },
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//               }}
//               onClick={() => {
//                 if (!item.meta?.readOnly) onSelect(item.path);
//               }}
//             >
//               <ListItemIcon onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }}>
//                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
//               </ListItemIcon>
//               <ListItemText
//                 primary={item.name}
//                 sx={{
//                   fontWeight: isSelected ? "bold" : "normal",
//                   color: isSelected ? "#0056b3" : "inherit",
//                 }}
//               />
//               {item.children?.length > 0 &&
//                 (isExpanded ? <ExpandLess onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} /> : <ExpandMore onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} />)}
//             </ListItem>

//             {item.children?.length > 0 && (
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   level={level + 1}
//                 />
//               </Collapse>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <List disablePadding>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        // ⛔ Skip displaying this folder completely
        if (item.name?.toLowerCase() === "firm documents shared with client") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];

        return (
          <React.Fragment key={item.path}>
            {/* <ListItem
              sx={{
                pl: 2 + level * 2,
                bgcolor: isSelected ? "#b2d8ff" : "transparent",
                borderRadius: 1,
                mb: 0.5,
                "&:hover": { bgcolor: "#dbefff", color: "black" },
                cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                if (!item.meta?.readOnly) onSelect(item.path);
              }}
            > */}
            <ListItem
  sx={{
    pl: 2 + level * 2,
    bgcolor: isSelected ? "#b2d8ff" : "transparent",
    borderRadius: 1,
    mb: 0.5,

    cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
    opacity: item.meta?.readOnly ? 0.6 : 1,
    pointerEvents: item.meta?.readOnly ? "none" : "auto",

    "&:hover": {
      bgcolor: item.meta?.readOnly ? "transparent" : "#dbefff",
      color: "black",
    },
  }}
  onClick={() => {
    if (!item.meta?.readOnly) {
      onSelect(item.path);
    }
  }}
>

              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
              >
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              </ListItemIcon>

              <ListItemText
                primary={item.name}
                sx={{
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#0056b3" : "inherit",
                }}
              />

              {item.children?.length > 0 &&
                (isExpanded ? (
                  <ExpandLess
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ) : (
                  <ExpandMore
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ))}
            </ListItem>

            {item.children?.length > 0 && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <FolderTreeSelector
                  items={item.children}
                  onSelect={onSelect}
                  selectedFolder={selectedFolder}
                  level={level + 1}
                />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default CreateFolderDrawer;

