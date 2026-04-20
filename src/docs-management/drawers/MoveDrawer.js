// // ============================
// // 📁 Drawer: Move Folder / File (MUI Version)
// // ============================

// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Collapse,
//   Alert,
//   ListItemIcon,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import axios from "axios";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { toast } from "material-react-toastify";
// const MoveDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [destinationPath, setDestinationPath] = useState("");
//   const [sourcePath, setSourcePath] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSourcePath(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSourcePath("");
//       setDestinationPath("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleMove = async () => {
//     try {
//       setMessage("");

//       if (!sourcePath || !destinationPath) {
//         setMessage("Please select both source and destination paths.");
//         return;
//       }

//       const res = await axios.post(
//         "https://www.snptaxes.com/api/accountsdoc/move",
//         { sourcePath, destinationPath }
//       );

//       setMessage(res.data.message);
//       toast.success("Moved Successfully");
//       onClose();
//       fetchFolderTree?.();
//     } catch (err) {
//       if (err.response) setMessage(err.response.data.error || "Move failed");
//       else setMessage("Server not reachable");
//     }
//   };

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 360, p: 3, height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📁 Move Folder / File
//         </Typography>

//         <Button
//           // variant="contained"
//           fullWidth
//           // sx={{ mt: 2 }}
//           onClick={handleMove}
//           color="primary"
//           sx={{
//             backgroundColor: "text.menu",
//             mt: 2,
//             color: "primary.contrastText",
//             "&:hover": {
//               backgroundColor: "menu.dark",
//               boxShadow: 1,
//             },
//             transition: "background-color 0.2s ease",
//           }}
//         >
//           Move
//         </Button>

//         {message && (
//           <Alert
//             severity={message.includes("failed") ? "error" : "info"}
//             sx={{ mt: 2 }}
//           >
//             {message}
//           </Alert>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle1" gutterBottom>
//           Select Destination Folder
//         </Typography>

//         <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={(path) => setDestinationPath(path)}
//             selectedFolder={destinationPath}
//           />
//         </Box>

//         <Button
//           onClick={onClose}
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2, color: "#555" }}
//         >
//           Close
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// // ============================
// // 🔹 Recursive Folder Tree Selector (MUI)
// // ============================

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
//                 "&:hover": { bgcolor: "#dbefff", color: "black" },
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//               }}
//               onClick={() => {
//                 if (!item.meta?.readOnly) onSelect(item.path);
//               }}
//             >
//               <ListItemIcon
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleExpand(item.path);
//                 }}
//               >
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
//                 (isExpanded ? (
//                   <ExpandLess
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ) : (
//                   <ExpandMore
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ))}
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

// export default MoveDrawer;


// ============================
// 📁 Drawer: Move Folder / File (MUI Version) - Supports Single & Bulk
// ============================

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "material-react-toastify";
import { Folder, FolderOpen, ChevronDown, ChevronRight, MoveRight, Loader2, X } from "lucide-react";
const MoveDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  // New props for bulk operations
  isBulkOperation = false,
  selectedPaths = [],
  onMoveComplete
}) => {
  const [destinationPath, setDestinationPath] = useState("");
  const [sourcePaths, setSourcePaths] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isBulkOperation && selectedPaths.length > 0) {
        // Bulk mode: use provided paths
        setSourcePaths(selectedPaths);
      } else if (selectedFolderForMenu) {
        // Single mode: use selected item
        setSourcePaths([selectedFolderForMenu.path]);
      }
    } else {
      // Reset on close
      // setSourcePaths([]);
      setDestinationPath("");
      setMessage("");
      setLoading(false);
    }
  }, [isOpen, selectedFolderForMenu, isBulkOperation, selectedPaths]);

  const handleMove = async () => {
    try {
      setMessage("");
      setLoading(true);

      if (sourcePaths.length === 0) {
        setMessage("No source items selected.");
        toast.warning("No items selected");
        setLoading(false);
        return;
      }

      if (!destinationPath) {
        setMessage("Please select a destination folder.");
        toast.warning("Select destination folder");
        setLoading(false);
        return;
      }

      // Determine which API to use based on number of items
      const isBulk = sourcePaths.length > 1 || isBulkOperation;
      const endpoint = isBulk 
        ? "https://www.snptaxes.com/api/accountsdoc/bulk-move"
        : "https://www.snptaxes.com/api/accountsdoc/move";

      const requestData = isBulk
        ? { paths: sourcePaths, targetPath: destinationPath }
        : { sourcePath: sourcePaths[0], destinationPath };

      const res = await axios.post(endpoint, requestData);

      setMessage(res.data.message);
      toast.success(res.data.message);
      
      // Call onMoveComplete callback if provided (for bulk operations)
      if (onMoveComplete && typeof onMoveComplete === 'function') {
        onMoveComplete(destinationPath);
      }
      
      onClose();
      fetchFolderTree?.();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Move failed";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to get item name from path
  const getItemNameFromPath = (path) => {
    console.log("Getting item name from path:", path);
    return path.split('/').pop() || path;
  };

  // Check if destination is a subfolder of any source (to prevent circular moves)
  const isInvalidDestination = (destPath) => {
    // console.log("Checking invalid destination:", destPath, sourcePaths);
    return sourcePaths.some(sourcePath => {
      return destPath.startsWith(sourcePath + '/') || destPath === sourcePath;
    });
  };



  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <MoveRight size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              {isBulkOperation ? "Move Multiple Items" : "Move Item"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Source items */}
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {isBulkOperation ? "Items to Move" : "Item to Move"}
            </p>
            {sourcePaths.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items selected</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {sourcePaths.slice(0, 5).map((path, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {getItemNameFromPath(path)}
                  </span>
                ))}
                {sourcePaths.length > 5 && (
                  <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    +{sourcePaths.length - 5} more
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Total: {sourcePaths.length} item(s)</p>
          </div>

          {/* Invalid destination warning */}
          {isInvalidDestination(destinationPath) && (
            <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2">
              <p className="text-sm text-warning font-medium">Cannot move a folder into itself or its subfolder</p>
            </div>
          )}

          {/* Message */}
          {message && (
            <p className={`text-sm font-medium rounded-lg px-3 py-2 ${
              message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }`}>
              {message}
            </p>
          )}

          {/* Divider */}
          <hr className="border-border" />

          {/* Folder tree */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Select Destination Folder
            </p>
            <div className="rounded-lg border border-border bg-muted/20 max-h-[40vh] overflow-y-auto">
              <FolderTreeSelector
                items={folderTree}
                onSelect={(path) => setDestinationPath(path)}
                selectedFolder={destinationPath}
                disabledPaths={sourcePaths}
              />
            </div>
          </div>

          {/* Selected destination */}
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Destination: <span className="font-medium text-foreground">{destinationPath || "None selected"}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={handleMove}
            disabled={!destinationPath || sourcePaths.length === 0 || loading || isInvalidDestination(destinationPath)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <MoveRight size={15} />}
            {loading ? "Moving…" : "Move Items"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (path) => setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));

  return (
    <div>
      {items?.map((item) => {
        if (item.type !== "folder") return null;
        if (item.name?.toLowerCase() === "firm documents shared with client") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const isReadOnly = item.meta?.readOnly;

        return (
          <React.Fragment key={item.path}>
            <div
              className={`flex items-center gap-2 py-2 rounded-lg mb-0.5 transition-colors select-none
                ${isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/60"}
                ${isReadOnly ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
              `}
              style={{ paddingLeft: `${12 + level * 16}px`, paddingRight: "12px" }}
              onClick={() => { if (!isReadOnly) onSelect(item.path); }}
            >
              <button
                type="button"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }}
              >
                {item.children?.length > 0
                  ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)
                  : <span className="w-3.5 inline-block" />
                }
              </button>
              {isExpanded
                ? <FolderOpen size={15} className={isSelected ? "text-primary" : "text-amber-500"} />
                : <Folder size={15} className={isSelected ? "text-primary" : "text-amber-500"} />
              }
              <span className={`text-sm truncate ${isSelected ? "font-semibold text-primary" : "text-foreground"}`}>
                {item.name}
              </span>
              {isSelected && (
                <span className="ml-auto shrink-0 text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5">
                  Selected
                </span>
              )}
            </div>
            {isExpanded && item.children?.length > 0 && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MoveDrawer;