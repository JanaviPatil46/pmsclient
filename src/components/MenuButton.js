import * as React from 'react';
import PropTypes from 'prop-types';

function MenuButton({ showBadge = false, children, className = '', ...props }) {
  return (
    <div className="relative inline-flex shrink-0">
      <button
        type="button"
        className={`flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
          className
        }`}
        {...props}
      >
        {children}
      </button>
      {showBadge && (
        <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-destructive border-2 border-background pointer-events-none" />
      )}
    </div>
  );
}

MenuButton.propTypes = {
  showBadge: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default MenuButton;
