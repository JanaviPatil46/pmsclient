

import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "material-react-toastify";

const RenameDrawer = ({
  isOpen,
  onClose,
  fetchFolderTree,
  selectedFolderForMenu, // the selected file/folder to rename
}) => {
  const [newName, setNewName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Pre-fill selected item info
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setCurrentPath(selectedFolderForMenu.path);
      setNewName(selectedFolderForMenu.name);
      setMessage("");
    } else if (!isOpen) {
      setCurrentPath("");
      setNewName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  // ✅ Rename function
  const handleRename = async () => {
    if (!newName.trim()) {
      setMessage("⚠️ New name is required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/rename",
        {
          currentPath,
          newName,
        }
      );

      setMessage(`✅ ${res.data.message}`);
      toast.success(`${res.data.message}`)
         onClose();
      fetchFolderTree(); // refresh folder structure
     
    } catch (err) {
      console.error("Rename error:", err);
      setMessage(`❌ Error: ${err.response?.data?.error || "Server Error"}`);
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          ✏️ Rename Item
        </Typography>

       

        <TextField
          label="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new file or folder name"
          fullWidth
          margin="dense"
        />

        <Button
          // variant="contained"
          color="primary"
          fullWidth
          // sx={{ mt: 2 }}
          onClick={handleRename}
           sx={{
              backgroundColor: 'text.menu',
              mt:2,
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'menu.dark',
                boxShadow: 1,
              },
              transition: 'background-color 0.2s ease'
            }}
        >
          Rename
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default RenameDrawer;

