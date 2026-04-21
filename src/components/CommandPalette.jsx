import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useShortcutContext } from "../context/ShortcutContext";
import {
  Search,
  Home,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  FolderPlus,
  Upload,
  X,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

// ─── Static command list ────────────────────────────────────────────────────

const buildCommands = (navigate, openShortcuts) => [
  // Navigation
  { id: "nav-home",      label: "Go to Dashboard",       icon: <Home size={14} />,        action: () => navigate("/client/home"),           group: "Navigate" },
  { id: "nav-docs",      label: "Go to Documents",        icon: <FileText size={14} />,    action: () => navigate("/client/document"),       group: "Navigate" },
  { id: "nav-tasks",     label: "Go to Tasks & Chats",    icon: <MessageSquare size={14} />, action: () => navigate("/client/chatstasks"),  group: "Navigate" },
  { id: "nav-billing",   label: "Go to Billing",          icon: <CreditCard size={14} />,  action: () => navigate("/client/billing"),        group: "Navigate" },
  { id: "nav-settings",  label: "Go to Settings",         icon: <Settings size={14} />,    action: () => navigate("/client/settings"),       group: "Navigate" },
  // Actions
  { id: "act-shortcuts", label: "View Keyboard Shortcuts", icon: <FileText size={14} />,   action: openShortcuts,                            group: "Actions" },
];

// ─── Component ───────────────────────────────────────────────────────────────

const CommandPalette = () => {
  const { commandOpen, closeCommand, openShortcuts } = useShortcutContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const commands = useMemo(
    () => buildCommands(navigate, openShortcuts),
    [navigate, openShortcuts]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [query, commands]);

  // Reset on open
  useEffect(() => {
    if (commandOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandOpen]);

  // Clamp active index
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  const runActive = () => {
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    cmd.action();
    closeCommand();
    setQuery("");
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    } else if (e.key === "Escape") {
      closeCommand();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.children[activeIndex];
    if (active) active.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Group filtered results
  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach((cmd, i) => {
      if (!map.has(cmd.group)) map.set(cmd.group, []);
      map.get(cmd.group).push({ ...cmd, _idx: i });
    });
    return map;
  }, [filtered]);

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          key="cmd-backdrop"
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={closeCommand}
        >
          <motion.div
            className="w-full max-w-lg bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={onKeyDown}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="overflow-y-auto max-h-[320px] py-1.5"
            >
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <p className="text-[13px] text-muted-foreground">No commands found</p>
                </div>
              ) : (
                Array.from(groups.entries()).map(([groupName, items]) => (
                  <div key={groupName}>
                    <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {groupName}
                    </p>
                    {items.map((cmd) => (
                      <button
                        key={cmd.id}
                        type="button"
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                          cmd._idx === activeIndex
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                        onMouseEnter={() => setActiveIndex(cmd._idx)}
                        onClick={() => { cmd.action(); closeCommand(); setQuery(""); }}
                      >
                        <span className={cmd._idx === activeIndex ? "text-primary" : "text-muted-foreground"}>
                          {cmd.icon}
                        </span>
                        <span className="text-[13px] font-medium flex-1">{cmd.label}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-t border-border bg-muted/30">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1 py-0.5 text-[10px]">↑↓</kbd> Navigate
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1 py-0.5 text-[10px]">↵</kbd> Open
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <kbd className="rounded border border-border bg-card px-1 py-0.5 text-[10px]">Esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
