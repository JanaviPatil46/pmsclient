


import React, { useState, useEffect, useRef } from "react";
import { toast } from "material-react-toastify";
import JSZip from "jszip";
import axios from "axios";
import { Folder, FolderOpen, FolderUp, ChevronDown, ChevronRight, X } from "lucide-react";
const FolderUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [folderName, setFolderName] = useState("my-uploaded-folder");
  const [files, setFiles] = useState([]);
 const hiddenFileInput = useRef(null);
  // open hidden input
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
      setFolderName("");
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setFiles([]);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  // const handleUploadFolderSelect = (e) => {
  //   const selectedFiles = Array.from(e.target.files);
  //   if (selectedFiles.length === 0) return;

  //   // ✅ Calculate total folder size
  //   const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  //   const maxFolderSize = 100 * 1024 * 1024; // 100 MB

  //   // 🚫 Restrict folder if total exceeds limit
  //   if (totalSize > maxFolderSize) {
  //     alert(
  //       `❌ Folder size exceeds 100 MB limit.\nSelected folder size: ${(
  //         totalSize /
  //         (1024 * 1024)
  //       ).toFixed(2)} MB`
  //     );
  //     e.target.value = null; // reset input
  //     setFiles([]); // clear files state
  //     return;
  //   }

  //   // ✅ Normal processing (unchanged)
  //   setFiles(selectedFiles);

  //   const firstPath = selectedFiles[0].webkitRelativePath;
  //   const topLevelFolder = firstPath.split("/")[0];
  //   setFolderName(topLevelFolder);
  // };
 const handleUploadFolderSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const firstPath = selectedFiles[0].webkitRelativePath;
      const topLevelFolder = firstPath.split("/")[0];
      setFolderName(topLevelFolder);
    }
  };
  // const handleUpload = async () => {
  //   if (files.length === 0) {
  //     setMessage("Please select a folder first");
  //     return;
  //   }

  //   let targetFolderPath = selectedFolder
  //     ? `${selectedFolder}/${folderName}`
  //     : folderName;

  //   targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append("files", file, file.webkitRelativePath);
  //   });

  //   try {
  //     const res = await fetch(
  //       `https://www.snptaxes.com/api/accountsdoc/folder/upload?folderPath=${encodeURIComponent(
  //         targetFolderPath
  //       )}`,
  //       { method: "POST", body: formData }
  //     );
  //     const data = await res.json();
  //     if (res.ok) {
  //       setMessage(`✅ Folder uploaded successfully: ${data.files.length} files`);
  //        toast.success(`Folder uploaded successfully: ${data.files.length} files`)
  //       fetchFolderTree();
  //       onClose()
  //       setFiles([]);
  //     } else {
  //       setMessage(`❌ Error: ${data.error}`);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Upload failed");
  //   }
  // };
const handleUpload = async () => {
    if (!files.length) {
      alert("Please select a folder first!");
      return;
    }
    // ⭐ Check target folder not selected
    if (!selectedFolder || selectedFolder.trim() === "") {
      alert("Please select target path first!");
      return;
    }

    // ------------------------------
    // ⭐ Use targetFolderPath logic
    // ------------------------------
    let targetFolderPath = selectedFolder
      ? `${selectedFolder}/${folderName}`
      : folderName;

    targetFolderPath = targetFolderPath.replace(/\/+/g, "/");
    console.log("Target Folder Path:", targetFolderPath);
    setMessage("Zipping folder...");

    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.webkitRelativePath, file);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const formData = new FormData();
    formData.append("folderZip", zipBlob, `${folderName}.zip`);
    formData.append("folderName", folderName);
    formData.append("folderPath", targetFolderPath);

    setMessage("Uploading...");

    try {
      const res = await axios.post(
        "https://snptaxes.com/api/accountsdoc/upload-folder",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(res.data.message || "Uploaded successfully!");
      console.log(res.data.message);
      toast.success(`Folder uploaded successfully`);
      fetchFolderTree();
      onClose();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed!");
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
            <FolderUp size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Upload Folder</h2>
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
          {/* Select folder button */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Folder to Upload
            </label>
            <button
              type="button"
              onClick={handleClick}
              className="w-full rounded-lg border-2 border-dashed border-border bg-muted/20 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/40 hover:border-primary/40 transition-colors text-center"
            >
              {files.length > 0
                ? `${files.length} files selected from "${folderName}"`
                : "Click to select a folder"}
            </button>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleUploadFolderSelect}
              style={{ display: "none" }}
              webkitdirectory="true"
              directory="true"
              multiple
            />
          </div>

          {message && (
            <p className={`text-sm font-medium rounded-lg px-3 py-2 ${
              message.includes("❌") || message.toLowerCase().includes("fail")
                ? "bg-destructive/10 text-destructive"
                : message.toLowerCase().includes("zip") || message.toLowerCase().includes("upload")
                ? "bg-primary/10 text-primary"
                : "bg-green-500/10 text-green-700 dark:text-green-400"
            }`}>
              {message}
            </p>
          )}

          {/* Folder tree */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Select Parent Folder
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
            disabled={files.length === 0}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
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

// // Recursive folder tree
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         const isExpanded = expanded[item.path];
//         const isSelected = selectedFolder === item.path;

//         if (item.type !== "folder") return null;

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

//             <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//               {/* Subfolders */}
//               <FolderTreeSelector
//                 items={item.children}
//                 onSelect={onSelect}
//                 selectedFolder={selectedFolder}
//                 level={level + 1}
//               />

//               {/* Files inside folder */}
//               {item.meta?.files?.length > 0 && (
//                 <List sx={{ pl: 4 }}>
//                   {item.meta.files.map((file) => (
//                     <ListItem key={file.name} sx={{ pl: 2 }}>
//                       <ListItemIcon>
//                         <InsertDriveFileIcon fontSize="small" />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={`${file.name}${file.readOnly ? " (Read Only)" : ""}`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//             </Collapse>
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

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

export default FolderUploadDrawer;

