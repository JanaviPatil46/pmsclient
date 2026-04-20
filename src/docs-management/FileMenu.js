import React, { useEffect, useRef } from "react";
import { Pencil, MoveRight, Download, Trash2 } from "lucide-react";

const FileMenu = ({
  anchorEl,
  open,
  onClose,
  selectedItem,
  accId,
  onRename,
  onMove,
  onToggleReadStatus,
  onToggleReadOnly,
  onDelete,
  onDownload,
}) => {
  const menuRef = useRef(null);
  const isLocked = selectedItem?.meta?.readOnly === true;

  // Dismiss on outside click
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

  // Position menu below-right of anchor
  const rect = anchorEl.getBoundingClientRect();
  const style = {
    position: "fixed",
    top: rect.bottom + 4,
    right: window.innerWidth - rect.right,
    zIndex: 1300,
    minWidth: "160px",
  };

  const Item = ({ onClick, disabled, danger, icon: Icon, children }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => { if (!disabled) { onClick(); onClose(); } }}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors rounded-md
        ${disabled ? "opacity-40 cursor-not-allowed text-muted-foreground"
          : danger ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-muted"
        }`}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      {children}
    </button>
  );

  return (
    <div
      ref={menuRef}
      style={style}
      className="rounded-lg border border-border bg-popover shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
    >
      <Item icon={Pencil} disabled={isLocked} onClick={onRename}>Rename</Item>
      <Item icon={MoveRight} disabled={isLocked} onClick={onMove}>Move</Item>
      <Item icon={Download} disabled={isLocked} onClick={() => onDownload(selectedItem)}>Download</Item>
      <div className="my-1 border-t border-border" />
      <Item icon={Trash2} disabled={isLocked} danger onClick={() => onDelete(selectedItem)}>Delete</Item>
    </div>
  );
};

export default FileMenu;
