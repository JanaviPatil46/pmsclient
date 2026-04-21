import { useEffect, useCallback } from "react";

/**
 * useKeyboardShortcuts
 *
 * @param {Array<{ keys: string[], action: Function, preventDefault?: boolean }>} shortcuts
 *   keys: array of modifiers + key, e.g. ["meta", "k"] or ["shift", "u"] or ["delete"]
 *   Modifiers: "meta" (Cmd/Ctrl), "shift", "alt"
 *   key: any KeyboardEvent.key value (case-insensitive)
 */
const useKeyboardShortcuts = (shortcuts = []) => {
  const handleKeyDown = useCallback(
    (e) => {
      const tag = e.target?.tagName?.toUpperCase();
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.target?.isContentEditable;

      for (const { keys, action, preventDefault = true, allowInInput = false } of shortcuts) {
        if (isEditable && !allowInInput) continue;

        const modifiers = keys.slice(0, -1);
        const key = keys[keys.length - 1].toLowerCase();

        const needsMeta = modifiers.includes("meta");
        const needsShift = modifiers.includes("shift");
        const needsAlt = modifiers.includes("alt");

        const metaMatch = needsMeta ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey;
        const shiftMatch = needsShift ? e.shiftKey : !e.shiftKey;
        const altMatch = needsAlt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === key;

        if (metaMatch && shiftMatch && altMatch && keyMatch) {
          if (preventDefault) e.preventDefault();
          action(e);
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
