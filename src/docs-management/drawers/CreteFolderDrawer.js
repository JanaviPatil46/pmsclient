// ============================
// 📁 Drawer: Create Folder
// ============================

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Folder, FolderOpen, ChevronDown, ChevronRight, X } from "lucide-react";
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <Folder size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Create New Folder</h2>
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
          {/* Folder name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Folder Name
            </label>
            <input
              type="text"
              placeholder="Enter new folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>

          {message && (
            <p className={`text-sm font-medium rounded-lg px-3 py-2 ${
              message.includes("❌") ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-700 dark:text-green-400"
            }`}>
              {message}
            </p>
          )}

          {/* Folder tree selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Select Parent Folder
            </p>
            <div className="rounded-lg border border-border bg-muted/20 max-h-[50vh] overflow-y-auto">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={handleCreateFolder}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Create Folder
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

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 transition-colors select-none
                ${isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/60"}
                ${isReadOnly ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
              `}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              onClick={() => { if (!isReadOnly) onSelect(item.path); }}
            >
              {/* Expand/collapse toggle */}
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
              {/* Folder icon */}
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

export default CreateFolderDrawer;

