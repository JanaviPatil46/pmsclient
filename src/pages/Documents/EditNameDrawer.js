// components/EditNameDrawer.jsx
import React, { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
const EditNameDrawer = ({ open, onClose, item, onRename }) => {
  const [newName, setNewName] = useState("");
  const [ itemPath, setItemPath]= useState("")
console.log("edit item",item?.path)
console.log("filename",item?.file)
useEffect(() => {
    if (item?.file) {
      setNewName(item.file); // Set initial file name from the item prop
    }
    if(item?.folder){
        setNewName(item?.folder)
    }
    if (item?.path){
        setItemPath(item.path)
    }
  }, [item]);

  const handleRename = () => {
    if (!newName.trim()) return;
    onRename(item, newName,itemPath);
    setNewName("");
    setItemPath("")
    onClose();
  
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xs bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <Pencil size={16} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Rename {item?.type === "folder" ? "Folder" : "File"}
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
        <div className="flex-1 px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              New Name
            </label>
            <input
              type="text"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={handleRename}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Save
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

export default EditNameDrawer;
