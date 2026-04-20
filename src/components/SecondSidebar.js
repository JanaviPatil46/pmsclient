import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import SecondMenuContent from './SecondMenuContent';

function SecondSidebar({ open, toggleDrawer, onMenuItemClick }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[1200] bg-black/40"
          onClick={toggleDrawer(false)}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed left-0 top-0 h-full z-[1201] flex flex-col bg-card border-r border-border shadow-xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ minWidth: '15dvw', width: 240 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-base font-semibold text-foreground">New</p>
          <button
            onClick={toggleDrawer(false)}
            className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <SecondMenuContent onItemClick={onMenuItemClick} />
        </div>
      </div>
    </>
  );
}

SecondSidebar.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SecondSidebar;
