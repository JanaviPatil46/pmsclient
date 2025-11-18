

// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import axios from "axios";
// import { toast } from "material-react-toastify";

// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,file
// }) => {
//   // const [file, setFile] = useState(null);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//    const [files, setFiles] = useState([]);
//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       // setFile(null);
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // const handleFileChange = (e) => setFile(e.target.files[0]);
//     const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const maxSize = 50 * 1024 * 1024; // 50 MB
//     const forbiddenTypes = ["video/", "audio/"];

//     const validFiles = selectedFiles.filter((file) => {
//       if (file.size > maxSize) {
//         alert(`❌ ${file.name} exceeds 50 MB limit.`);
//         return false;
//       }
//       if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
//         alert(`❌ ${file.name} is an audio or video file — not allowed.`);
//         return false;
//       }
//       return true;
//     });

//     setFiles(validFiles);
//   };
//   const handleFolderSelect = (path) => setSelectedFolder(path);


//   const handleUpload = async () => {
//     if (files.length === 0 || !selectedFolder) {
//       setMessage("Please select files and a folder.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       files.forEach((file) => formData.append("files", file));

//       const res = await axios.post(
//               `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
//           selectedFolder
//         )}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setMessage(`✅ ${res.data.message || "Files uploaded successfully"}`);
//       toast.success(`✅ ${res.data.message || "Files uploaded successfully"}`)
//       setFiles([]);
//       onClose();
//      fetchFolderTree();
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error uploading files");
//     }
//   };
//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}  ModalProps={{
//           keepMounted: true // Improves performance on mobile
//         }}
//         sx={{
//           zIndex: (theme) => theme.zIndex.modal + 1, // ensure above dialog
//           width: 600,
//         }}>
//       <Box sx={{ width: 400, p: 3,  height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📄 Upload File
//         </Typography>

// <Button
//                   variant="outlined"
//                   component="label"
//                   fullWidth
//                   sx={{ mt: 1, mb: 2 }}
//                 >
//                   {files.length > 0
//                     ? `${files.length} file(s) selected`
//                     : "Select Files"}
//                   <input type="file" hidden multiple onChange={handleFileChange} />
//                 </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//         >
//           Upload
//         </Button>

//         {message && (
//           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
//         )}

//         <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
//           Close
//         </Button>

//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Select Folder from Tree
//           </Typography>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={handleFolderSelect}
//             selectedFolder={selectedFolder}
//           />
//         </Box>
//       </Box>
//     </Drawer>
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

//         // ⛔ Skip displaying this folder completely
//         if (item.name?.toLowerCase() === "firm documents shared with client") return null;

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


// export default FileUploadDrawer;

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { toast } from "material-react-toastify";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  file, // This is the file passed from parent OrganizerDialog
  onUploadSuccess, // Callback to parent when upload is successful
  onUploadError, // Callback to parent when upload fails
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setMessage("");
      setIsUploading(false);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (!file || !selectedFolder) {
      setMessage("Please select a file and a folder.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await axios.post(
        `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
          selectedFolder
        )}`,
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setMessage(`Uploading... ${progress}%`);
          }
        }
      );

      const successMessage = `✅ ${res.data.message || "File uploaded successfully"}`;
      setMessage(successMessage);
      // toast.success(successMessage);
      
      // Call the success callback with file data
      if (onUploadSuccess) {
        onUploadSuccess({
          fileName: file.name,
          filePath: selectedFolder,
          uploadDate: new Date().toISOString(),
          serverResponse: res.data
        });
      }

      // Refresh folder tree and close drawer
      if (fetchFolderTree) {
        fetchFolderTree();
      }
      
      // Don't close immediately - let user see success message
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = "❌ Error uploading file";
      setMessage(errorMessage);
      toast.error(errorMessage);
      
      // Call the error callback
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose}  
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        width: 600,
      }}
    >
      <Box sx={{ width: 400, p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📄 Upload File
        </Typography>

        {/* Display selected file info */}
        {file && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected File:
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {file.name}
            </Typography>
            <Typography variant="body2">
              <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Typography variant="body2">
              <strong>Type:</strong> {file.type || 'Unknown'}
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
          disabled={!file || !selectedFolder || isUploading}
          sx={{ mb: 2 }}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>

        {message && (
          <Typography 
            sx={{ 
              mt: 2, 
              mb: 2, 
              fontWeight: "bold",
              color: message.includes('❌') ? 'error.main' : 'success.main'
            }}
          >
            {message}
          </Typography>
        )}

        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Upload Folder
          </Typography>
          <FolderTreeSelector
            items={folderTree}
            onSelect={handleFolderSelect}
            selectedFolder={selectedFolder}
          />
        </Box>

        <Button 
          variant="outlined" 
          fullWidth 
          onClick={onClose}
          disabled={isUploading}
        >
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
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
            <ListItem
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
            >
              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
                sx={{ cursor: 'pointer', minWidth: 40 }}
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
                    sx={{ cursor: 'pointer' }}
                  />
                ) : (
                  <ExpandMore
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                    sx={{ cursor: 'pointer' }}
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
                 {item.meta?.files?.length > 0 && (
                <List sx={{ pl: 4 }}>
                  {item.meta.files.map((file) => (
                    <ListItem
                      key={file.name}
                      sx={{ pl: 2 }}
                    >
                      <ListItemIcon>
                        <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${file.name}${
                          file.readOnly ? " (Read Only)" : ""
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default FileUploadDrawer;
