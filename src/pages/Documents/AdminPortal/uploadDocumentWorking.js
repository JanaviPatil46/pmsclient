import { useState, useEffect } from "react";
import axios from "axios";
import { X, Folder, FolderOpen, FileText, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../../../components/ui/motion";

const UploadDocument = ({ open, onClose, file ,fetchUnSealedFolders,fetchAdminPrivateFolders,accountId,fetchBothFolders,accountName,accountEmailSync}) => {
 
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  const [structFolder, setStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");

  
  const fetchFolders = async () => {
  try {
    setIsLoadingFolders(true);
    const url = `${DOCS_MANAGMENTS}/admindocs/clientDocs/${accountId}`;
    const response = await axios.get(url);
    
    const addIsOpenProperty = (folders, parentId = null) =>
      folders.map((folder, index) => ({
        ...folder,
        isOpen: false,
        id: `${parentId ? `${parentId}-` : ""}${index}`,
        sealed: folder.folder === "sealed", // Add sealed property
        contents: folder.contents
          ? addIsOpenProperty(
              folder.contents,
              `${parentId ? `${parentId}-` : ""}${index}`
            )
          : [],
      }));

    const processedData = {
      ...response.data,
      folders: addIsOpenProperty(response.data.folders || []),
    };

    setStructFolder(processedData);
  } catch (err) {
    console.error("Error fetching all folders:", err);
    setError(err.message || "An error occurred");
  } finally {
    setIsLoadingFolders(false);
  }
};
  
  
  const fetchPrivateFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/privateDocs/${accountId}`
      );
      const folders = res.data.folders || [];

      const addIsOpen = (items, parentId = "") =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed: false,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`)
            : [],
        }));

      setPrivateStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
  };
  useEffect(() => {
    if (open) {
      fetchFolders();
      fetchPrivateFolders();
    }
  }, [open]);

  useEffect(() => {
    if (selectedFolderId) {
      console.log("The selected folder ID has been updated:", selectedFolderId);
      handleSelectFolderPath(); // Call your function that depends on the updated state
    }
  }, [selectedFolderId]);

 
  const [selectedType, setSelectedType] = useState(null); // "public" or "private"



  const renderContents = (contents, setContents) => {
  return contents.map((item, index) => {
    // Skip both "sealed" and "unsealed" folder names
    if (item.folder === "sealed") {
      return null; // Don't render sealed folder or its contents at all
    }

    // Skip rendering the "unsealed" folder name but show its contents
    if (item.folder === "unsealed") {
      return (
        <div key={index}>
          {item.contents && item.contents.length > 0 && (
            <div style={{ marginLeft: "0px" }}> {/* Remove left margin */}
              {renderContents(item.contents, (newContents) => {
                const updatedFolders = contents.map((folder, i) =>
                  i === index ? { ...folder, contents: newContents } : folder
                );
                setContents(updatedFolders);
              })}
            </div>
          )}
        </div>
      );
    }

    // Normal folder rendering for all other folders
    if (item.folder) {
      const toggleFolder = () => {
        const updatedContents = contents.map((folder, i) =>
          i === index ? { ...folder, isOpen: !folder.isOpen } : folder
        );
        setContents(updatedContents);
      };

      const selectFolder = () => {
        setSelectedFolderId(item.id);
        setSelectedType("public");
      };

      return (
        <div key={index} className="ml-4 mb-0.5">
          <div
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors duration-150 ${
              selectedFolderId === item.id && selectedType === "public"
                ? "bg-primary/10 border border-primary/25"
                : "hover:bg-muted/60"
            }`}
            onClick={selectFolder}
          >
            <button type="button" onClick={(e) => { e.stopPropagation(); toggleFolder(); }} className="shrink-0">
              {item.isOpen
                ? <FolderOpen size={15} className="text-primary" />
                : <Folder size={15} className="text-amber-500" />}
            </button>
            <span className={`text-[13px] font-medium truncate ${
              selectedFolderId === item.id && selectedType === "public" ? "text-primary" : "text-foreground"
            }`}>
              {item.folder}
            </span>
          </div>
          <AnimatePresence initial={false}>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
                className="ml-2"
              >
                {renderContents(item.contents, (newContents) => {
                  const updatedFolders = contents.map((folder, i) =>
                    i === index ? { ...folder, contents: newContents } : folder
                  );
                  setContents(updatedFolders);
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    } else if (item.file) {
      return (
        <div key={index} className="ml-8 flex items-center gap-2 px-2 py-1 text-[13px] text-muted-foreground">
          <FileText size={13} className="shrink-0" />
          {item.file}
        </div>
      );
    }
    return null;
  });
};

  
  const handleSubmitfile = async (e) => {
    setIsUploading(true);
    let data = new FormData();
    data.append("destinationPath", destinationPath);
    data.append("file", file);
    data.append("accountName", accountName);
    data.append("accountEmailSync", accountEmailSync);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${DOCS_MANAGMENTS}/clientuploadedfiledocument`,
      data: data,
    };
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      alert("File uploaded successfully!");
      onClose();
      fetchBothFolders();
      setSelectedFolderId(null);
    } catch (error) {
      console.error(error);
      alert("Failed to upload the file.");
    } finally {
      setIsUploading(false);
    }
  };


const handleSelectFolderPath = () => {
  const getFolderPath = (folders, parentPath = "") => {
    for (let folder of folders) {
      // Skip "sealed" folder entirely
      if (folder.folder === "sealed") continue;

      // Skip "unsealed" in path building but include its contents
      const currentPath = folder.folder === "unsealed" 
        ? parentPath 
        : `${parentPath}/${folder.folder}`;

      if (folder.id === selectedFolderId) {
        return currentPath;
      }

      if (folder.contents) {
        const nestedPath = getFolderPath(folder.contents, currentPath);
        if (nestedPath) {
          return nestedPath;
        }
      }
    }
    return null;
  };

  if (!selectedFolderId || !selectedType) {
    console.log("No folder selected or type not defined.");
    return;
  }

  if (selectedType === "public" && structFolder?.folders) {
    let selectedPath = getFolderPath(structFolder.folders);
    
    // Automatically prepend "/unsealed" since we're hiding the folder name
    if (selectedPath?.startsWith("/Client Uploaded Documents")) {
      selectedPath = `/Client Uploaded Documents/unsealed${selectedPath.substring(
        "/Client Uploaded Documents".length
      )}`;
    }
    
    setNewFolderPath(selectedPath);
    console.log("Selected public path:", selectedPath);
  }
};

  useEffect(() => {
    if (newFolderPath && selectedType === "public") {
      setDestinationPath(`uploads/AccountId/${accountId}/${newFolderPath}`);
    }
  }, [newFolderPath, selectedType]);
  
  


  if (error) {
    return <div className="p-4 text-sm text-destructive">Error: {error}</div>;
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-background border-l border-border shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
              <div className="flex items-center gap-2">
                <Upload size={16} className="text-primary" />
                <h2 className="text-base font-semibold text-foreground">Select Folder to Upload</h2>
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
            <div className="flex-1 overflow-y-auto px-4 py-3 min-h-[80px]">
              {isLoadingFolders ? (
                <div className="space-y-1.5 px-1 py-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 py-1" style={{ paddingLeft: `${(i % 3) * 12}px` }}>
                      <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
                      <Skeleton className={`h-3 rounded ${i % 2 === 0 ? "w-36" : "w-24"}`} />
                    </div>
                  ))}
                </div>
              ) : structFolder ? (
                renderContents(structFolder.folders, (newFolders) =>
                  setStructFolder({ ...structFolder, folders: newFolders })
                )
              ) : null}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={!file || isUploading}
                onClick={() => { handleSelectFolderPath(); handleSubmitfile(); }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                ) : "Upload"}
              </motion.button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadDocument;