import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ColorModeIconDropdown(props) {
  const [dark, setDark] = React.useState(() =>
    document.documentElement.classList.contains('dark') ||
    localStorage.getItem('theme') === 'dark'
  );

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      data-screenshot="toggle-mode"
      onClick={toggle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
      aria-label="Toggle color mode"
      {...props}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
