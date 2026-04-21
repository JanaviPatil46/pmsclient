import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Upload,
  FolderPlus,
  FolderUp,
  MoreVertical,
  Folder,
  FolderOpen,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../../../components/ui/motion";

// Dummy components - replace these with your actual components
import UploadDrawer from "./uploadDocumentWorking";
import CreateFolder from "./CreateFolder";
import UploadFolder from "./folderUpload";
import DocumentManager from "../DocumentManager";
import UploadDoc from "../Firm Docs Shared With Client/UplodDoc";
import CreateFolderInFirm from "../Firm Docs Shared With Client/CreateFolder";
import { useParams } from "react-router-dom";
const App = () => {
   const { logindata } = useContext(LoginContext);
    const [loginuserid, setLoginUserId] = useState("");
    const [accId, setAccId] = useState("");
    useEffect(() => {
      if (logindata?.user?.id) {
        const id = logindata.user.id;
        setLoginUserId(id);
        fetchAccountId(id);
      }
    }, [logindata]);
  
    const fetchAccountId = (id) => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://127.0.0.1/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`,
        headers: {},
      };
  
      axios
        .request(config)
        .then((response) => {
          setAccId(response.data.accounts[0]._id);
        })
        .catch((error) => {
          console.log(error);
        });
    };
 
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [file, setFile] = useState(null);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isFolderCreate, setIsFolderCreate] = useState(false);
  const [isUploadFolderFormOpen, setIsUploadFolderFormOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [folderFiles, setFolderFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const folderInputRef = useRef(null);
  const [uploadDocOpen, setUplaodDocOpen] = useState(false);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNewFileChange = (e) => setFile(e.target.files[0]);
  const handleFileUpload = () => setIsDocumentForm(true);
  const handleOpenDrawer = () => setUplaodDocOpen(true);
  const handleCreateFolderClick = () => setIsFolderFormOpen((prev) => !prev);
  const handleNewFolderClick = () => setIsFolderCreate((prev) => !prev);
  const handleFolderSelection = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const folderNameFromPath = files[0].webkitRelativePath.split("/")[0];
      setFolderName(folderNameFromPath);
      setFolderFiles(files);
      setIsDrawerOpen(true);
    }
    e.target.value = "";
  };

  const openDrawer = () => {
    setIsUploadFolderFormOpen(true);
  };

  useEffect(() => {
    if (isDrawerOpen) openDrawer();
  }, [isDrawerOpen]);
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  // const [anchorEl, setAnchorEl] = useState(null);
  const [contextItem, setContextItem] = useState(null);
  const [structFolder, setStructFolder] = useState(null);
  const [sealedStructFolder, setSealedStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [firmDocsFolder, setFirmDocsFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [combinedFolderStructure, setCombinedFolderStructure] = useState(null);

  const templateId = "67ea43c004956fca8db1d445";

  useEffect(() => {
    if (accId) {
      fetchUnSealedFolders();
      fetchSealedFolders();
      fetchPrivateFolders();
      fetchFrimDocsFolders();
    }
  }, [accId]);

  const fetchUnSealedFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/unsealed/${accId}`
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

      setStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching unsealed folders.");
    }
  };

  const fetchSealedFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/sealedFolders/${accId}`
      );
      const folders = res.data.folders || [];

      const addIsOpen = (items, parentId = "") =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed: true,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`)
            : [],
        }));

      setSealedStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
  };

  useEffect(() => {
    fetchBothFolders();
  }, [accId]);

  const fetchBothFolders = async () => {
    try {
      const [sealedRes, unsealedRes] = await Promise.all([
        axios.get(`${DOCS_MANAGMENTS}/admindocs/sealedFolders/${accId}`),
        axios.get(`${DOCS_MANAGMENTS}/admindocs/unsealed/${accId}`),
      ]);

      const addIsOpen = (items, parentId = "", sealed = false) =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`, sealed)
            : [],
        }));

      const sealedFolders = addIsOpen(sealedRes.data.folders || [], "", true);
      const unsealedFolders = addIsOpen(
        unsealedRes.data.folders || [],
        "",
        false
      );

      // Combine into a single parent folder
      const combinedFolders = [
        {
          folder: "Client Uploaded Documents",
          isOpen: false,
          id: "client-root",
          contents: [...sealedFolders, ...unsealedFolders],
        },
      ];

      // Set to a single state
      setCombinedFolderStructure(combinedFolders); // <- new unified state
      console.log("jaanvi patil", combinedFolders);
    } catch (err) {
      setError(err.message || "Error fetching folders.");
    }
  };
  const toggleFolder = (folderId, folders) => {
    return folders.map((item) => {
      if (item.id === folderId) {
        return { ...item, isOpen: !item.isOpen };
      } else if (item.contents?.length) {
        return { ...item, contents: toggleFolder(folderId, item.contents) };
      }
      return item;
    });
  };

  const handleToggle = (id) => {
    setCombinedFolderStructure((prev) => toggleFolder(id, prev));
  };

  // const renderTree = (items) => {
  //   return items.map((item) => {
  //     if (item.folder) {
  //       return (
  //         <div key={item.id} style={{ paddingLeft: "20px" }}>
  //           <div
  //             style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
  //             onClick={() => handleToggle(item.id)}
  //           >
  //             <span>{item.isOpen ? "📂" : "📁"}</span>
  //             <span>{item.folder}</span>
  //             {item.sealed && <span style={{ backgroundColor: "#d50000", color: "#fff", padding: "2px 6px", borderRadius: "8px", fontSize: "12px" }}>Sealed</span>}
  //           </div>
  //           {item.isOpen && item.contents?.length > 0 && (
  //             <div>{renderTree(item.contents)}</div>
  //           )}
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div key={item.id} style={{ paddingLeft: "40px", display: "flex", alignItems: "center", gap: "8px" }}>
  //           <span>📄</span>
  //           <span>{item.file}</span>
  //           {item.sealed && <span style={{ backgroundColor: "#d50000", color: "#fff", padding: "2px 6px", borderRadius: "8px", fontSize: "12px" }}>Sealed</span>}
  //         </div>
  //       );
  //     }
  //   });
  // };

  const [loading, setLoading] = useState(false);
  // const handleAction = async (action, item) => {
  //   console.log(`Action: ${action} on`, item);
  //   setActiveMenu(null); // close menu after action

  //   if (action === 'seal' || action === 'unseal') {
  //     try {
  //       setLoading(true);

  //       // Extract the folder ID from the item's path
  //       const pathParts = item.path.split('/');
  //       const folderId = pathParts[2]; // Assuming format: uploads/FolderTemplates/{id}/...

  //       // Calculate the relative path within the sealed/unsealed directory
  //       const basePath = `uploads/FolderTemplates/${folderId}/Client Uploaded Documents`;
  //       const relativePath = item.path.replace(`${basePath}/${action === 'seal' ? 'unsealed' : 'sealed'}/`, '');

  //       // Call the API to move the item
  //       await axios.post('http://localhost:8000/admin/moveBetweenSealedUnsealed', {
  //         id: folderId,
  //         itemPath: relativePath,
  //         direction: action === 'seal' ? 'toSealed' : 'toUnsealed'
  //       });

  //       // Refresh the data
  //       await fetchBothFolders();

  //       // Show success message
  //       alert(`Item ${action === 'seal' ? 'sealed' : 'unsealed'} successfully`);
  //     } catch (error) {
  //       console.error('Error moving item:', error);
  //       alert(`Failed to ${action} item: ${error.response?.data?.error || error.message}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     // Handle other actions...
  //   }
  // };

  const handleAction = async (action, item) => {
    console.log(`Action: ${action} on`, item);
    setActiveMenu(null); // Close the action menu

    if (action === "seal" || action === "unseal") {
      try {
        setLoading(true);

        // Extract folder ID from item.path
        const pathParts = item.path.split("/");
        const folderId = pathParts[2]; // uploads/AccountId/{id}/...

        // Compute base path
        const basePath = `uploads/AccountId/${folderId}/Client Uploaded Documents`;

        // Get relative path inside unsealed/sealed
        const currentDir = action === "seal" ? "unsealed" : "sealed";
        const relativePath = item.path.replace(
          `${basePath}/${currentDir}/`,
          ""
        );

        // Call backend to move the item
        await axios.post(
          `${DOCS_MANAGMENTS}/admindocs/moveBetweenSealedUnsealed`,
          {
            id: folderId,
            itemPath: relativePath,
            direction: action === "seal" ? "toSealed" : "toUnsealed",
          }
        );

        // Refresh folders
        await fetchBothFolders();

        // Notify success
        alert(`Item ${action === "seal" ? "sealed" : "unsealed"} successfully`);
      } catch (error) {
        console.error("Error moving item:", error);
        alert(
          `Failed to ${action} item: ${error.response?.data?.error || error.message}`
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Other actions if needed
    }
  };

  // const handleAction = (action, item) => {
  //   console.log(`Action: ${action} on`, item);
  //   setActiveMenu(null); // close menu after action
  // };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setActiveMenu(item.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
    setActiveMenu(null);
  };

  const handleMenuAction = (action) => {
    if (selectedItem) {
      handleAction(action, selectedItem); // This function must be defined by you
      handleMenuClose();
    }
  };
  const handleFileOpen = (fileItem) => {
    // Assuming fileItem.filepath = "/uploads/folder1/filename.pdf"
    const baseUrl = `${DOCS_MANAGMENTS}`; // or http://localhost:8000 in dev
    const fileUrl = `${baseUrl}/${fileItem.path}`;

    // window.open(fileUrl, "_blank");
    window.location.href = fileUrl;
  };
  const renderTree = (items) => {
    return items.map((item) => {
      if (item.folder) {
        return (
          <div key={item.id} className="pl-5">
            <div className="group flex items-center justify-between pr-2 rounded-md hover:bg-muted/50 transition-colors">
              <div
                className="flex items-center gap-2 py-1.5 px-2 cursor-pointer flex-1 min-w-0"
                onClick={() => handleToggle(item.id)}
              >
                {item.isOpen
                  ? <FolderOpen size={15} className="shrink-0 text-primary" />
                  : <Folder size={15} className="shrink-0 text-amber-500" />}
                <span className="text-[13px] font-medium text-foreground truncate">{item.folder}</span>
                {item.sealed && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/25">
                    <ShieldAlert size={10} /> Sealed
                  </span>
                )}
              </div>
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleMenuOpen(e, item)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <MoreVertical size={14} />
                </button>
                <AnimatePresence>
                  {activeMenu === item.id && Boolean(anchorEl) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 z-50 mt-1 min-w-[150px] rounded-lg border border-border bg-popover shadow-lg p-1 origin-top-right"
                    >
                      {item.folder === "Client Uploaded Documents" ? (
                        <>
                          <button type="button" onClick={() => handleMenuAction("new-folder")}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">New Folder</button>
                          <button type="button" onClick={() => handleMenuAction("edit")}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">Edit</button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => handleMenuAction("new-folder")}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">New Folder</button>
                          <button type="button" onClick={() => handleMenuAction("edit")}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">Edit</button>
                          <button type="button" onClick={() => handleMenuAction("delete")}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-destructive hover:bg-destructive/10 rounded-md transition-colors">Delete</button>
                          <button type="button" onClick={() => handleMenuAction("move")}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">Move</button>
                          <button type="button" onClick={() => handleMenuAction(item.sealed ? "unseal" : "seal")}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">
                            {item.sealed ? "Unseal" : "Seal"}
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <AnimatePresence initial={false}>
            {item.isOpen && item.contents?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
              >
                {renderTree(item.contents)}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        );
      } else {
        return (
          <div key={item.id} className="group flex items-center justify-between pl-10 pr-2 py-1 rounded-md hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <FileText size={13} className="shrink-0 text-muted-foreground" />
              <span
                onClick={() => handleFileOpen(item)}
                className="text-[13px] text-foreground cursor-pointer hover:text-primary transition-colors truncate"
              >
                {item.file}
              </span>
              {item.sealed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/25">
                  <ShieldAlert size={10} /> Sealed
                </span>
              )}
            </div>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => handleMenuOpen(e, item)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <MoreVertical size={14} />
              </button>
              <AnimatePresence>
                {activeMenu === item.id && Boolean(anchorEl) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 z-50 mt-1 min-w-[150px] rounded-lg border border-border bg-popover shadow-lg p-1 origin-top-right"
                  >
                    <button type="button" onClick={() => handleMenuAction("new-folder")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">New Folder</button>
                    <button type="button" onClick={() => handleMenuAction("edit")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">Edit</button>
                    <button type="button" onClick={() => handleMenuAction("delete")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-destructive hover:bg-destructive/10 rounded-md transition-colors">Delete</button>
                    <button type="button" onClick={() => handleMenuAction("move")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">Move</button>
                    <button type="button" onClick={() => handleMenuAction(item.sealed ? "unseal" : "seal")}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-foreground hover:bg-muted rounded-md transition-colors">
                      {item.sealed ? "Unseal" : "Seal"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      }
    });
  };

  // const renderTree = (items) => {
  //   return items.map((item) => {
  //     if (item.folder) {
  //       return (
  //         <div key={item.id} style={{ paddingLeft: "20px" }}>
  //           <div
  //             style={{
  //               cursor: "pointer",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "space-between",
  //               paddingRight: "8px",
  //             }}
  //           >
  //             <div
  //               style={{ display: "flex", alignItems: "center", gap: "8px" }}
  //               onClick={() => handleToggle(item.id)}
  //             >
  //               <span>{item.isOpen ? "📂" : "📁"}</span>
  //               <span>{item.folder}</span>
  //               {item.sealed && (
  //                 <span
  //                   style={{
  //                     backgroundColor: "#d50000",
  //                     color: "#fff",
  //                     padding: "2px 6px",
  //                     borderRadius: "8px",
  //                     fontSize: "12px",
  //                   }}
  //                 >
  //                   Sealed
  //                 </span>
  //               )}
  //             </div>
  //             {/* <BsThreeDotsVertical style={{ cursor: "pointer" }} /> */}
  //             <div style={{ position: "relative" }}>
  //           <IconButton onClick={(e) => handleMenuOpen(e, item)}>
  //             <BsThreeDotsVertical />
  //           </IconButton>
  //         </div>

  //           </div>
  //           {item.isOpen && item.contents?.length > 0 && (
  //             <div>{renderTree(item.contents)}</div>
  //           )}
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div
  //           key={item.id}
  //           style={{
  //             paddingLeft: "40px",
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "space-between",
  //             paddingRight: "8px",
  //           }}
  //         >
  //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  //             <span>📄</span>
  //             <span  onClick={() => handleFileOpen(item)} style={{cursor:'pointer'}}>{item.file}</span>
  //             {item.sealed && (
  //               <span
  //                 style={{
  //                   backgroundColor: "#d50000",
  //                   color: "#fff",
  //                   padding: "2px 6px",
  //                   borderRadius: "8px",
  //                   fontSize: "12px",
  //                 }}
  //               >
  //                 Sealed
  //               </span>
  //             )}
  //           </div>
  //           <div style={{ position: "relative" }}>
  //           <IconButton onClick={(e) => handleMenuOpen(e, item)}>
  //             <BsThreeDotsVertical />
  //           </IconButton>
  //         </div>
  //         </div>
  //       );
  //     }
  //   });
  // };

  const fetchPrivateFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/privateDocs/${accId}`
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
  const fetchFrimDocsFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/firmDocs/${accId}`
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

      setFirmDocsFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
  };

  const renderPrivateFolderContents = (contents, setContents) =>
    contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updated = contents.map((f, i) =>
            i === index ? { ...f, isOpen: !f.isOpen } : f
          );
          setContents(updated);
        };

        const selectFolder = () => setSelectedFolderId(item.id);

        return (
          <div key={index} className="ml-4 mb-0.5">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFolderId === item.id ? "bg-primary/10 border border-primary/25" : "hover:bg-muted/50"
              }`}
              onClick={selectFolder}
            >
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleFolder(); }} className="shrink-0">
                {item.isOpen ? <FolderOpen size={14} className="text-primary" /> : <Folder size={14} className="text-amber-500" />}
              </button>
              <span className="text-[13px] font-medium text-foreground">{item.folder}</span>
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div className="ml-2">
                {renderPrivateFolderContents(item.contents, (newContents) => {
                  const updated = contents.map((f, i) =>
                    i === index ? { ...f, contents: newContents } : f
                  );
                  setContents(updated);
                })}
              </div>
            )}
          </div>
        );
      } else if (item.file) {
        return (
          <div key={index} className="ml-8 flex items-center gap-2 px-2 py-1 text-[13px] text-muted-foreground">
            <FileText size={13} className="shrink-0" />
            <span onClick={() => handleFileOpen(item)} className="cursor-pointer hover:text-primary transition-colors">
              {item.file}
            </span>
          </div>
        );
      }
      return null;
    });
  const renderFirmDocsFolderContents = (contents, setContents) =>
    contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updated = contents.map((f, i) =>
            i === index ? { ...f, isOpen: !f.isOpen } : f
          );
          setContents(updated);
        };

        const selectFolder = () => setSelectedFolderId(item.id);

        return (
          <div key={index} className="ml-4 mb-0.5">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFolderId === item.id ? "bg-primary/10 border border-primary/25" : "hover:bg-muted/50"
              }`}
              onClick={selectFolder}
            >
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleFolder(); }} className="shrink-0">
                {item.isOpen ? <FolderOpen size={14} className="text-primary" /> : <Folder size={14} className="text-amber-500" />}
              </button>
              <span className="text-[13px] font-medium text-foreground">{item.folder}</span>
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div className="ml-2">
                {renderFirmDocsFolderContents(item.contents, (newContents) => {
                  const updated = contents.map((f, i) =>
                    i === index ? { ...f, contents: newContents } : f
                  );
                  setContents(updated);
                })}
              </div>
            )}
          </div>
        );
      } else if (item.file) {
        return (
          <div key={index} className="ml-8 flex items-center gap-2 px-2 py-1 text-[13px] text-muted-foreground">
            <FileText size={13} className="shrink-0" />
            <span className="font-medium">{item.file}</span>
          </div>
        );
      }
      return null;
    });

  const [firmdata, setFirmData] = useState({ folder: "", contents: [] });
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/firmDocs/${accId}`
      );
      if (response.data && response.data.folder) {
        setFirmData({
          folder: response.data.folder,
          contents: response.data.contents,
        });
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="p-4 text-sm text-destructive">Error: {error}</div>;
  if (!combinedFolderStructure || !privateStructFolder)
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 rounded-lg bg-muted animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-36 rounded-lg" />
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-1" style={{ paddingLeft: `${(i % 3) * 16 + 8}px` }}>
              <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
              <Skeleton className={`h-3 rounded ${i % 2 === 0 ? "w-44" : "w-28"}`} />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-1" style={{ paddingLeft: `${(i % 2) * 16 + 8}px` }}>
              <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
              <Skeleton className={`h-3 rounded ${i % 2 === 0 ? "w-36" : "w-24"}`} />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground mb-4">Admin Portal</h1>

      {/* Client Docs Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.label
          htmlFor="fileInput"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted cursor-pointer transition-colors duration-150"
        >
          <Upload size={15} className="text-primary" />
          Upload Document
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) => { handleFileChange(e); handleFileUpload(); }}
          />
        </motion.label>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCreateFolderClick}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors duration-150"
        >
          <FolderPlus size={15} className="text-primary" />
          Create Folder
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => folderInputRef.current.click()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors duration-150"
        >
          <FolderUp size={15} className="text-primary" />
          Upload Folder
          <input
            type="file"
            ref={folderInputRef}
            className="hidden"
            webkitdirectory="true"
            directory="true"
            onChange={handleFolderSelection}
          />
        </motion.button>
      </div>

      {/* Combined folder tree */}
      <div className="rounded-lg border border-border bg-card p-2 mb-4">
        {renderTree(combinedFolderStructure)}
      </div>

      {/* Private folders */}
      <div className="rounded-lg border border-border bg-card p-2 mb-4">
        {renderPrivateFolderContents(
          privateStructFolder.folders,
          (newFolders) => setPrivateStructFolder({ ...privateStructFolder, folders: newFolders })
        )}
      </div>

      <div className="my-4 border-t border-border" />

      {/* Firm Docs Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.label
          htmlFor="firmDocFileInput"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted cursor-pointer transition-colors duration-150"
        >
          <Upload size={15} className="text-primary" />
          Upload Document in Firm
          <input
            type="file"
            id="firmDocFileInput"
            className="hidden"
            onChange={(e) => { handleNewFileChange(e); handleOpenDrawer(); }}
          />
        </motion.label>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNewFolderClick}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors duration-150"
        >
          <FolderPlus size={15} className="text-primary" />
          Create Folder in Firm
        </motion.button>
      </div>

      {/* ADMIN UPLAOD DOC DRAER */}
      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        accountId={accId}
      />
      {/* FIRM DOCS SHARED WITH CLIENT UPLOAD DOC DRAWER */}
      <UploadDoc
        open={uploadDocOpen}
        onClose={() => setUplaodDocOpen(false)}
        file={file}
      />
      {/* ADMIN CREATE FOLDER DRAWER */}
      <CreateFolder
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        accountId={accId}
      />
      {/* FIRM DOCS SHARED WITH CLIENT CREATE FOLDER DRAWER */}
      <CreateFolderInFirm
        open={isFolderCreate}
        onClose={() => setIsFolderCreate(false)}
      />
      {/* ADMIN UPLAOD FOLDER */}
      <UploadFolder
        open={isUploadFolderFormOpen}
        folderFiles={folderFiles}
        setFolderFiles={setFolderFiles}
        setFolderName={setFolderName}
        folderName={folderName}
        onClose={() => setIsUploadFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
      />
    </>
  );
};

export default App;
