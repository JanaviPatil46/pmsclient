import React, { useState, useEffect, useRef } from "react";
import { Folder as FolderClosedIcon, FolderOpen as FolderOpenIcon, MoreVertical, Trash2, RotateCcw, Download, ChevronRight } from "lucide-react";
import { toast } from "material-react-toastify";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
const TrashedDocs = () => {
   const [accountId, setAccountId] = useState(
      sessionStorage.getItem("accountId")
    );
    console.log("accountId in trashed docs",accountId);
   const FolderTreeView = ({ accountId }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [error, setError] = useState(null);
    const [folderTree, setFolderTree] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
      fetchFolderTree(accountId);
    }, [accountId]);

    // API call to fetch folder tree for a given template ID
    const fetchFolderTree = async (accountId) => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/list-trashed?folderPath=${accountId}`
        );
        const data = await res.json();
        console.log("janavi patil", data);
        if (res.ok) {
          setFolderTree(data.contents.Client || []);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        setError("Error fetching folder tree");
      }
    };
    const toggleFolder = (path, isReadOnly) => {
      // if (isReadOnly) return;
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuOpen = (event, folder) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      setSelectedFolderForMenu(folder);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };

    // Update getAllChildrenPaths to work with item.path
    const getAllChildrenPaths = (item) => {
      const paths = [item.path];
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          paths.push(...getAllChildrenPaths(child));
        });
      }
      return paths;
    };

    const restoreItem = async (item) => {
      try {
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/restore",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: item.path }),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success("Item restored successfully");
          fetchFolderTree(accountId);
        } else {
          toast.error(data.message || "Restore failed");
        }
      } catch (err) {
        toast.error("Error restoring item");
      }
    };
    const handleDownload = async (item) => {
      try {
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/download",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paths: item.path, // backend already supports string or array
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Download failed");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = item.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
    };
    // 🗑️ Delete File or Folder (Universal)
    const deleteItem = async (item) => {
      console.log("Deleting item:", item);
      if (!item?.path) return alert("Invalid path");
      // console.log("delete path", item.path);
      // console.log("delete item", item);
      // const confirmDelete = window.confirm(
      //   `Are you sure you want to delete "${item.name}"? This cannot be undone!`
      // );
      // if (!confirmDelete) return;

      try {
        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: item.path }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // alert(data.message);
          toast.success(data.message);
          setTimeout(() => {
            fetchFolderTree(accountId);
          }, 800);
          //  fetchFolderTree(accountId);
        } else {
          alert(data.message || "Failed to delete");
          toast.error(data.message);
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Error deleting file or folder");
        toast.error(err);
      }

      handleMenuClose();
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

    const formatUploadedAt = (dateValue) => {
      if (!dateValue) return "";

      // If already in "DEC-19 2025" format
      if (
        typeof dateValue === "string" &&
        /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
      ) {
        return dateValue;
      }

      const date = new Date(dateValue);
      if (isNaN(date)) return dateValue;

      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase()
        .replace(",", "") // remove comma
        .replace(" ", "-"); // replace first space with dash
    };
  
// const TrashedInfo = ({ meta }) => {
//   if (!meta?.trash?.trashedAt) return null;

//   const trashedAt = new Date(meta.trash.trashedAt);
//   const now = new Date();

//   // Calculate remaining time until 60 days
//   const diffTime = trashedAt.getTime() + 60 * 24 * 60 * 60 * 1000 - now.getTime(); // 60 days in ms
//   const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   // Format trashed date
//   const formattedDate = trashedAt
//     .toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     })
//     .toUpperCase()
//     .replace(",", ""); // e.g., DEC-29 2025

//   return (
//     <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//       {formattedDate} ({remainingDays > 0 ? `${remainingDays} day${remainingDays > 1 ? "s" : ""} left` : "Deleting soon"})
//     </Typography>
//   );
// };

const TrashedInfo = ({ meta }) => {
  if (!meta?.trash?.trashedAt) return null;

  const trashedAt = new Date(meta.trash.trashedAt);
  const now = new Date();
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
  const diffTime = trashedAt.getTime() + TWO_HOURS_MS - now.getTime();

  if (diffTime <= 0) {
    return (
      <span className="text-xs font-semibold text-destructive">
        Deleting soon
      </span>
    );
  }

  const remainingMinutes = Math.ceil(diffTime / (1000 * 60));
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  const formattedDate = trashedAt
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase()
    .replace(",", "");

  return (
    <span className="text-xs font-semibold text-muted-foreground">
      {formattedDate}{" "}
      <span className="text-foreground">
        ({hours > 0 && `${hours}hr${hours > 1 ? "s" : ""} `}{minutes > 0 && `${minutes}min left`})
      </span>
    </span>
  );
};

    const findNewSystemTag = (item) => {
      // console.log("Finding 'New' tag in item:", item);
      // Check current item
      const newTag = item.meta?.tags?.find(
        (tag) => tag.isSystemTag && tag.tagName === "New"
      );

      if (newTag) return newTag;

      // Check children recursively
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          const childTag = findNewSystemTag(child);
          if (childTag) return childTag;
        }
      }

      return null;
    };

    const renderTrashedRows = (items, level = 0, parentPath = "") => {
      return items.map((item) => {
        const fullPath = item.path;
        const meta = item.meta || {};
        const isFolder = item.type === "folder";
        const showMenu = level === 0 && (item.type === "folder" || item.type === "file");

        return (
          <React.Fragment key={fullPath}>
            <tr className={`border-b border-border transition-colors hover:bg-muted/40 ${level % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
              <td className="px-3 py-2.5" style={{ paddingLeft: `${12 + level * 20}px` }}>
                <div className="flex items-center gap-2">
                  {isFolder ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleFolder(fullPath)}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {expandedFolders[fullPath]
                          ? <FolderOpenIcon size={16} className="text-amber-500" />
                          : <FolderClosedIcon size={16} className="text-amber-500" />}
                      </button>
                      <span
                        className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => toggleFolder(fullPath)}
                      >
                        {item.name}
                        <span className="ml-1.5 text-xs text-muted-foreground font-normal">(Trashed)</span>
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="shrink-0">{getFileIcon(item.name)}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.name}
                        <span className="ml-1.5 text-xs opacity-60">(Trashed)</span>
                      </span>
                    </div>
                  )}
                </div>
              </td>

              <td className="px-3 py-2.5">
                {level === 0 && <TrashedInfo meta={meta} />}
              </td>

              <td className="px-3 py-2.5 text-right">
                {showMenu && (
                  <button
                    type="button"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <MoreVertical size={15} />
                  </button>
                )}
              </td>
            </tr>

            {isFolder &&
              expandedFolders[fullPath] &&
              item.children &&
              item.children.length > 0 &&
              renderTrashedRows(item.children, level + 1, fullPath)}
          </React.Fragment>
        );
      });
    };

    // Context menu dropdown
    const ContextMenu = () => {
      const menuRef = useRef(null);
      useEffect(() => {
        if (!menuAnchorEl) return;
        const handle = (e) => {
          if (menuRef.current && !menuRef.current.contains(e.target) && e.target !== menuAnchorEl) {
            handleMenuClose();
          }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
      }, []);

      if (!menuAnchorEl || !selectedFolderForMenu) return null;
      const rect = menuAnchorEl.getBoundingClientRect();
      const style = {
        position: "fixed",
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        zIndex: 1300,
        minWidth: "176px",
      };

      const Item = ({ onClick, danger, icon: Icon, children }) => (
        <button
          type="button"
          onClick={() => { onClick(); handleMenuClose(); }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors rounded-md
            ${danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"}`}
        >
          {Icon && <Icon size={14} className="shrink-0" />}
          {children}
        </button>
      );

      return (
        <div ref={menuRef} style={style} className="rounded-lg border border-border bg-popover shadow-lg p-1 animate-in fade-in-0 zoom-in-95">
          <Item icon={RotateCcw} onClick={() => restoreItem(selectedFolderForMenu)}>Restore</Item>
          <Item icon={Download} onClick={() => handleDownload(selectedFolderForMenu)}>Download</Item>
          <div className="my-1 border-t border-border" />
          <Item icon={Trash2} danger onClick={() => {
            setItemToDelete(selectedFolderForMenu);
            setDeleteConfirmText("");
            setDeleteDialogOpen(true);
          }}>Delete Permanently</Item>
        </div>
      );
    };

    return (
      <div className="w-full max-w-[1700px] p-4 space-y-4">
        {/* Page header */}
        <div className="flex items-center gap-2">
          <Trash2 size={18} className="text-destructive" />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Trash</h1>
            <p className="text-xs text-muted-foreground">Items are permanently deleted after 2 hours</p>
          </div>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3">
          <span className="text-warning text-sm shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm text-foreground">
            Items in Trash will be <strong>permanently deleted after 2 hours</strong>. Please restore important files or folders before this period.
          </p>
        </div>

        {/* Table card */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/40">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">Trashed Items</h2>
          </div>
          {folderTree && folderTree.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Trashed</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">{renderTrashedRows(folderTree)}</tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Trash2 size={32} className="mb-3 opacity-20" />
              <p className="text-sm">Trash is empty</p>
            </div>
          )}
        </div>

        {/* Context menu */}
        <ContextMenu />

        {/* Delete confirmation dialog */}
        {deleteDialogOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteDialogOpen(false)} />
            <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-background rounded-xl border border-border shadow-xl p-6 space-y-4">
              {/* Dialog header */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-destructive">Delete Permanently</h3>
                <p className="text-sm text-muted-foreground">
                  This action <strong className="text-foreground">cannot be undone</strong>. Type <strong className="text-foreground">DELETE</strong> to confirm permanent deletion of:
                </p>
              </div>

              {/* Item name */}
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-sm font-semibold text-foreground truncate">{itemToDelete?.name}</p>
              </div>

              {/* Confirm input */}
              <div className="space-y-1">
                <input
                  autoFocus
                  type="text"
                  placeholder="Type DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors
                    ${deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE"
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border focus:ring-primary/40"}`}
                />
                {deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE" && (
                  <p className="text-xs text-destructive">You must type DELETE exactly</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={async () => {
                    await deleteItem(itemToDelete);
                    setDeleteDialogOpen(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="w-full">
      <FolderTreeView accountId={accountId} />
    </div>
  );
}

export default TrashedDocs