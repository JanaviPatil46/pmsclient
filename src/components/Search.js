import * as React from 'react';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className={`group relative w-full md:w-[220px] transition-all duration-200 ${
      focused ? 'md:w-[260px]' : ''
    }`}>
      <SearchIcon
        size={14}
        className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${
          focused ? 'text-primary' : 'text-muted-foreground'
        }`}
      />
      <input
        id="search"
        type="search"
        placeholder="Search…"
        aria-label="Search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-lg border border-border bg-muted/40 pl-8 pr-10 py-2 text-[13px] font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-background transition-all duration-200"
      />
      {/* Keyboard shortcut hint */}
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground font-sans opacity-60">
        ⌘K
      </kbd>
    </div>
  );
}
