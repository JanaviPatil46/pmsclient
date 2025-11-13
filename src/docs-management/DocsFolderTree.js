import React, { useState, useEffect ,useContext} from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,FormControl,Alert,Select,CircularProgress,InputLabel,Dialog,DialogTitle,DialogContent,TextField,DialogActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import FileUploadDrawer from "./drawers/FileUploadDrawer"
import CreteFolderDrawer from "./drawers/CreteFolderDrawer"
import FolderUploadDrawer from "./drawers/FolderUploadDrawer"
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from 'axios';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Eye, PenTool, Stamp, Lock } from "lucide-react";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
import { LoginContext } from '../context/Context';
import DownloadIcon from '@mui/icons-material/Download';
import ParentFolderMenu from "./ParentFolderMenu";
import FolderMenu from "./FolderMenu";
import FileMenu from "./FileMenu";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;


const DocsFolderTree = () => {
   
  
       const [accountId, setAccountId] = useState(sessionStorage.getItem("accountId"));

   

console.log("acount id for the documentation",accountId)
 
  const [error, setError] = useState("");

 
 




  const FolderTreeView = ({accountId}) => {
 
  const [clientEmail, setClientEmail] = useState(sessionStorage.getItem("email")); // store client email
    // const [approvedFiles, setApprovedFiles] = useState(new Set());
  
  
    console.log("folder structure of account is",accountId)
   const [expandedFolders, setExpandedFolders] = useState({});
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
    const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
    const [renameDrawer, SetRenameDrawer] = useState(null);
    const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
    const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
    const [description, setDescription] = useState("");
    const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
    const [folderTree, setFolderTree] = useState([]);
   const[selectedItem,setSelectedItem]=useState("")

   // API call to fetch folder tree for a given template ID
    const fetchFolderTree = async (accountId) => {
      try {
        const res = await fetch(`https://www.snptaxes.com/api/accountsdoc/files/list/clientView?folderPath=${accountId}`);
        console.log("responce",res)
        const data = await res.json();
        console.log("janavi patil",data.contents)
        if (res.ok) {
          setFolderTree(data.contents);
        } else {
          setError('Failed to fetch folder tree');
        }
      } catch (err) {
        setError('Error fetching folder tree');
      }
    };
    useEffect(() => {
  if (accountId) {
    fetchFolderTree(accountId);
  }
}, [accountId]);

    const toggleFolder = (path, isReadOnly) => {
      if (isReadOnly) return;
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };
  
    const handleMenuOpen = (event, folder) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      setSelectedFolderForMenu(folder);
    };
  
    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };
  // Toggle read/unread
    const toggleReadStatus = (item) => {
      const newValue = !(item.meta?.readStatus || false);
      updateStatus(item, "readStatus", newValue);
      // console.log("kujaki janavi", item.path);
    };
  
    const SIGN_STATUSES = [
      "sendForSignature",
      "pendingSignature",
      "signatureCompleted",
    ];
  
   
    const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
      const [token, setToken] = useState("");
  const [showBuilderFor, setShowBuilderFor] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); 


    
    const APPROVAL_STATUSES = [
      "sendForApproval",
      "pendingApproval",
      "cancledApproval",,
      "approvalCompleted",
    ];
  
    
  
   
// 🔹 Step 2: Close dialog
const handleCloseDialog = () => {
  setOpenApprovalDialog(false);
  setDescription("");
  setSelectedItem(null);
};


    // 🔹 Frontend: Update any status (read, sign, approval)
    const updateStatus = async (item, statusType, newValue) => {
      try {
        if (!item?.path) return alert("Invalid item selected");
  
        const body = {
          targetPath: item.path,
          status: {
            [statusType]: newValue, // dynamic key
          },
        };
  
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/updateStatus",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
  
        const data = await res.json();
  
        if (res.ok) {
          alert(data.message || "Status updated successfully");
          fetchFolderTree(accountId); // refresh folder tree to reflect change
        } else {
          alert(data.error || "Failed to update status");
        }
      } catch (err) {
        console.error("Error updating status:", err);
        alert("Error updating status");
      }
    };
  
    const toggleReadOnly = async (item) => {
      try {
        const newStatus = !item.meta.readOnly;
  
        // 📍 Use correct backend endpoint
        const endpoint =
          item.type === "folder"
            ? "https://www.snptaxes.com/api/accountsdoc/folder/readonly"
            : "https://www.snptaxes.com/api/accountsdoc/file/readonly";
  
        const body =
          item.type === "folder"
            ? { folderPath: item.path, readOnly: newStatus }
            : { filePath: item.path, readOnly: newStatus };
  
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          fetchFolderTree(accountId);
  
          // 🗂️ Collapse folder if it’s locked
          if (item.type === "folder" && newStatus) {
            setExpandedFolders((prev) => {
              const updated = { ...prev };
              delete updated[item.path];
              return updated;
            });
          }
  
          handleMenuClose();
          alert(data.message || "Updated successfully");
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update read-only status");
      }
    };
  
    // 🗑️ Delete File or Folder (Universal)
    const deleteItem = async (item) => {
      if (!item?.path) return alert("Invalid path");
  
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${item.name}"? This cannot be undone!`
      );
      if (!confirmDelete) return;
  
      try {
        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: item.path }),
          }
        );
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          alert(data.message);
           fetchFolderTree(accountId);
        } else {
          alert(data.message || "Failed to delete");
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Error deleting file or folder");
      }
  
      handleMenuClose();
    };
  
    const handleMoveFolder = async (folder) => {
      alert(`Move folder: ${folder.path}`); // implement backend
      handleMenuClose();
    };
    const handleFileClick = (fullPath, fileName, meta = {}) => {
    try {
      // 🔒 Prevent opening locked files
      if (meta.readOnly) {
        alert("This file is locked and cannot be opened.");
        return;
      }

      // ✅ Construct full file URL
      const fileUrl = `https://www.snptaxes.com/uploads/accounts/${accountId}/${fullPath}`;
console.log("fileurl",fileUrl)
      // ✅ Detect file extension (case-insensitive)
      const fileExt = fileName.split(".").pop().toLowerCase();

      // ✅ Extensions that can open in browser
      const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];

      if (viewableExtensions.includes(fileExt)) {
        // Open supported file types in a new tab
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      } else {
        // Force download for unsupported types (e.g., docx, xlsx, zip, etc.)
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error opening/downloading file:", error);
    }
  };
  const getFileIcon = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return <FaFilePdf color="#d32f2f" size={18} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage color="#1976d2" size={18} />;
    case "doc":
    case "docx":
      return <FaFileWord color="#1565c0" size={18} />;
    case "xls":
    case "xlsx":
      return <FaFileExcel color="#2e7d32" size={18} />;
    case "txt":
    case "md":
      return <FaFileAlt color="#616161" size={18} />;
    default:
      return <AiFillFileUnknown color="#757575" size={18} />;
  }
};
   const renderTree = (items, level = 0, parentPath = "", isInsideFirmDocs = false) => {
      return (
        <>
        <Box component="ul" sx={{ listStyle: "none", pl: level * 2, mb: 1 }}>
          {items.map((item) => {
            const fullPath = parentPath
              ? `${parentPath}/${item.name}`
              : item.name;
            const meta = item.meta || {};

            
          // ✅ Folder/file type checks
          const isParent = level === 0 && item.type === "folder";
          const isChild = level > 0 && item.type === "folder";
          const isFile = item.type === "file";

          // ✅ Check if parent is "firm docs"
          const isFirmDocsParent =
            isParent && item.name.toLowerCase() === "firm docs shared with client";

          // ✅ Track if we’re inside firm docs (for children)
          const insideFirmDocs = isInsideFirmDocs || isFirmDocsParent;

          // ✅ Hide menu for everything inside firm docs
          const hideMenu = insideFirmDocs;
  
            // 🎯 Define colors for statuses
            const getColor = (status) => (status ? "#1976d2" : "#9e9e9e");
  
            const StatusIcons = () => (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1 }}>
                <Eye size={16} color={getColor(meta.readStatus)} />
                <PenTool size={16} color={getColor(meta.signStatus)} />
                <Stamp size={16} color={getColor(meta.authStatus)} />
                <Lock size={16} color={meta.readOnly ? "#e53935" : "#9e9e9e"} />
              </Box>
            );
       // ✅ File click handler with lock check
          const handleSafeFileClick = () => {
            if (meta.readOnly) {
              alert("This file is locked and cannot be opened.");
              return;
            }
            handleFileClick(fullPath, item.name);
          };
            return (
              <li key={fullPath} style={{ marginBottom: 8 }}>
                {item.type === "folder" ? (
                  // 📁 Folder with open/close icon
                  <Box
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: 2,
                      cursor: "pointer",
                       backgroundColor: isParent ? "#f0f7ff" : "#fff",
                      // backgroundColor: "#fff",
                      color:'black',
                      "&:hover": { backgroundColor: "#f5f5f5",color:'black', },
                      transition: "background-color 0.2s ease-in-out",
                    }}
                    onClick={() => toggleFolder(fullPath, meta.readOnly)}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ flexGrow: 1, gap: 1 }}
                    >
                      {expandedFolders[fullPath] ? (
                        <FolderOpenIcon color="#1976d2" size={18} />
                      ) : (
                        <FolderClosedIcon color="#757575" size={18} />
                      )}
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {item.name}
                      </Typography>
                      <StatusIcons />
                    </Box>
  {!hideMenu && (
                    <IconButton
                      size="small"
                      onClick={(e) =>
                        handleMenuOpen(e, {
                          ...item,
                          fullPath,
                          isParent,
                          isChild,
                        })
                      }
                    >
                      <MoreVertIcon size={16} />
                    </IconButton>
                  )}
                    
                  </Box>
                ) : (
                  // 📄 File with single dot icon
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 4,
                      mb: 1,
                      borderRadius: 2,
                      "&:hover .file-menu-icon": { opacity: 1 },
                    }}
                  >
                   <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
                    <Typography
                      variant="body2"
                    sx={{
                      flex: 1,
                      wordBreak: "break-word",
                      color: meta.readOnly ? "#999" : "#1976d2",
                      textDecoration: meta.readOnly ? "none" : "underline",
                      cursor: meta.readOnly ? "not-allowed" : "pointer",
                    }}
                       onClick={handleSafeFileClick}
                    >
                      {item.name}
                    </Typography>
                    <StatusIcons />
  
                     {!hideMenu && (
                    <Box
                      className="file-menu-icon"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#1976d2",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        cursor: "pointer",
                        mr: 1,
                        ml: 1,
                      }}
                      onClick={(e) =>
                        handleMenuOpen(e, { ...item, fullPath, isFile: true })
                      }
                    />
                  )}
                  </Box>
                )}
  
                {/* Recursive children */}
                {expandedFolders[fullPath] &&
                  item.children &&
                  item.children.length > 0 && (
                    <Box
                      sx={{
                        ml: 2,
                        mt: 1,
                        borderLeft: "2px dashed #ccc",
                        pl: 2,
                      }}
                    >
                      {renderTree(item.children, level + 1, fullPath,insideFirmDocs)}
                    </Box>
                  )}
              </li>
            );
          })}
        </Box>
        

        </>
      );
    };
    return (
 
  <Box sx={{ margin: "auto", p: 3 }}>
       
  
        {/* Action Buttons */}
        <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              maxWidth: "600px",
              width: "100%",
              mx: "auto",
              my: 3,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              startIcon={<FolderIcon />}
              onClick={() => {
                setNewFolderDrawerOpen(true);
                handleMenuClose();
              }}
            >
              Create Folder
            </Button>
  
            <Button
              variant="contained"
              fullWidth
              startIcon={<UploadFileIcon />}
              onClick={() => setFileUploadDrawerOpen(true)}
            >
              Upload File
            </Button>
  
            <Button
              variant="contained"
              fullWidth
              startIcon={<DriveFolderUploadIcon />}
              onClick={() => setFolderUploaDrawerOpen(true)}
            >
              Upload Folder
            </Button>
          </Box>
  
          {/* Drawers */}
          <FileUploadDrawer
            isOpen={fileUploadDrawerOpen}
            onClose={() => setFileUploadDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />
  
          <CreteFolderDrawer
            isOpen={newFolderDrawerOpen}
            onClose={() => {
              setNewFolderDrawerOpen(false);
            }}
            accountId={accountId}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />
  
          <FolderUploadDrawer
            isOpen={folderUploaDrawerOpen}
            onClose={() => setFolderUploaDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />
  
          <MoveDrawer
            isOpen={moveDrawerOpen}
            onClose={() => {
              setMoveDrawerOpen(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />
  
          <RenameDrawer
            isOpen={renameDrawer}
            onClose={() => {
              SetRenameDrawer(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(accountId)}
            selectedFolderForMenu={selectedFolderForMenu}
          />
        </Box>
  
        {/* Folder Explorer */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            📜 Folder Explorer
          </Typography>
          {folderTree ? (
            (renderTree(folderTree))
          ) : (
            <Typography>Loading folder data...</Typography>
          )}
        </Paper>
  

 {selectedFolderForMenu ? (
          selectedFolderForMenu.isParent ? (
            // 📁 Parent Folder Menu
            <ParentFolderMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              onCreateFolder={() => setNewFolderDrawerOpen(true)}
            />
          ) : selectedFolderForMenu.isFile ? (
            // 📄 File Menu
            <FileMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              selectedItem={selectedFolderForMenu}
              onRename={() => SetRenameDrawer(true)}
              onMove={() => setMoveDrawerOpen(true)}
              accId={accountId}
              onToggleReadStatus={toggleReadStatus}
              onToggleReadOnly={toggleReadOnly}
              onDelete={deleteItem}
              onDownload={handleFileClick}
            />
          ) : (
            // 📂 Child Folder Menu
            <FolderMenu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              selectedItem={selectedFolderForMenu}
              onCreateFolder={() => setNewFolderDrawerOpen(true)}
              onUploadFile={() => setFileUploadDrawerOpen(true)}
              onUploadFolder={() => setFolderUploaDrawerOpen(true)}
              onRename={() => SetRenameDrawer(true)}
              onMove={() => setMoveDrawerOpen(true)}
              onToggleReadStatus={toggleReadStatus}
              onToggleReadOnly={toggleReadOnly}
              onDelete={deleteItem}
            />
          )
        ) : null}

       

      </Box>
    );
  };
  return (
  
    <Box sx={{ p: 3 }}>
   

      


      <FolderTreeView accountId={accountId} />
    </Box>
  )
}

export default DocsFolderTree