import { Menu, MenuItem } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

const ParentFolderMenu = ({ anchorEl, open, onClose, onCreateFolder }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <MenuItem onClick={onCreateFolder}>
        <CreateNewFolderIcon style={{ marginRight: 8 }} />
        Create New Folder
      </MenuItem>
    </Menu>
  );
};

export default ParentFolderMenu;
