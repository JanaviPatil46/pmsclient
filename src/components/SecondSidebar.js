import {  Typography } from "@mui/material";
import React from "react";

import PropTypes from 'prop-types';
import MenuButton from './MenuButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import SecondMenuContent from "./SecondMenuContent";
import CloseIcon from '@mui/icons-material/Close';
function SecondSidebar ({ open, toggleDrawer, onMenuItemClick }) {
  
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          // minWidth: 300,
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          minWidth: '15dvw',
          height: '100%',
        }}
      >
        
         <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1,alignItems: 'center', }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1.5}}
          >
           
            <Typography component="p" variant="h6">
              New
            </Typography>
          </Stack>
          <MenuButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </MenuButton>
        </Stack>
        <SecondMenuContent onItemClick={onMenuItemClick} />
      </Stack>
    </Drawer>
  );
};
SecondSidebar.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};
export default SecondSidebar;
