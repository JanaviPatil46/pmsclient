// src/components/FolderMenu.jsx
import React from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  DriveFileMove as DriveFileMoveIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Eye } from "lucide-react";
// import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

const FolderMenu = ({
  anchorEl,
  open,
  onClose,
  selectedItem,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
  onRename,
  onMove,
  onToggleReadStatus,
  onToggleReadOnly,
  onDelete,
}) => {
  const isLocked = selectedItem?.meta?.readOnly === true;
  const isRead = selectedItem?.meta?.readStatus === true;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem
        disabled={isLocked}
        onClick={() => {
          onCreateFolder();
          onClose();
        }}
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DriveFileMoveIcon fontSize="small" sx={{ mr: 0.5 }} />
        New Folder
      </MenuItem>

      <MenuItem
        disabled={isLocked}
        onClick={() => {
          onUploadFile();
          onClose();
        }}
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DriveFileMoveIcon fontSize="small" sx={{ mr: 0.5 }} />
        Upload File
      </MenuItem>

      <MenuItem
        disabled={isLocked}
        onClick={() => {
          onUploadFolder();
          onClose();
        }}
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DriveFileMoveIcon fontSize="small" sx={{ mr: 0.5 }} />
        Upload Folder
      </MenuItem>

      <MenuItem
        disabled={isLocked}
        onClick={() => {
          onRename();
          onClose();
        }}
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DriveFileMoveIcon fontSize="small" sx={{ mr: 0.5 }} />
        Rename
      </MenuItem>

      <MenuItem
        disabled={isLocked}
        onClick={() => {
          onMove();
          onClose();
        }}
      >
        <DriveFileMoveIcon fontSize="small" sx={{ mr: 0.5 }} />
        Move
      </MenuItem>

      <MenuItem
        disabled={isLocked}
        onClick={() => {
          onDelete(selectedItem);
          onClose();
        }}
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} />
        <span style={{ color: "red" }}>Delete</span>
      </MenuItem>
    </Menu>
  );
};

export default FolderMenu;
