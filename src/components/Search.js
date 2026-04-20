import * as React from 'react';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  return (
    <div className="relative w-full md:w-[220px]">
      <SearchIcon
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        id="search"
        type="search"
        placeholder="Search…"
        aria-label="search"
        className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
      />
    </div>
  );
}
