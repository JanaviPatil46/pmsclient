// src/components/FolderMenu.jsx
import React from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  DriveFileMove as DriveFileMoveIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";


const FileMenu = ({
  anchorEl,
  open,
  onClose,
  selectedItem,
accId,
  onRename,
  onMove,
  onToggleReadStatus,
  onToggleReadOnly,
  onDelete,
  onDownload,
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
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DriveFileMoveIcon fontSize="small" sx={{ mr: 0.5 }} />
        Move
      </MenuItem>
      <MenuItem
        disabled={isLocked}
       onClick={() => {
          onDownload(selectedItem);
          onClose();
        }}
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DriveFileMoveIcon fontSize="small" sx={{ mr: 0.5 }} />
        Download
      </MenuItem>
{/* <MenuItem
        onClick={() => {
          if (selectedItem) {
            onDownload(
              selectedItem.fullPath,
              selectedItem.name,
              selectedItem.meta
            );
          }
          onClose();
        }}
        sx={{ fontSize: "0.8rem", py: 0.5 }}
      >
        <DownloadIcon fontSize="small" sx={{ mr: 0.5 }} />
        Download
      </MenuItem> */}
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

export default FileMenu;
