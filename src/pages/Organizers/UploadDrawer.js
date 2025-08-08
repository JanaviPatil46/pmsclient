import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Typography, Drawer } from "@mui/material";
import { FaTimes } from "react-icons/fa";

const UploadDocument = ({ open, onClose, file ,onUploadSuccess,onUploadError,accountId,organizer,uploadedFiles,setUploadedFiles}) => {
 
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
 const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const [structFolder, setStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
 
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");

  
  const fetchFolders = async () => {
  try {
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
        <div key={index} style={{ marginLeft: "20px", marginBottom: "4px" }}>
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "6px 8px",
              borderRadius: "4px",
              backgroundColor:
                selectedFolderId === item.id && selectedType === "public" 
                  ? "#f0f7ff" 
                  : "transparent",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={selectFolder}
          >
            <div
              onClick={toggleFolder}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span style={{ marginRight: "8px" }}>
                {item.isOpen ? "📂" : "📁"}
              </span>
              <strong
                style={{
                  fontWeight: 500,
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                {item.folder}
              </strong>
            </div>
          </div>
          {item.isOpen && item.contents && item.contents.length > 0 && (
            <div style={{ marginTop: "4px" }}>
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
        <div
          key={index}
          style={{
            marginLeft: "40px",
            padding: "4px 8px",
            fontSize: "14px",
            color: "#555",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "8px" }}>📄</span>
          {item.file}
        </div>
      );
    }
    return null;
  });
};

  
//   const handleSubmitfile = async (e) => {
   
  
//     let data = new FormData();
//     data.append("destinationPath", destinationPath);
//     data.append("file", file);
// //   data.append("accountName", accountName);
// //   data.append("accountEmailSync", accountEmailSync)
//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${DOCS_MANAGMENTS}/uploadfiledocument`,
//       data: data,
//     };
  
//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//         alert("File uploaded successfully!");
//         onClose();
       
//         // fetchBothFolders()
      
//         setSelectedFolderId(null);
//       })
//       .catch((error) => {
//         console.error(error);
//         alert("Failed to upload the file.");
//       });
//   };

const handleSubmitfile = async (e) => {
  try {
    if (!file) {
      throw new Error("No file selected");
    }

    if (!destinationPath) {
      throw new Error("No destination folder selected");
    }

    // 1. First upload the file to the document management system
    let data = new FormData();
    data.append("destinationPath", destinationPath);
    data.append("file", file);
    
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${DOCS_MANAGMENTS}/uploadfiledocument`,
      data: data,
    };

    const uploadResponse = await axios.request(config);
    console.log("File upload response:", uploadResponse.data);
    
    // 2. Get the uploaded file details from the response
    const uploadedFile = uploadResponse.data;
    
    // 3. Update the organizer with the file information
    const organizerUpdateResponse = await updateOrganizerWithFile(uploadedFile.fileName);
    console.log("Organizer update response:", organizerUpdateResponse);
    
    // 4. Update local state
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    
    if (key) {
      setUploadedFiles(prev => ({
        ...prev,
        [key]: uploadedFile.fileName
      }));
    }
    
    // 5. Handle success
    alert("File uploaded and organizer updated successfully!");
    onClose();
    setSelectedFolderId(null);
    
    // 6. Call the success callback if provided
    if (onUploadSuccess) {
      onUploadSuccess(uploadedFile);
    }
    
  } catch (error) {
    console.error("File upload error:", error);
    alert(error.message || "Failed to upload the file or update organizer.");
    
    // Call the error callback if provided
    if (onUploadError) {
      onUploadError(error);
    }
  }
};

const updateOrganizerWithFile = async (fileName) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    // Find which section and element this file belongs to
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    
    if (!key) {
      throw new Error("Could not find the corresponding form element for this file");
    }

    // Prepare the update data to include the file in the specific form element
    const updateData = {
      sections: organizer.sections.map(section => {
        // Find the section that contains this file
        if (key.startsWith(`${section.id}_`)) {
          return {
            ...section,
            formElements: section.formElements.map(element => {
              // Find the specific form element (File Upload type)
              if (key.endsWith(`_${element.text}`) && element.type === "File Upload") {
                return {
                  ...element,
                  textvalue: fileName, // Store the file name in textvalue
                  fileMetadata: {    // Add file metadata
                    fileName: fileName,
                    filePath: destinationPath,
                    uploadedAt: new Date().toISOString()
                  }
                };
              }
              return element;
            })
          };
        }
        return section;
      }),
      lastSaved: new Date().toISOString()
    };

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(updateData),
      redirect: "follow"
    };

    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update organizer with file info");
    }

    return result;
  } catch (error) {
    console.error("Error updating organizer:", error);
    throw error;
  }
};
// const updateOrganizerWithFile = async (fileName) => {
//   try {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
    
//     // Prepare the update data
//     const updateData = {
//       fileMetadata: {
//         fileName: fileName,
//         uploadedAt: new Date().toISOString()
//       },
//       lastSaved: new Date().toISOString()
//     };

//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: JSON.stringify(updateData),
//       redirect: "follow"
//     };

//     const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//     const response = await fetch(url, requestOptions);
//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Failed to update organizer with file info");
//     }

//     return result;
//   } catch (error) {
//     console.error("Error updating organizer:", error);
//     throw error;
//   }
// };
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
    return <Box>Error: {error}</Box>;
  }

  if (!structFolder || !privateStructFolder) {
    return <Box></Box>;
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    //   PaperProps={{
    //     sx: {
    //       width: 600,
    //     },
    //   }}
     ModalProps={{
          keepMounted: true // Improves performance on mobile
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1, // ensure above dialog
          width: 600,
        }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            // padding:'5px 0 5px 0',
            borderBottom: "1px solid grey",
          }}
        >
          <Typography variant="h6">Select Folder to upload</Typography>
          <FaTimes style={{ cursor: "pointer" }} onClick={onclose} />
        </Box>
        <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
         
          {renderContents(structFolder.folders, (newFolders) =>
                 setStructFolder({ ...structFolder, folders: newFolders })
               )}
         

         

        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 3, ml: 4 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!file}
          onClick={() => {
            handleSelectFolderPath();
            handleSubmitfile();
          }}
        >
          Upload
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;