

// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import axios from "axios";
// import { toast } from "material-react-toastify";
// import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from "react-icons/fa";
// import { AiFillFileUnknown } from "react-icons/ai";

// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   file, // This is the file passed from parent OrganizerDialog
//   onUploadSuccess, // Callback to parent when upload is successful
//   onUploadError, // Callback to parent when upload fails
// }) => {
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setMessage("");
//       setIsUploading(false);
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   const handleUpload = async () => {
//     if (!file || !selectedFolder) {
//       setMessage("Please select a file and a folder.");
//       return;
//     }

//     setIsUploading(true);
//     setMessage("");

//     try {
//       const formData = new FormData();
//       formData.append("files", file);

//       const res = await axios.post(
//         `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
//           selectedFolder
//         )}`,
//         formData,
//         { 
//           headers: { "Content-Type": "multipart/form-data" },
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setMessage(`Uploading... ${progress}%`);
//           }
//         }
//       );

//       const successMessage = `✅ ${res.data.message || "File uploaded successfully"}`;
//       setMessage(successMessage);
      
//       // Call the success callback with file data
//       if (onUploadSuccess) {
//         onUploadSuccess({
//           fileName: file.name,
//           filePath: selectedFolder,
//           uploadDate: new Date().toISOString(),
//           serverResponse: res.data
//         });
//       }

//       // Refresh folder tree and close drawer
//       if (fetchFolderTree) {
//         fetchFolderTree();
//       }
      
//       // Don't close immediately - let user see success message
//       setTimeout(() => {
//         onClose();
//       }, 1500);

//     } catch (err) {
//       console.error("Upload error:", err);
//       const errorMessage = "❌ Error uploading file";
//       setMessage(errorMessage);
//       toast.error(errorMessage);
      
//       // Call the error callback
//       if (onUploadError) {
//         onUploadError(err);
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Drawer 
//       anchor="right" 
//       open={isOpen} 
//       onClose={onClose}  
//       ModalProps={{
//         keepMounted: true
//       }}
//       sx={{
//         zIndex: (theme) => theme.zIndex.modal + 1,
//         width: 600,
//       }}
//     >
//       <Box sx={{ width: 400, p: 3, height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📄 Upload File
//         </Typography>

//         {/* Display selected file info */}
//         {file && (
//           <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Selected File:
//             </Typography>
//             <Typography variant="body2">
//               <strong>Name:</strong> {file.name}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
//             </Typography>
//             <Typography variant="body2">
//               <strong>Type:</strong> {file.type || 'Unknown'}
//             </Typography>
//           </Box>
//         )}

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//           disabled={!file || !selectedFolder || isUploading}
//           sx={{ mb: 2 }}
//         >
//           {isUploading ? 'Uploading...' : 'Upload File'}
//         </Button>

//         {message && (
//           <Typography 
//             sx={{ 
//               mt: 2, 
//               mb: 2, 
//               fontWeight: "bold",
//               color: message.includes('❌') ? 'error.main' : 'success.main'
//             }}
//           >
//             {message}
//           </Typography>
//         )}

//         <Box sx={{ mt: 3, mb: 3 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Select Upload Folder
//           </Typography>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={handleFolderSelect}
//             selectedFolder={selectedFolder}
//           />
//         </Box>

//         <Button 
//           variant="outlined" 
//           fullWidth 
//           onClick={onClose}
//           disabled={isUploading}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   const getFileIcon = (fileName) => {
//     const ext = fileName.split(".").pop().toLowerCase();

//     switch (ext) {
//       case "pdf":
//         return <FaFilePdf color="#d32f2f" size={18} />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <FaFileImage color="#1976d2" size={18} />;
//       case "doc":
//       case "docx":
//         return <FaFileWord color="#1565c0" size={18} />;
//       case "xls":
//       case "xlsx":
//         return <FaFileExcel color="#2e7d32" size={18} />;
//       case "txt":
//       case "md":
//         return <FaFileAlt color="#616161" size={18} />;
//       default:
//         return <AiFillFileUnknown color="#757575" size={18} />;
//     }
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
//                 sx={{ cursor: 'pointer', minWidth: 40 }}
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
//                     sx={{ cursor: 'pointer' }}
//                   />
//                 ) : (
//                   <ExpandMore
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                     sx={{ cursor: 'pointer' }}
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
//                 {item.meta?.files?.length > 0 && (
//                   <List sx={{ pl: 4 }}>
//                     {item.meta.files.map((file) => (
//                       <ListItem
//                         key={file.name}
//                         sx={{ pl: 2 }}
//                       >
//                         <ListItemIcon>
//                           <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={`${file.name}${
//                             file.readOnly ? " (Read Only)" : ""
//                           }`}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 )}
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
  files, // Changed from file to files (array)
  onUploadSuccess, // Callback when uploads are successful
  onUploadError, // Callback when uploads fail
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setMessage("");
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (!files || files.length === 0 || !selectedFolder) {
      setMessage("Please select files and a folder.");
      return;
    }

    setIsUploading(true);
    setMessage(`Uploading ${files.length} file(s)...`);

    const uploadResults = {
      successful: [],
      failed: []
    };

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          setMessage(`Uploading ${i + 1}/${files.length}: ${file.name}`);
          
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
                setUploadProgress(prev => ({
                  ...prev,
                  [file.name]: progress
                }));
              }
            }
          );

          uploadResults.successful.push({
            fileName: file.name,
            filePath: selectedFolder,
            uploadDate: new Date().toISOString(),
            serverResponse: res.data
          });

        } catch (err) {
          console.error(`Upload error for ${file.name}:`, err);
          uploadResults.failed.push({
            fileName: file.name,
            error: err
          });
        }
      }

      // Final message
      if (uploadResults.failed.length === 0) {
        setMessage(`✅ All ${uploadResults.successful.length} files uploaded successfully!`);
        
        // Call success callback with all uploaded files
        if (onUploadSuccess) {
          onUploadSuccess(uploadResults.successful);
        }
        
        setTimeout(() => {
          onClose();
        }, 2000);
        
      } else if (uploadResults.successful.length === 0) {
        setMessage("❌ All files failed to upload");
        if (onUploadError) {
          onUploadError(uploadResults.failed);
        }
      } else {
        setMessage(`⚠ ${uploadResults.successful.length} uploaded, ${uploadResults.failed.length} failed`);
        if (onUploadSuccess) {
          onUploadSuccess(uploadResults.successful);
        }
        setTimeout(() => {
          onClose();
        }, 3000);
      }

    } catch (err) {
      console.error("Upload process error:", err);
      setMessage("❌ Error during upload process");
      if (onUploadError) {
        onUploadError([{ fileName: 'Multiple files', error: err }]);
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
        width: 500,
      }}
    >
      <Box sx={{ width: 450, p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📄 Upload Files ({files?.length || 0})
        </Typography>

        {/* Display selected files info */}
        {files && files.length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Files:
            </Typography>
            {files.map((file, index) => (
              <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: index < files.length - 1 ? '1px solid #ddd' : 'none' }}>
                <Typography variant="body2">
                  <strong>{index + 1}.</strong> {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                  {uploadProgress[file.name] !== undefined && (
                    <span> - Progress: {uploadProgress[file.name]}%</span>
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
          disabled={!files || files.length === 0 || !selectedFolder || isUploading}
          sx={{ mb: 2 }}
        >
          {isUploading ? `Uploading...` : `Upload ${files?.length || 0} File(s)`}
        </Button>

        {message && (
          <Typography 
            sx={{ 
              mt: 2, 
              mb: 2, 
              fontWeight: "bold",
              color: message.includes('❌') ? 'error.main' : 
                     message.includes('⚠') ? 'warning.main' : 'success.main'
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