import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './AppTheme';

export default function ColorModeIconDropdown({ className = '', ...props }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      data-screenshot="toggle-mode"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden ${className}`}
      {...props}
    >
      {/* Sun icon — shown in dark mode */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
        }`}
      >
        <Sun size={16} strokeWidth={1.8} />
      </span>
      {/* Moon icon — shown in light mode */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <Moon size={16} strokeWidth={1.8} />
      </span>
    </button>
  );
}
