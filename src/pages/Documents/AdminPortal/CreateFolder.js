import React, { useEffect, useState } from "react";
import { X, FolderPlus, Folder, FolderOpen, FileText } from "lucide-react";
import axios from "axios";

const CreateFolder = ({
  open,
  onClose,
  fetchUnSealedFolders,
  fetchAdminPrivateFolders,
  accountId,  fetchBothFolders
}) => {
  const templateId = "67ea43c004956fca8db1d445";

  useEffect(() => {
    console.log("account id selected",accountId);
  }, [accountId]);

  const [newFolderName, setNewFolderName] = useState("");

  const [structFolder, setStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [privateFolderPath, setPrivateFolderPath] = useState("");
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const fetchFolders = async () => {
    try {
      const url = `${DOCS_MANAGMENTS}/admindocs/clientDocs/${accountId}`;
      const response = await axios.get(url);
      const addIsOpenProperty = (folders, parentId = null) =>
        folders.map((folder, index) => ({
          ...folder,
          isOpen: false, // Set to false to close all folders initially
          id: `${parentId ? `${parentId}-` : ""}${index}`,
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
      // fetchBothFolders()
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
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        // const selectFolder = () => setSelectedFolderId(item.id);
        const selectFolder = () => {
          setSelectedFolderId(item.id);
          setSelectedType("public");
        };

        return (
          <div key={index} className="ml-4 mb-0.5">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFolderId === item.id && selectedType === "public"
                  ? "bg-primary/10 border border-primary/25"
                  : "hover:bg-muted/60"
              }`}
              onClick={selectFolder}
            >
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleFolder(); }} className="shrink-0">
                {item.isOpen ? <FolderOpen size={15} className="text-primary" /> : <Folder size={15} className="text-amber-500" />}
              </button>
              <span className={`text-[13px] font-medium truncate ${
                selectedFolderId === item.id && selectedType === "public" ? "text-primary" : "text-foreground"
              }`}>{item.folder}</span>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div className="ml-2">
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

  const renderPrivateContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        // const selectFolder = () => setSelectedFolderId(item.id);
        const selectFolder = () => {
          setSelectedFolderId(item.id);
          setSelectedType("private");
        };

        return (
          <div key={index} className="ml-4 mb-0.5">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFolderId === item.id && selectedType === "private"
                  ? "bg-primary/10 border border-primary/25"
                  : "hover:bg-muted/60"
              }`}
              onClick={selectFolder}
            >
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleFolder(); }} className="shrink-0">
                {item.isOpen ? <FolderOpen size={15} className="text-primary" /> : <Folder size={15} className="text-amber-500" />}
              </button>
              <span className={`text-[13px] font-medium truncate ${
                selectedFolderId === item.id && selectedType === "private" ? "text-primary" : "text-foreground"
              }`}>{item.folder}</span>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div className="ml-2">
                {renderPrivateContents(item.contents, (newContents) => {
                  const updatedFolders = contents.map((folder, i) =>
                    i === index ? { ...folder, contents: newContents } : folder
                  );
                  setContents(updatedFolders);
                })}
              </div>
            )}
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
  // const createFolderAPI = (newFolderPath) => {
  //   return axios
  //     .get(
  //       `http://localhost:8000/createFolder/?path=uploads/FolderTemplates/${templateId}/${newFolderPath}&foldername=${newFolderName}`
  //     )
  //     .then((response) => {
  //       console.log("API Response:", response.data);
  //       //fetchFolders();
  //       //renderContents();
  //       return response.data;
  //       //setNewFolderName(""); // Clear input field
  //     })
  //     .catch((error) => {
  //       console.log("API Error:", error);
  //       throw error;
  //     });
  // };
  // const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const createFolderAPI = () => {
    if (!destinationPath || !newFolderName) {
      console.log("Missing path or folder name.");
      return;
    }
  
    return axios
      .get(
        `${DOCS_MANAGMENTS}/createnewFolder/?path=${destinationPath}&foldername=${newFolderName}`
      )
      .then((response) => {
        console.log("API Response:", response.data);
        setNewFolderName(""); // Clear input
        fetchBothFolders()
        onClose()
        fetchUnSealedFolders()
        fetchAdminPrivateFolders()

        return response.data;
      })
      .catch((error) => {
        console.log("API Error:", error);
        throw error;
      });
  };
  

  const handleSelectFolderPath = () => {
    const getFolderPath = (folders, parentPath = "") => {
      for (let folder of folders) {
        const currentPath = `${parentPath}/${folder.folder}`;

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

    // if (selectedType === "public" && structFolder?.folders) {
    //   const selectedPath = getFolderPath(structFolder.folders);
    //   setNewFolderPath(selectedPath);
    //   console.log("Selected public path:", selectedPath);
    // }

    if (selectedType === "public" && structFolder?.folders) {
      let selectedPath = getFolderPath(structFolder.folders);

      // Append /unsealed if the selected folder is "Client Uploaded Documents"
      // if (selectedPath === "/Client Uploaded Documents") {
      //   selectedPath += "/unsealed";
      // }
      // Inject "unsealed" if path starts with "/Client Uploaded Documents"
      if (selectedPath?.startsWith("/Client Uploaded Documents")) {
        selectedPath = selectedPath.replace(
          "/Client Uploaded Documents",
          "/Client Uploaded Documents/unsealed"
        );
      }

      setNewFolderPath(selectedPath);
      console.log("Selected public path:", selectedPath);
    }

    if (selectedType === "private" && privateStructFolder?.folders) {
      const selectedPath = getFolderPath(privateStructFolder.folders);
      setPrivateFolderPath(selectedPath);
      console.log("Selected private path:", selectedPath);
    }
  };

  useEffect(() => {
    if (newFolderPath && selectedType === "public") {
      setDestinationPath(
        `uploads/AccountId/${accountId}/${newFolderPath}`
      );
    }
  }, [newFolderPath, selectedType]);

  useEffect(() => {
    if (privateFolderPath && selectedType === "private") {
      setDestinationPath(
        `uploads/AccountId/${accountId}/${privateFolderPath}`
      );
    }
  }, [privateFolderPath, selectedType]);

  if (error) {
    return <div className="p-4 text-sm text-destructive">Error: {error}</div>;
  }

  if (!structFolder || !privateStructFolder) {
    return null;
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <FolderPlus size={16} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Create New Folder</h2>
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Folder Name</label>
            <input
              type="text"
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Select Destination</p>
            <div className="rounded-lg border border-border bg-muted/20 py-2">
              {renderContents(structFolder.folders, (newFolders) =>
                setStructFolder({ ...structFolder, folders: newFolders })
              )}
              {renderPrivateContents(privateStructFolder.folders, (newFolders) =>
                setPrivateStructFolder({ ...privateStructFolder, folders: newFolders })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={createFolderAPI}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Create Folder
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

export default CreateFolder;


// import { Typography,Box,Drawer,Button } from '@mui/material'
// import React from 'react'

// const CreateFolder = ({
//   open,
//   onClose,
//   fetchUnSealedFolders,
//   fetchAdminPrivateFolders,
//   accountId
// }) => {
//   return (
//     <Box>
//     <Drawer anchor="right" open={open} onClose={onClose}>
      
//       <Box
//         sx={{
//           backgroundColor: "#fff",
//           borderRadius: "8px",

//           padding: 2,
//           width: 600,
//           fontFamily:
//             "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6">Create folder new </Typography>
//           <IconButton onClick={onClose}>
//             <MdClose />
//           </IconButton>
//         </Box>
//         <TextField
//           fullWidth
//           size="small"
//           variant="outlined"
//           placeholder="Folder Name"
//           // value={newFolderName}
//           // onChange={(e) => setNewFolderName(e.target.value)}
//         />
//         <Button
//           variant="contained"
//           sx={{ mt: 2 }}
//           // onClick={createFolderAPI}
//         >
//           Create Folder
//         </Button>

//         <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
//           {/* {renderContents(structFolder.folders, (newFolders) =>
//             setStructFolder({ ...structFolder, folders: newFolders })
//           )}

//           {renderPrivateContents(privateStructFolder.folders, (newFolders) =>
//             setPrivateStructFolder({
//               ...privateStructFolder,
//               folders: newFolders,
//             })
//           )} */}
//         </Box>
//       </Box>
//     </Drawer>
//   </Box>
//   )
// }

// export default CreateFolder
