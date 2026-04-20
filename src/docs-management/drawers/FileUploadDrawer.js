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
}) => {
  const [file, setFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFile(null);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  // const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50 MB
    const forbiddenTypes = ["video/", "audio/"];

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`❌ ${file.name} exceeds 50 MB limit.`);
        return false;
      }
      if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
        alert(`❌ ${file.name} is an audio or video file — not allowed.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };
  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (files.length === 0 || !selectedFolder) {
      setMessage("Please select files and a folder.");
      return;
    }

    try {
      const accountId = sessionStorage.getItem("accountId");
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("accountId", accountId);

      const res = await axios.post(
        `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
          selectedFolder
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
 console.log("Upload Response:", res.data); 
      setMessage(`✅ ${res.data.message || "Files uploaded successfully"}`);
      toast.success(`✅ ${res.data.message || "Files uploaded successfully"}`);
      setFiles([]);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading files");
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
            <h2 className="text-base font-semibold text-foreground">Upload File</h2>
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
          {/* File picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Files
            </label>
            <label className="flex items-center justify-center w-full rounded-lg border-2 border-dashed border-border bg-muted/20 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/40 hover:border-primary/40 transition-colors cursor-pointer">
              {files.length > 0 ? `${files.length} file(s) selected` : "Click to select files"}
              <input type="file" hidden multiple onChange={handleFileChange} />
            </label>
          </div>

          {message && (
            <p className={`text-sm font-medium rounded-lg px-3 py-2 ${
              message.includes("❌") ? "bg-destructive/10 text-destructive"
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
            disabled={files.length === 0 || !selectedFolder}
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
