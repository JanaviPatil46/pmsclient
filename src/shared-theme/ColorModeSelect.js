import * as React from 'react';
import { useTheme } from './AppTheme';

export default function ColorModeSelect({ className = '', ...props }) {
  const { theme, setTheme } = useTheme();
  const savedRaw = localStorage.getItem('theme');
  const selectValue = (savedRaw === 'dark' || savedRaw === 'light') ? savedRaw : 'system';

  const handleChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <select
      value={selectValue}
      onChange={handleChange}
      data-screenshot="toggle-mode"
      aria-label="Select color theme"
      className={`rounded-lg border border-border bg-background text-foreground text-[13px] font-sans px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors cursor-pointer ${className}`}
      {...props}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
