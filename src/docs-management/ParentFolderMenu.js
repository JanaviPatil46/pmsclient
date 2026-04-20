import React, { useEffect, useRef } from "react";
import { FolderPlus } from "lucide-react";

const ParentFolderMenu = ({ anchorEl, open, onClose, onCreateFolder }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && e.target !== anchorEl) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, anchorEl, onClose]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const style = {
    position: "fixed",
    top: rect.bottom + 4,
    left: rect.left,
    zIndex: 1300,
    minWidth: "180px",
  };

  return (
    <div
      ref={menuRef}
      style={style}
      className="rounded-lg border border-border bg-popover shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
    >
      <button
        type="button"
        onClick={() => { onCreateFolder(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-foreground hover:bg-muted transition-colors rounded-md"
      >
        <FolderPlus size={14} className="shrink-0 text-primary" />
        Create New Folder
      </button>
    </div>
  );
};

export default ParentFolderMenu;
