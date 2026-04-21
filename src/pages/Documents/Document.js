// import React from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Input,
//   Stack,
//   Grid,
//   Divider,
//   Paper,
// } from "@mui/material";
// import { LoginContext } from "../../context/Context";

// import { HiDocumentArrowUp } from "react-icons/hi2";
// import { useState, useContext, useEffect } from "react";
// import { FaRegFolderClosed } from "react-icons/fa6";


// import axios from "axios";
// const Document = () => {
//   const { logindata } = useContext(LoginContext);
//   const [loginuserid, setLoginUserId] = useState("");
//   const [accId, setAccId] = useState("");
//   useEffect(() => {
//     if (logindata?.user?.id) {
//       const id = logindata.user.id;
//       setLoginUserId(id);
//       fetchAccountId(id);
//     }
//   }, [logindata]);

//   const fetchAccountId = (id) => {
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: `http://127.0.0.1/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`,
//       headers: {},
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         setAccId(response.data.accounts[0]._id);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   const [file, setFile] = useState(null);
//     const [isDocumentForm, setIsDocumentForm] = useState(false);
//       const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
//  const handleFileUpload = () => setIsDocumentForm(true);
//  const [structFolder, setStructFolder] = useState(null);
//  const [sealedStructFolder, setSealedStructFolder] = useState(null);
//   const [isFolderCreate, setIsFolderCreate] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//    const handleFileChange = (e) => setFile(e.target.files[0]);
//      const [privateStructFolder, setPrivateStructFolder] = useState(null);
//        const [error, setError] = useState(null);
//   const handleCreateFolderClick = () => setIsFolderFormOpen((prev) => !prev);
//    const [combinedFolderStructure, setCombinedFolderStructure] = useState(null);
//     const toggleFolder = (folderId, folders) => {
//     return folders.map((item) => {
//       if (item.id === folderId) {
//         return { ...item, isOpen: !item.isOpen };
//       } else if (item.contents?.length) {
//         return { ...item, contents: toggleFolder(folderId, item.contents) };
//       }
//       return item;
//     });
//   };
//     const handleToggle = (id) => {
//     setCombinedFolderStructure((prev) => toggleFolder(id, prev));
//   };
//   //  const handleFileOpen = (fileItem) => {
   
//   //   const baseUrl = `${DOCS_MANAGMENTS}`; // or http://localhost:8000 in dev
//   //   const fileUrl = `${baseUrl}/${fileItem.path}`;

//   //   // window.open(fileUrl, "_blank");
//   //   window.location.href = fileUrl;
//   // };

//  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
//     const fetchUnSealedFolders = async () => {
//     try {
//       const res = await axios.get(
//         `${DOCS_MANAGMENTS}/admindocs/unsealed/${accId}`
//       );
//       const folders = res.data.folders || [];

//       const addIsOpen = (items, parentId = "") =>
//         items.map((folder, index) => ({
//           ...folder,
//           isOpen: false,
//           id: `${parentId}${index}`,
//           sealed: false,
//           contents: folder.contents
//             ? addIsOpen(folder.contents, `${parentId}${index}-`)
//             : [],
//         }));

//       setStructFolder({ ...res.data, folders: addIsOpen(folders) });
//     } catch (err) {
//       setError(err.message || "Error fetching unsealed folders.");
//     }
//   };

//   const fetchSealedFolders = async () => {
//     try {
//       const res = await axios.get(
//         `${DOCS_MANAGMENTS}/admindocs/sealedFolders/${accId}`
//       );
//       const folders = res.data.folders || [];

//       const addIsOpen = (items, parentId = "") =>
//         items.map((folder, index) => ({
//           ...folder,
//           isOpen: false,
//           id: `${parentId}${index}`,
//           sealed: true,
//           contents: folder.contents
//             ? addIsOpen(folder.contents, `${parentId}${index}-`)
//             : [],
//         }));

//       setSealedStructFolder({ ...res.data, folders: addIsOpen(folders) });
//     } catch (err) {
//       setError(err.message || "Error fetching sealed folders.");
//     }
//   };

//   useEffect(() => {
//     fetchBothFolders();
//   }, [accId]);
//  useEffect(() => {
//     if (accId) {
//       fetchUnSealedFolders();
//       fetchSealedFolders();
    
//     }
//   }, [accId]);
//   const fetchBothFolders = async () => {
//     try {
//       const [sealedRes, unsealedRes] = await Promise.all([
//         axios.get(`${DOCS_MANAGMENTS}/admindocs/sealedFolders/${accId}`),
//         axios.get(`${DOCS_MANAGMENTS}/admindocs/unsealed/${accId}`),
//       ]);

//       const addIsOpen = (items, parentId = "", sealed = false) =>
//         items.map((folder, index) => ({
//           ...folder,
//           isOpen: false,
//           id: `${parentId}${index}`,
//           sealed,
//           contents: folder.contents
//             ? addIsOpen(folder.contents, `${parentId}${index}-`, sealed)
//             : [],
//         }));

//       const sealedFolders = addIsOpen(sealedRes.data.folders || [], "", true);
//       const unsealedFolders = addIsOpen(
//         unsealedRes.data.folders || [],
//         "",
//         false
//       );

//       // Combine into a single parent folder
//       const combinedFolders = [
//         {
//           folder: "Client Uploaded Documents",
//           isOpen: false,
//           id: "client-root",
//           contents: [...sealedFolders, ...unsealedFolders],
//         },
//       ];

//       // Set to a single state
//       setCombinedFolderStructure(combinedFolders); // <- new unified state
//       console.log("jaanvi patil", combinedFolders);
//     } catch (err) {
//       setError(err.message || "Error fetching folders.");
//     }
//   };
//   const renderTree = (items) => {
//     return items.map((item) => {
//       if (item.folder) {
//         return (
//           <div key={item.id} style={{ paddingLeft: "20px" }}>
//             <div
//               style={{
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 paddingRight: "8px",
//               }}
//             >
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "8px" }}
//                 onClick={() => handleToggle(item.id)}
//               >
//                 <span>{item.isOpen ? "📂" : "📁"}</span>
//                 <span>{item.folder}</span>
//                 {item.sealed && (
//                   <span
//                     style={{
//                       backgroundColor: "#d50000",
//                       color: "#fff",
//                       padding: "2px 6px",
//                       borderRadius: "8px",
//                       fontSize: "12px",
//                     }}
//                   >
//                     Sealed
//                   </span>
//                 )}
//               </div>
              
//             </div>
//             {item.isOpen && item.contents?.length > 0 && (
//               <div>{renderTree(item.contents)}</div>
//             )}
//           </div>
//         );
//       } else {
//         return (
//           <div
//             key={item.id}
//             style={{
//               paddingLeft: "40px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               paddingRight: "8px",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <span>📄</span>
//               <span
//                 // onClick={() => handleFileOpen(item)}
//                 style={{ cursor: "pointer" }}
//               >
//                 {item.file}
//               </span>
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
            
//           </div>
//         );
//       }
//     });
//   };

//     if (error) return <div>Error: {error}</div>;
//   if (!combinedFolderStructure || !privateStructFolder) return <div></div>;
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: { sm: "100%", md: "1700px" },
//         flexGrow: 1,
//         height: "90vh",
//         p: 1,
//       }}
//     >
//       <Box>
//         <Box>
//           <Stack sx={{ height: "auto" }}>
//             {/* <Box sx={{ flexGrow: 1, p: 2 }}> */}
//             <Grid container spacing={2} sx={{ p: 1 }}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Stack>
//                   <Box
//         sx={{
//           backgroundColor: "#fff",
//           borderRadius: "8px",
//           padding: "16px",
//           maxWidth: "800px",
//         }}
//       >
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <IconButton
//               component="label"
//               htmlFor="fileInput"
//               sx={{ color: "#e87800" }}
//             >
//               <HiDocumentArrowUp size={24} />
//             </IconButton>
//             <Typography
//               variant="body1"
//               component="label"
//               htmlFor="fileInput"
//               sx={{ cursor: "pointer" }}
//             >
//               Upload Document
//             </Typography>
//             <Input
//               type="file"
//               id="fileInput"
//               onChange={(e) => {
//                 handleFileChange(e);
//                 handleFileUpload();
//               }}
//               sx={{ display: "none" }}
//             />
//           </Box>

//           <Box
//             sx={{ display: "flex", alignItems: "center", gap: 1 }}
//             onClick={handleCreateFolderClick}
//           >
//             <IconButton sx={{ color: "#e87800" }}>
//               <FaRegFolderClosed size={20} />
//             </IconButton>
//             <Typography variant="body1" sx={{ cursor: "pointer" }}>
//               Create Folder
//             </Typography>
//           </Box>

         

          
//         </Box>

        
//       </Box>
//                 </Stack>
//               </Grid>

             
//             </Grid>
//           </Stack>
//         </Box>
//         <Box mt={2}>
//          {renderTree(combinedFolderStructure)}
//         </Box>

       
//       </Box>
//     </Box>
//   );
// };

// export default Document;


import React from "react";
import { LoginContext } from "../../context/Context";
import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "material-react-toastify";
import EditNameDrawer from "./EditNameDrawer";
import MoveFile from "./MoveFile";
import FileExplorer from "./FileExplorer";
import CreateFolder from "./AdminPortal/CreateFolder";
import UploadDrawer from "./AdminPortal/uploadDocumentWorking";
import {
  FolderPlus,
  Upload,
  FolderUp,
  Trash2,
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Pencil,
  Trash,
  Download,
  Lock,
  Unlock,
  Files,
  Loader2,
} from "lucide-react";
const Document = () => {
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  const [accId, setAccId] = useState("");
  const [file, setFile] = useState(null);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [combinedFolderStructure, setCombinedFolderStructure] = useState(null);
const [accountName,setAccountName]= useState("")
const [accountEmailSync, setAccountEmailSync]=useState("")
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE || "http://127.0.0.1:8000";
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const fetchAccountId = async (id) => {
    try {
      const response = await axios.get(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`
      );
      if (response.data.accounts && response.data.accounts.length > 0) {
        console.log("accounts resopnace",response.data.accounts)
        setAccId(response.data.accounts[0]._id);
        setAccountName(response.data.accounts[0].accountName)
        setAccountEmailSync(response.data.accounts[0].adminUserId?.emailSyncEmail)
console.log("emailsyn",response.data.accounts[0].adminUserId?.emailSyncEmail)
      } else {
        setError("No account found for this user");
      }
    } catch (error) {
      setError("Failed to fetch account details");
    }
  };

  const fetchBothFolders = async () => {
    try {
      setIsLoading(true);
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
      const unsealedFolders = addIsOpen(unsealedRes.data.folders || [], "", false);

      setCombinedFolderStructure([
        {
          folder: "Client Uploaded Documents",
          isOpen: false,
          id: "client-root",
          contents: [...sealedFolders, ...unsealedFolders],
        },
      ]);
    } catch (err) {
      setError(err.message || "Error fetching folders.");
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
      fetchAccountId(id);
    }
  }, [logindata]);

  useEffect(() => {
    if (accId) {
      fetchBothFolders();
    }
  }, [accId]);
   const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
   const [loading, setLoading] = useState(false);
const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setActiveMenu(item.id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedItem(null);
    setTimeout(() => setSelectedItem(null), 100);
    setActiveMenu(null);
  };
  const handleMenuAction = (action) => {
    if (selectedItem) {
      handleAction(action, selectedItem); // This function must be defined by you
      handleMenuClose();
    }
  };
  const handleFileOpen = (fileItem) => {
   
    const baseUrl = `${DOCS_MANAGMENTS}`; // or http://localhost:8000 in dev
    const fileUrl = `${baseUrl}/${fileItem.path}`;

    // window.open(fileUrl, "_blank");
    window.location.href = fileUrl;
  };
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleEdit = (item) => {
    console.log("Edit", item);
    setSelectedItem(item);
    setDrawerOpen(true);
  };
  const handleRename = async (item, newName, itemPath) => {
    console.log("path", item);
    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/admindocs/rename-item`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPath: itemPath,
            newName,
            // id: item.id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Renamed:", data);
        toast.success("Renamed successfully")
        fetchBothFolders();
        // fetchPrivateFolders();
        // Refresh your data list here
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Rename failed", error);
    }
  };
    const [sourceFile, setSourceFile] = useState(null);
    const handleFileMove = () => setIsMoveDocument(true);
     const [isMoveDocument, setIsMoveDocument] = useState(false);
 const handleMove = (item) => {
    console.log("Move Hi jan v kujaki", item.path);
    setSourceFile(item.path);

  };
   const handleDelete = (item) => {
      console.log("Delete", item);
  
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        path: item.path, // dynamically from item
        id: item.id, // dynamically from item
      });
  
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
  
      fetch(`${DOCS_MANAGMENTS}/admindocs/delete-item`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("Delete Result:", result);
          toast.success("Deleted successfully");
          fetchBothFolders();
          // fetchPrivateFolders();
        })
        .catch((error) => console.error("Delete Error:", error));
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
  //             onClick={() => handleToggle(item.id)}
  //           >
  //             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  //               <span>{item.isOpen ? "📂" : "📁"}</span>
  //               <span>{item.folder}</span>
  //               {item.sealed && (
  //                 <span style={{
  //                   backgroundColor: "#d50000",
  //                   color: "#fff",
  //                   padding: "2px 6px",
  //                   borderRadius: "8px",
  //                   fontSize: "12px",
  //                 }}>
  //                   Sealed
  //                 </span>
  //               )}
  //             </div>
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
  //             <span style={{ cursor: "pointer" }}>
  //               {item.file}
  //             </span>
  //             {item.sealed && (
  //               <span style={{
  //                 backgroundColor: "#d50000",
  //                 color: "#fff",
  //                 padding: "2px 6px",
  //                 borderRadius: "8px",
  //                 fontSize: "12px",
  //               }}>
  //                 Sealed
  //               </span>
  //             )}
  //           </div>
  //         </div>
  //       );
  //     }
  //   });
  // };
  const menuRef = useRef(null);

  const renderTree = (items, depth = 0) => {
    return items.map((item) => {
      if (item.folder) {
        const isRoot = item.folder === "Client Uploaded Documents";
        return (
          <div key={item.id}>
            <div
              className={`group flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-muted/50 ${
                item.isOpen ? "bg-muted/30" : ""
              }`}
              style={{ paddingLeft: `${8 + depth * 16}px` }}
            >
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                <span className="shrink-0 text-muted-foreground transition-transform duration-150">
                  {item.isOpen
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />}
                </span>
                {item.isOpen
                  ? <FolderOpen size={15} className="shrink-0 text-amber-500" />
                  : <Folder size={15} className="shrink-0 text-amber-500" />}
                <span className="text-[13px] font-medium text-foreground truncate">
                  {item.folder}
                </span>
                {item.sealed && (
                  <span className="ml-1 shrink-0 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                    <Lock size={9} /> Sealed
                  </span>
                )}
              </button>
              {!isRoot && (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleMenuOpen(e, item)}
                    className="flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-all duration-150"
                  >
                    <MoreVertical size={13} />
                  </button>
                </div>
              )}
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div>{renderTree(item.contents, depth + 1)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={item.id}
            className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-muted/50"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-3.5 shrink-0" />
              <FileText size={14} className="shrink-0 text-muted-foreground" />
              <span className="text-[13px] text-foreground truncate">{item.file}</span>
              {item.sealed && (
                <span className="ml-1 shrink-0 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                  <Lock size={9} /> Sealed
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => handleMenuOpen(e, item)}
              className="flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-all duration-150 shrink-0"
            >
              <MoreVertical size={13} />
            </button>
          </div>
        );
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 h-[90vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-primary animate-spin" />
          <p className="text-[13px] text-muted-foreground">Loading documents…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 h-[90vh] items-center justify-center bg-background">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-5 text-center max-w-sm">
          <p className="text-sm font-semibold text-destructive">Failed to load documents</p>
          <p className="text-[13px] text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1700px] flex-1 h-[90vh] overflow-auto font-sans">
      <div className="p-4 sm:p-6 flex flex-col gap-5">

        {/* ── Page header ── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Files size={16} className="text-primary" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documents</h1>
          </div>
          <p className="text-[13px] text-muted-foreground pl-10">
            Manage your folders and uploaded files.
          </p>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* New Folder */}
          <button
            type="button"
            onClick={() => setIsFolderFormOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
          >
            <FolderPlus size={14} strokeWidth={2} />
            New Folder
          </button>

          {/* Upload File */}
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-semibold text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm">
            <Upload size={14} strokeWidth={2} />
            Upload File
            <input
              type="file"
              id="fileInput"
              hidden
              onChange={(e) => {
                setFile(e.target.files[0]);
                setIsDocumentForm(true);
              }}
            />
          </label>
        </div>

        {/* ── Folder tree card ── */}
        {combinedFolderStructure ? (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <Folder size={15} className="text-amber-500 shrink-0" />
              <p className="text-[13px] font-semibold text-foreground tracking-tight">Folder Tree</p>
            </div>
            {/* Tree body */}
            <div className="p-3">
              {renderTree(combinedFolderStructure)}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm p-12 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Folder size={22} className="text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">No documents found</p>
            <p className="text-[13px] text-muted-foreground">Create a folder to get started.</p>
          </div>
        )}

        {/* ── File Explorer ── */}
        <FileExplorer accountId={accId} />

      </div>

      {/* ── Context menu dropdown ── */}
      {Boolean(anchorEl) && selectedItem && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={handleMenuClose} />
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: anchorEl?.getBoundingClientRect().bottom + window.scrollY + 4,
              left: anchorEl?.getBoundingClientRect().right + window.scrollX - 144,
              zIndex: 9999,
            }}
            className="w-36 rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
          >
            {selectedItem?.folder === "Client Uploaded Documents" ? (
              <>
                <button disabled className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-muted-foreground opacity-40 cursor-not-allowed">
                  <Pencil size={13} /> Edit
                </button>
                <button disabled className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-muted-foreground opacity-40 cursor-not-allowed">
                  <Trash size={13} /> Delete
                </button>
              </>
            ) : selectedItem?.folder ? (
              <>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-foreground hover:bg-muted transition-colors"
                  onClick={() => { handleEdit(selectedItem); handleMenuClose(); }}
                >
                  <Pencil size={13} className="text-muted-foreground" /> Edit
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => { handleDelete(selectedItem); handleMenuClose(); }}
                >
                  <Trash size={13} /> Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-foreground hover:bg-muted transition-colors"
                  onClick={() => { handleEdit(selectedItem); handleMenuClose(); }}
                >
                  <Pencil size={13} className="text-muted-foreground" /> Edit
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-foreground hover:bg-muted transition-colors"
                  onClick={() => { handleFileOpen(selectedItem); handleMenuClose(); }}
                >
                  <Download size={13} className="text-muted-foreground" /> Download
                </button>
                <div className="my-0.5 border-t border-border/60" />
                <button
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => { handleDelete(selectedItem); handleMenuClose(); }}
                >
                  <Trash size={13} /> Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ── Drawers ── */}
      <CreateFolder
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        fetchBothFolders={fetchBothFolders}
        accountId={accId}
      />

      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        accountName={accountName}
        accountId={accId}
        fetchBothFolders={fetchBothFolders}
        accountEmailSync={accountEmailSync}
      />

      <EditNameDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedItem}
        onRename={handleRename}
      />

      <MoveFile
        open={isMoveDocument}
        onClose={() => setIsMoveDocument(false)}
        fetchBothFolders={fetchBothFolders}
        accountId={accId}
        sourceFile={sourceFile}
        isMoveDocument={isMoveDocument}
      />
    </div>
  );
};

export default Document;