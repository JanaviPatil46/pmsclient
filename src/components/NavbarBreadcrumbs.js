import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const customBreadcrumbMap = {
  updatechat: ['chatstasks', 'updatechat'],
  payinvoice: ['billing', 'payinvoice'],
  trashDocs: ['document', 'trashDocs'],
};

const pathToName = {
  home: 'Dashboard',
  trashDocs: 'Documents',
  chatstasks: 'Chats',
  organizers: 'Organizers',
  proposalsels: 'Proposals & Els',
  billing: 'Invoices',
  settings: 'Settings',
  updatechat: 'Chat',
  payinvoice: 'Invoice',
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  let pathnames = location.pathname.replace(/^\/client/, '').split('/').filter(x => x);

  if (pathnames[0] && customBreadcrumbMap[pathnames[0]]) {
    pathnames = customBreadcrumbMap[pathnames[0]];
  }

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 font-sans">
      {/* Home icon */}
      <Link
        to="/client/home"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        <Home size={15} strokeWidth={1.8} />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/client/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = pathToName[value] || value;

        return (
          <span key={to} className="flex items-center gap-1">
            <ChevronRight size={13} className="text-muted-foreground/50 shrink-0" />
            {isLast ? (
              <span className="text-[13px] font-semibold text-foreground tracking-[-0.01em]">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 tracking-[-0.01em]"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

