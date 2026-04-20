import * as React from 'react';

export default function ColorModeSelect({ sx, ...props }) {
  const [mode, setMode] = React.useState(
    () => localStorage.getItem('theme') || 'light'
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setMode(value);
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (value === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.removeItem('theme');
    }
  };

  return (
    <select
      value={mode}
      onChange={handleChange}
      data-screenshot="toggle-mode"
      className="rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
      {...props}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
