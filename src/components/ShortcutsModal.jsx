import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import { useShortcutContext } from "../context/ShortcutContext";

const ease = [0.16, 1, 0.3, 1];

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPod|iPad/.test(navigator.platform);

const Cmd = isMac ? "⌘" : "Ctrl";

const formatKeys = (keys) =>
  keys.map((k) => {
    if (k === "meta") return Cmd;
    if (k === "shift") return "⇧";
    if (k === "alt") return isMac ? "⌥" : "Alt";
    if (k === "escape") return "Esc";
    if (k === "delete") return "Del";
    return k.toUpperCase();
  });

const Kbd = ({ children }) => (
  <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-foreground shadow-sm min-w-[22px]">
    {children}
  </kbd>
);

// Static fallback entries (always shown, even before any page registers shortcuts)
const STATIC = [
  { keys: ["meta", "k"],  description: "Open command palette",   group: "General" },
  { keys: ["meta", "/"],  description: "Open shortcuts help",     group: "General" },
  { keys: ["escape"],     description: "Close modals / clear selection", group: "General" },
  { keys: ["meta", "b"],  description: "Toggle sidebar",          group: "General" },
  { keys: ["n"],          description: "New folder",               group: "Documents" },
  { keys: ["u"],          description: "Upload file",              group: "Documents" },
  { keys: ["shift", "u"], description: "Upload folder",           group: "Documents" },
  { keys: ["meta", "a"],  description: "Select all items",        group: "Documents" },
  { keys: ["delete"],     description: "Move selected to trash",  group: "Documents" },
  { keys: ["r"],          description: "Refresh data",            group: "Dashboard" },
];

const ShortcutsModal = () => {
  const { shortcutsOpen, closeShortcuts, getAllShortcuts } = useShortcutContext();

  const grouped = useMemo(() => {
    // Merge registered dynamic shortcuts with static list (deduplicate by description)
    const registered = getAllShortcuts();
    const registeredDescs = new Set(registered.map((e) => e.description));
    const merged = [
      ...registered,
      ...STATIC.filter((s) => !registeredDescs.has(s.description)),
    ];

    return merged.reduce((acc, entry) => {
      const g = entry.group || "Other";
      if (!acc[g]) acc[g] = [];
      acc[g].push(entry);
      return acc;
    }, {});
  }, [shortcutsOpen, getAllShortcuts]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {shortcutsOpen && (
        <motion.div
          key="shortcuts-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={closeShortcuts}
        >
          <motion.div
            className="relative w-full max-w-md bg-card rounded-xl shadow-xl border border-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Keyboard size={15} className="text-primary shrink-0" />
                <h2 className="text-[14px] font-semibold text-foreground">Keyboard Shortcuts</h2>
              </div>
              <button
                type="button"
                onClick={closeShortcuts}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Groups */}
            <div className="divide-y divide-border/60 max-h-[65vh] overflow-auto">
              {Object.entries(grouped).map(([groupName, entries]) => (
                <div key={groupName} className="px-5 py-4 flex flex-col gap-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                    {groupName}
                  </p>
                  {entries.map(({ keys, description }) => (
                    <div key={description} className="flex items-center justify-between gap-4">
                      <span className="text-[13px] text-foreground">{description}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {formatKeys(keys).map((k, i) => (
                          <Kbd key={i}>{k}</Kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">
                Press <Kbd>{Cmd}</Kbd><Kbd>/</Kbd> to toggle
              </p>
              <p className="text-[11px] text-muted-foreground">
                <Kbd>{Cmd}</Kbd><Kbd>K</Kbd> for command palette
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShortcutsModal;
