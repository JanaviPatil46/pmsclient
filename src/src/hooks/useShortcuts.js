import { useEffect, useRef } from "react";
import { useShortcutContext } from "../../context/ShortcutContext";

/**
 * useShortcuts
 *
 * Register page/component-scoped keyboard shortcuts.
 * Automatically unregisters on unmount.
 *
 * @param {Array} shortcuts - Array of shortcut entries:
 *   {
 *     id: string,            // unique identifier
 *     keys: string[],        // e.g. ["n"] or ["meta","a"] or ["shift","u"]
 *     action: (e) => void,
 *     scope?: string,        // "documents" | "dashboard" | etc. (informational)
 *     preventDefault?: boolean,
 *     description?: string,  // shown in ShortcutsModal
 *     group?: string,        // shown in ShortcutsModal
 *     allowInInput?: boolean,
 *   }
 */
const useShortcuts = (shortcuts) => {
  const { register, unregister } = useShortcutContext();

  // Keep a stable ref so the effect doesn't re-run on every render
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const entries = shortcutsRef.current;
    register(entries);
    return () => unregister(entries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, unregister]);
};

export default useShortcuts;
