
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Link, useLocation } from 'react-router-dom';
import HomeFilledIcon from "@mui/icons-material/Home";
const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

const customBreadcrumbMap = {
  updatechat: ['chatstasks', 'updatechat'], // special case: show as Chats > Chat
  payinvoice: ['billing', 'payinvoice']
};

const pathToName = {
  home: 'Dashboard',
  document: 'Documents',
  chatstasks: 'Chats',
  organizers: 'Organizers',
  proposalsels: 'Proposals & Els',
  billing: 'Invoices',
  settings: 'Settings',
  updatechat: 'Chat',
  payinvoice:'Invoice'
};

export default function NavbarBreadcrumbs() {
  // const location = useLocation();
  // let pathnames = location.pathname.split('/').filter((x) => x);

  // if (customBreadcrumbMap[pathnames[0]]) {
  //   pathnames = customBreadcrumbMap[pathnames[0]];
  // }
const location = useLocation();

  // Remove the `/client` prefix
  let pathnames = location.pathname.replace(/^\/client/, '').split('/').filter(x => x);

  // Apply custom mapping for special cases
  if (pathnames[0] && customBreadcrumbMap[pathnames[0]]) {
    pathnames = customBreadcrumbMap[pathnames[0]];
  }
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Link to="/client/home" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box mt={0.5}>
      <HomeFilledIcon fontSize="small"  />
      </Box>
        
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography
            key={to}
            variant="body1"
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {pathToName[value] || value}
          </Typography>
        ) : (
          <Link
            key={to}
            to={to}
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Typography variant="body1">
              {pathToName[value] || value}
            </Typography>
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}

