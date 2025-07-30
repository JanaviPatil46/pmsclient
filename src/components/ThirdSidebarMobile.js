import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import MenuButton from './MenuButton'; // or your custom styled button
import { drawerClasses } from '@mui/material/Drawer';

// Import all drawer content components
import AccountsDrawer from './drawers/AccountsDrawer';
import ContactsDrawer from './drawers/ContactsDrawer';
import JobsDrawer from './drawers/JobsDrawer';
import { Divider } from '@mui/material';

export default function ThirdSidebar({ open, toggleDrawer, title }) {
  const getDrawerContent = () => {
    switch (title) {
      case 'Accounts':
        return <AccountsDrawer onClose={toggleDrawer}/>;
      case 'Contacts':
        return <ContactsDrawer onClose={toggleDrawer}/>;
      case 'Jobs':
        return <JobsDrawer />;
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        [`& .${drawerClasses.paper}`]: {
          
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack sx={{ maxWidth: '100dvw', height: '100%' }}>
        {/* <Stack direction="row" sx={{ p: 2, pb: 1, gap: 1, alignItems: 'center' }}>
          <Typography variant="h6" component="p" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <MenuButton >
            <CloseIcon onClick={toggleDrawer} sx={{cursor:'pointer',fontSize:'20px'}}/>
          </MenuButton>
        </Stack> */}
        {/* <Divider/> */}
        <Stack sx={{ p: 2 }}>
          {getDrawerContent()}
        </Stack>
      </Stack>
    </Drawer>
  );
}

ThirdSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  title: PropTypes.string,
};
