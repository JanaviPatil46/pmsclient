import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPod|iPad/.test(navigator.platform);

const Cmd = isMac ? "⌘" : "Ctrl";

const groups = [
  {
    label: "General",
    rows: [
      { keys: [Cmd, "K"], description: "Open command palette" },
      { keys: [Cmd, "/"], description: "Open shortcuts help" },
    ],
  },
  {
    label: "Documents",
    rows: [
      { keys: ["N"], description: "New folder" },
      { keys: ["U"], description: "Upload file" },
      { keys: ["⇧", "U"], description: "Upload folder" },
      { keys: [Cmd, "A"], description: "Select all items" },
      { keys: ["Del"], description: "Move selected to trash" },
      { keys: ["Esc"], description: "Clear selection" },
    ],
  },
];

const Kbd = ({ children }) => (
  <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-foreground shadow-sm min-w-[22px]">
    {children}
  </kbd>
);

const ShortcutsModal = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="shortcuts-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md bg-card rounded-xl shadow-xl border border-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
                onClick={onClose}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Groups */}
            <div className="flex flex-col gap-0 divide-y divide-border/60 max-h-[70vh] overflow-auto">
              {groups.map((group) => (
                <div key={group.label} className="px-5 py-4 flex flex-col gap-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    {group.label}
                  </p>
                  {group.rows.map(({ keys, description }) => (
                    <div key={description} className="flex items-center justify-between gap-4">
                      <span className="text-[13px] text-foreground">{description}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {keys.map((k, i) => (
                          <Kbd key={i}>{k}</Kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border bg-muted/30">
              <p className="text-[11px] text-muted-foreground">
                Press <Kbd>{Cmd}</Kbd> <Kbd>/</Kbd> to toggle this panel
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShortcutsModal;
