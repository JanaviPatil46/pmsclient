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
import {
  Box,
  Typography,
  IconButton,
  Input,
  Stack,
  Grid,
} from "@mui/material";
import { LoginContext } from "../../context/Context";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { useState, useContext, useEffect } from "react";
import { FaRegFolderClosed } from "react-icons/fa6";
import axios from "axios";
import CreateFolder from "./AdminPortal/CreateFolder";
import UploadDrawer from "./AdminPortal/uploadDocumentWorking";
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
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE || "http://127.0.0.1:8000";
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const fetchAccountId = async (id) => {
    try {
      const response = await axios.get(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyuserid/${id}`
      );
      if (response.data.accounts && response.data.accounts.length > 0) {
        setAccId(response.data.accounts[0]._id);
        setAccountName(response.data.accounts[0].accountName)
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

  const renderTree = (items) => {
    return items.map((item) => {
      if (item.folder) {
        return (
          <div key={item.id} style={{ paddingLeft: "20px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "8px",
              }}
              onClick={() => handleToggle(item.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{item.isOpen ? "📂" : "📁"}</span>
                <span>{item.folder}</span>
                {item.sealed && (
                  <span style={{
                    backgroundColor: "#d50000",
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}>
                    Sealed
                  </span>
                )}
              </div>
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div>{renderTree(item.contents)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={item.id}
            style={{
              paddingLeft: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📄</span>
              <span style={{ cursor: "pointer" }}>
                {item.file}
              </span>
              {item.sealed && (
                <span style={{
                  backgroundColor: "#d50000",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}>
                  Sealed
                </span>
              )}
            </div>
          </div>
        );
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!combinedFolderStructure) return <div>No documents found</div>;

  return (
    <Box sx={{
      width: "100%",
      maxWidth: { sm: "100%", md: "1700px" },
      flexGrow: 1,
      height: "90vh",
      p: 1,
    }}>
      <Box>
        <Stack sx={{ height: "auto" }}>
          <Grid container spacing={2} sx={{ p: 1 }}>
            <Grid item xs={12} md={6}>
              <Stack>
                <Box sx={{
                  // backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "16px",
                  maxWidth: "800px",
                }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        component="label"
                        htmlFor="fileInput"
                        sx={{ color: "#e87800" }}
                      >
                        <HiDocumentArrowUp size={24} />
                      </IconButton>
                      <Typography
                        variant="body1"
                        component="label"
                        htmlFor="fileInput"
                        sx={{ cursor: "pointer" }}
                      >
                        Upload Document
                      </Typography>
                      <Input
                        type="file"
                        id="fileInput"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                          setIsDocumentForm(true);
                        }}
                        sx={{ display: "none" }}
                      />
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      onClick={() => setIsFolderFormOpen(prev => !prev)}
                    >
                      <IconButton sx={{ color: "#e87800" }}>
                        <FaRegFolderClosed size={20} />
                      </IconButton>
                      <Typography variant="body1" sx={{ cursor: "pointer" }}>
                        Create Folder
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
        <Box mt={2}>
          {renderTree(combinedFolderStructure)}
        </Box>

        <CreateFolder
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        // fetchUnSealedFolders={fetchUnSealedFolders}
        
        fetchBothFolders={fetchBothFolders}
        accountId={accId}
      />

      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        // fetchUnSealedFolders={fetchUnSealedFolders}
       accountName={accountName}
        accountId={accId}
        fetchBothFolders={fetchBothFolders}
      />

      </Box>
    </Box>
  );
};

export default Document;