import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";

// ─── Context ───────────────────────────────────────────────────────────────

export const ShortcutContext = createContext(null);

// ─── Helpers ───────────────────────────────────────────────────────────────

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPod|iPad/.test(navigator.platform);

/**
 * Build a canonical string key from a KeyboardEvent.
 * e.g. "meta+k", "shift+u", "n", "escape"
 */
const eventToKey = (e) => {
  const parts = [];
  if (e.metaKey || e.ctrlKey) parts.push("meta");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");
  const k = e.key.toLowerCase();
  if (k !== "meta" && k !== "control" && k !== "shift" && k !== "alt") {
    parts.push(k);
  }
  return parts.join("+");
};

/**
 * Build a canonical key from a shortcut definition array.
 * e.g. ["meta","k"] → "meta+k"
 */
const defToKey = (keys) =>
  keys
    .map((k) => k.toLowerCase())
    .join("+");

// ─── Provider ──────────────────────────────────────────────────────────────

/**
 * Shortcut entry shape:
 * {
 *   id: string,
 *   keys: string[],           // e.g. ["meta","k"]
 *   action: (e) => void,
 *   scope: string,            // "global" | "documents" | "dashboard" | ...
 *   preventDefault?: boolean, // default true
 *   description?: string,     // shown in modal
 *   group?: string,           // shown in modal
 * }
 */
export const ShortcutProvider = ({ children }) => {
  // Registry: map of canonical key → array of entries (latest scope wins)
  const registry = useRef(new Map());

  // UI state — only these cause re-renders
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Expose open/close controls globally
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);
  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  // ── Register / unregister ──────────────────────────────────────────────
  const register = useCallback((entries) => {
    entries.forEach((entry) => {
      const k = defToKey(entry.keys);
      if (!registry.current.has(k)) registry.current.set(k, []);
      registry.current.get(k).push(entry);
    });
  }, []);

  const unregister = useCallback((entries) => {
    entries.forEach((entry) => {
      const k = defToKey(entry.keys);
      const list = registry.current.get(k);
      if (!list) return;
      const next = list.filter((e) => e.id !== entry.id);
      if (next.length === 0) registry.current.delete(k);
      else registry.current.set(k, next);
    });
  }, []);

  // ── Global keydown handler ─────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName?.toUpperCase();
      const isEditing =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.target?.isContentEditable;

      const k = eventToKey(e);
      const list = registry.current.get(k);
      if (!list || list.length === 0) return;

      // Use the LAST registered entry (most recent scope wins)
      const entry = list[list.length - 1];

      if (isEditing && !entry.allowInInput) return;
      if (entry.preventDefault !== false) e.preventDefault();
      entry.action(e);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Register built-in global shortcuts ────────────────────────────────
  useEffect(() => {
    const globals = [
      {
        id: "__global_cmd_k",
        keys: ["meta", "k"],
        action: () => setCommandOpen(true),
        scope: "global",
        description: "Open command palette",
        group: "General",
      },
      {
        id: "__global_shortcuts",
        keys: ["meta", "/"],
        action: () => setShortcutsOpen((v) => !v),
        scope: "global",
        description: "Open shortcuts help",
        group: "General",
      },
      {
        id: "__global_esc_close",
        keys: ["escape"],
        action: () => {
          setCommandOpen(false);
          setShortcutsOpen(false);
        },
        scope: "global",
        preventDefault: false,
        description: "Close modals / clear selections",
        group: "General",
      },
    ];
    register(globals);
    return () => unregister(globals);
  }, [register, unregister]);

  // ── Get all registered shortcuts (for modal display) ──────────────────
  const getAllShortcuts = useCallback(() => {
    const all = [];
    registry.current.forEach((list) => {
      list.forEach((entry) => {
        if (entry.description) all.push(entry);
      });
    });
    return all;
  }, []);

  return (
    <ShortcutContext.Provider
      value={{
        register,
        unregister,
        shortcutsOpen,
        openShortcuts,
        closeShortcuts,
        commandOpen,
        openCommand,
        closeCommand,
        getAllShortcuts,
        isMac,
      }}
    >
      {children}
    </ShortcutContext.Provider>
  );
};

// ─── Consumer hook ──────────────────────────────────────────────────────────

export const useShortcutContext = () => {
  const ctx = useContext(ShortcutContext);
  if (!ctx) throw new Error("useShortcutContext must be used inside <ShortcutProvider>");
  return ctx;
};
