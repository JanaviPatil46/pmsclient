import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "material-react-toastify";
import { Pencil, X } from "lucide-react";

const RenameDrawer = ({
  isOpen,
  onClose,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [newName, setNewName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setCurrentPath(selectedFolderForMenu.path);
      setNewName(selectedFolderForMenu.name);
      setMessage("");
    } else if (!isOpen) {
      setCurrentPath("");
      setNewName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleRename = async () => {
    if (!newName.trim()) {
      setMessage("⚠️ New name is required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/rename",
        { currentPath, newName }
      );

      setMessage(`✅ ${res.data.message}`);
      toast.success(`${res.data.message}`);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error("Rename error:", err);
      setMessage(`❌ Error: ${err.response?.data?.error || "Server Error"}`);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <Pencil size={16} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Rename Item</h2>
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
          {selectedFolderForMenu && (
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                Current name:{" "}
                <span className="font-medium text-foreground">{selectedFolderForMenu.name}</span>
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              New Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new file or folder name"
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>

          {message && (
            <p className={`text-sm font-medium rounded-lg px-3 py-2 ${
              message.includes("❌") || message.includes("⚠️")
                ? "bg-destructive/10 text-destructive"
                : "bg-green-500/10 text-green-700 dark:text-green-400"
            }`}>
              {message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={handleRename}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Rename
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

export default RenameDrawer;

