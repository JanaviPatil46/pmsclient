

import React, { useEffect, useState } from "react";



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
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Folder = ({ name, content, onSelectPath, currentPath = "" }) => {
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
  const viewUrl = `http://127.0.0.1/${content.filePath}/${content.filename}`;
  const downloadUrl = `http://127.0.0.1/firmDocs/download/${content.accountId}/${content.filename}`;

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

    return (
      <div style={{ paddingLeft: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>📄 <span>{content.filename}</span></div>
        <div>
          {/* <IconButton  size="small"> */}
            <MoreVertIcon fontSize="small" onClick={handleMenuOpen} sx={{cursor:'pointer'}}/>
          {/* </IconButton> */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {permissions.canView && (
              <MenuItem onClick={() => handleAction("view")}>View</MenuItem>
            )}
            {permissions.canUpdate && (
              <MenuItem onClick={() => handleAction("edit")}>Edit</MenuItem>
            )}
            {permissions.canDownload && (
              <MenuItem onClick={() => handleAction("download")}>Download</MenuItem>
            )}
            {permissions.canDelete && (
              <MenuItem onClick={() => handleAction("delete")}>Delete</MenuItem>
            )}
          </Menu>
        </div>
      </div>
    );
  }

  // ========== RENDER FOLDER ==========
  return (
    <div style={{ paddingLeft: 20 }}>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        {isOpen ? "📂" : "📁"} <span>{name}</span>
      </div>
      {isOpen &&
        Object.entries(content).map(([childName, childContent]) => (
          <Folder
            key={childName}
            name={childName}
            content={childContent}
            onSelectPath={onSelectPath}
            currentPath={fullPath}
          />
        ))}
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



const FileExplorer = ({ onPathSelect,accountId }) => {
  const [files, setFiles] = useState([]);
  const folderName = "Firm Docs Shared With Client";

  

  const fetchFiles = async () => {
    try {
      const res = await fetch(
       `http://127.0.0.1/firmDocs/files/${accountId}`
      );
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchFiles(); // Only fetch when drawer is opened
    }
  }, [accountId]);
  const fileTree = buildFileTree(files, folderName);

  return (
    <div>
      {Object.entries(fileTree).map(([name, content]) => (
        <Folder
          key={name}
          name={name}
          content={content}
          onSelectPath={onPathSelect}
        />
      ))}
    </div>
  );
};

export default FileExplorer;
