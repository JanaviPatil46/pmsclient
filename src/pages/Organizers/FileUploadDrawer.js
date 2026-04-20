

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
import axios from "axios";
import { toast } from "material-react-toastify";
import { Folder, FolderOpen, ChevronDown, ChevronRight, Upload, X } from "lucide-react";
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
              const accountId = sessionStorage.getItem("accountId");
        try {
          setMessage(`Uploading ${i + 1}/${files.length}: ${file.name}`);
          
          const formData = new FormData();
          formData.append("files", file);
 formData.append("accountId", accountId);
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
            filePath: `${selectedFolder}/${file.name}`,
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
            <Upload size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Upload Files {files?.length ? `(${files.length})` : ""}
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
          {/* Selected files list */}
          {files && files.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/20 divide-y divide-border max-h-48 overflow-y-auto">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Selected Files
              </p>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 gap-2">
                  <span className="text-sm text-foreground truncate">
                    <span className="text-muted-foreground mr-1">{index + 1}.</span>
                    {file.name}
                  </span>
                  <div className="shrink-0 text-right">
                    <span className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    {uploadProgress[file.name] !== undefined && (
                      <span className="ml-1 text-xs font-medium text-primary">
                        {uploadProgress[file.name]}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {message && (
            <p className={`text-sm font-medium rounded-lg px-3 py-2 ${
              message.includes("❌") ? "bg-destructive/10 text-destructive"
              : message.includes("⚠") ? "bg-warning/10 text-warning"
              : "bg-green-500/10 text-green-700 dark:text-green-400"
            }`}>
              {message}
            </p>
          )}

          {/* Folder tree */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Select Upload Folder
            </p>
            <div className="rounded-lg border border-border bg-muted/20 max-h-[45vh] overflow-y-auto">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!files || files.length === 0 || !selectedFolder || isUploading}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading…" : `Upload ${files?.length || 0} File(s)`}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
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

export default FileUploadDrawer;