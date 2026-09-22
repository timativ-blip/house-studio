import { useEffect } from "react";
import { useProjectStore } from "@/application/store/useProjectStore";

const ROTATE_STEP_RAD = (15 * Math.PI) / 180;

/**
 * Глобальные горячие клавиши редактора (SPEC.md, раздел 13.1, 15.2, 10.3):
 * Esc — отмена черновика инструмента, Delete/Backspace — удалить
 * выделенное, Ctrl/Cmd+Z — отменить, Ctrl/Cmd+Shift+Z — повторить,
 * Q/E — повернуть выделенный предмет.
 */
export function useEditorShortcuts() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const { cancelDraft, deleteSelected, undo, redo, rotateSelectedItem } =
        useProjectStore.getState();

      if (event.key === "Escape") {
        cancelDraft();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelected();
        return;
      }

      if (event.key.toLowerCase() === "q") {
        rotateSelectedItem(-ROTATE_STEP_RAD);
        return;
      }

      if (event.key.toLowerCase() === "e") {
        rotateSelectedItem(ROTATE_STEP_RAD);
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
