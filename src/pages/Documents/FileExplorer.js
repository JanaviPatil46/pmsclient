

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../../components/ui/motion";


// const Folder = ({ name, content, onSelectPath, currentPath = "" }) => {
//   console.log(content)
//   const [isOpen, setIsOpen] = useState(false);
//   const isFile = content.filename;
//   const fullPath = currentPath ? `${currentPath}/${name}` : name;

//   if (isFile) {
//     return (
//       <div style={{ paddingLeft: 20 }}>
//         📄 <span>{content.filename}</span>
//       </div>
//     );
//   }

//   const handleClick = () => {
//     setIsOpen(!isOpen);
//     if (onSelectPath) {
//       onSelectPath(fullPath);
//     }
//   };

//   return (
//     <div style={{ paddingLeft: 20 }}>
//       <div onClick={handleClick} style={{ cursor: "pointer" }}>
//         {isOpen ? "📂" : "📁"} <span>{name}</span>
//       </div>
//       {isOpen &&
//         Object.entries(content).map(([childName, childContent]) => (
//           <Folder
//             key={childName}
//             name={childName}
//             content={childContent}
//             onSelectPath={onSelectPath}
//             currentPath={fullPath}
//           />
//         ))}
//     </div>
//   );
// };

// import React, { useState } from "react";
import { Folder as FolderIcon, FolderOpen as FolderOpenIcon, FileText, MoreVertical } from "lucide-react";
const DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE
const FolderItem = ({ name, content, onSelectPath, currentPath = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isFile = content.filename;
  const fullPath = currentPath ? `${currentPath}/${name}` : name;

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onSelectPath) {
      onSelectPath(fullPath);
    }
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Don't toggle folder when opening menu
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
//   const handleAction = (action) => {
//   const fileUrl = `http://127.0.0.1/${content.filePath}/${content.filename}`; // adjust if needed

//   if (action === "view") {
//     // window.open(fileUrl, "_blank");
    
//     // window.open(fileUrl, "_blank");
//     window.location.href = fileUrl;
//   } else {
//     console.log(`Action: ${action} on ${content.filename}`);
//     // Implement other actions (edit, delete, etc.) here if needed
//   }

//   handleMenuClose();
// };

const handleAction = (action) => {
  const viewUrl = `${DOCS_API}/${content.filePath}/${content.filename}`;
  const downloadUrl = `${DOCS_API}/firmDocs/download/${content.accountId}/${content.filename}`;

  if (action === "view") {
   window.location.href = viewUrl; // Open in new tab for view
  } else if (action === "download") {
    // Trigger direct download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", content.filename); // Triggers download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.log(`Action: ${action} on ${content.filename}`);
    // Handle edit, delete, etc. if needed
  }

  handleMenuClose(); // Close the options menu
};


  // ========== RENDER FILE ==========
  if (isFile) {
    const { permissions = {} } = content;
    const hasAnyPermission = permissions.canView || permissions.canUpdate || permissions.canDownload || permissions.canDelete;

    return (
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="group flex items-center justify-between gap-2 pl-5 pr-2 py-1 rounded-md hover:bg-muted/50 transition-colors duration-150"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText size={13} className="shrink-0 text-muted-foreground" />
          <span className="text-[13px] text-foreground truncate">{content.filename}</span>
        </div>
        {hasAnyPermission && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={handleMenuOpen}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <MoreVertical size={13} />
            </button>
            <AnimatePresence>
              {Boolean(anchorEl) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 z-50 mt-1 min-w-[130px] rounded-lg border border-border bg-popover shadow-lg p-1 origin-top-right"
                >
                  {permissions.canView && (
                    <button type="button" onClick={() => handleAction("view")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">
                      View
                    </button>
                  )}
                  {permissions.canUpdate && (
                    <button type="button" onClick={() => handleAction("edit")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">
                      Edit
                    </button>
                  )}
                  {permissions.canDownload && (
                    <button type="button" onClick={() => handleAction("download")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">
                      Download
                    </button>
                  )}
                  {permissions.canDelete && (
                    <button type="button" onClick={() => handleAction("delete")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  }

  // ========== RENDER FOLDER ==========
  return (
    <div className="pl-4">
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleClick}
        className="flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors duration-150"
      >
        {isOpen
          ? <FolderOpenIcon size={14} className="shrink-0 text-primary" />
          : <FolderIcon size={14} className="shrink-0 text-amber-500" />}
        <span className="text-[13px] font-medium text-foreground">{name}</span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            {Object.entries(content).map(([childName, childContent]) => (
              <FolderItem
                key={childName}
                name={childName}
                content={childContent}
                onSelectPath={onSelectPath}
                currentPath={fullPath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const buildFileTree = (files, folderStart) => {
  const root = {};

  // Ensure the base folder exists
  const parts = folderStart.split("/");
  let current = root;
  parts.forEach((part) => {
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  });

  files.forEach((file) => {
    let path = file.filePath.replace(/\\/g, "/"); // Normalize slashes
    const index = path.toLowerCase().indexOf(folderStart.toLowerCase());

    if (index === -1) return;
    path = path.slice(index); // Trim before folderStart

    const fileParts = path.split("/");

    let current = root;

    // Build path
    fileParts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });

    // Skip default.txt
    if (file.filename !== "#$default.txt") {
      current[file.filename] = file;
    }
  });

  return root;
};



const FileExplorer = ({ onPathSelect, accountId }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const folderName = "Firm Docs Shared With Client";

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${DOCS_API}/firmDocs/files/${accountId}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchFiles();
    }
  }, [accountId]);

  const fileTree = buildFileTree(files, folderName);
  const hasFiles = Object.keys(fileTree).length > 0;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FolderIcon size={15} className="text-primary shrink-0" />
        <p className="text-[13px] font-semibold text-foreground tracking-tight">Firm Docs Shared With You</p>
      </div>

      {/* Body */}
      <div className="p-3">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5" style={{ paddingLeft: `${i % 2 === 0 ? 8 : 24}px` }}>
                <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
                <Skeleton className={`h-3 rounded ${i % 2 === 0 ? "w-40" : "w-28"}`} />
              </div>
            ))}
          </div>
        ) : !hasFiles ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <FolderIcon size={18} className="text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] text-muted-foreground">No shared documents yet.</p>
          </div>
        ) : (
          Object.entries(fileTree).map(([name, content]) => (
            <FolderItem
              key={name}
              name={name}
              content={content}
              onSelectPath={onPathSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
