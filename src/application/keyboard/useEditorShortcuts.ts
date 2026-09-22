import { useEffect } from "react";
import { useProjectStore } from "@/application/store/useProjectStore";

/**
 * Глобальные горячие клавиши редактора (SPEC.md, раздел 13.1 и 15.2):
 * Esc — отмена черновика инструмента, Delete/Backspace — удалить
 * выделенное, Ctrl/Cmd+Z — отменить, Ctrl/Cmd+Shift+Z — повторить.
 */
export function useEditorShortcuts() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const { cancelDraft, deleteSelected, undo, redo } = useProjectStore.getState();

      if (event.key === "Escape") {
        cancelDraft();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelected();
        return;
      }

      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
