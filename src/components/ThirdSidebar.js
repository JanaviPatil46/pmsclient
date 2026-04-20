import PropTypes from 'prop-types';
import AccountsDrawer from './drawers/AccountsDrawer';
import ContactsDrawer from './drawers/ContactsDrawer';
import JobsDrawer from './drawers/JobsDrawer';

export default function ThirdSidebar({ open, toggleDrawer, title }) {
  const getDrawerContent = () => {
    switch (title) {
      case 'Accounts':
        return <AccountsDrawer onClose={toggleDrawer} />;
      case 'Contacts':
        return <ContactsDrawer onClose={toggleDrawer} />;
      case 'Jobs':
        return <JobsDrawer />;
      default:
        return <p className="text-sm text-muted-foreground">Coming soon...</p>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[1300] bg-black/40"
          onClick={toggleDrawer}
        />
      )}

      {/* Right slide-in panel */}
      <div
        className={`fixed right-0 top-0 h-full z-[1301] flex flex-col bg-card border-l border-border shadow-xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ maxWidth: '40dvw', width: 400 }}
      >
        <div className="flex-1 overflow-y-auto p-4">
          {getDrawerContent()}
        </div>
      </div>
    </>
  );
}

ThirdSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  title: PropTypes.string,
};
