import { useState, useEffect } from "react";
import axios from "axios";
import { X, Upload } from "lucide-react";

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
            <div>
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

      const isSelected = selectedFolderId === item.id && selectedType === "public";
      return (
        <div key={index} className="ml-5 mb-1">
          <div
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors select-none
              ${isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/60"}`}
            onClick={selectFolder}
          >
            <div
              onClick={toggleFolder}
              className="flex items-center gap-2 w-full"
            >
              <span>{item.isOpen ? "📂" : "📁"}</span>
              <span className={`text-sm ${isSelected ? "font-semibold text-primary" : "font-medium text-foreground"}`}>
                {item.folder}
              </span>
            </div>
          </div>
          {item.isOpen && item.contents && item.contents.length > 0 && (
            <div className="mt-1">
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
          className="ml-10 flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground"
        >
          <span>📄</span>
          <span>{item.file}</span>
        </div>
      );
    }
    return null;
  });
};

  
  const handleSubmitfile = async (e) => {
   
  
    let data = new FormData();
    data.append("destinationPath", destinationPath);
    data.append("file", file);
//   data.append("accountName", accountName);
//   data.append("accountEmailSync", accountEmailSync)
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${DOCS_MANAGMENTS}/uploadfiledocument`,
      data: data,
    };
  
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert("File uploaded successfully!");
        onClose();
       
        // fetchBothFolders()
      
        setSelectedFolderId(null);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to upload the file.");
      });
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
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
        Error: {error}
      </div>
    );
  }

  if (!structFolder || !privateStructFolder) {
    return null;
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Select Folder to Upload
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Folder tree body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {renderContents(structFolder.folders, (newFolders) =>
            setStructFolder({ ...structFolder, folders: newFolders })
          )}
        </div>

        {/* Footer buttons */}
        <div className="shrink-0 flex gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            disabled={!file}
            onClick={() => {
              handleSelectFolderPath();
              handleSubmitfile();
            }}
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

export default UploadDocument;
