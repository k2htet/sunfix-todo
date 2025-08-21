// import { useEffect } from "react";

// export const UndoRedoKeyboard = ({
//   handleUndo,
//   handleRedo,
// }: {
//   handleUndo: () => void;
//   handleRedo: () => void;
// }) => {
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       const tag = (e.target as HTMLElement).tagName;

//       // ignore typing in inputs, textareas, contenteditable elements
//       if (
//         tag === "INPUT" ||
//         tag === "TEXTAREA" ||
//         (e.target as HTMLElement).isContentEditable
//       ) {
//         return;
//       }

//       // Undo: Ctrl+Z / Cmd+Z
//       if (
//         (e.ctrlKey || e.metaKey) &&
//         !e.shiftKey &&
//         e.key.toLowerCase() === "z"
//       ) {
//         e.preventDefault();
//         handleUndo();
//       }

//       // Redo: Ctrl+Y or Ctrl+Shift+Z
//       else if (
//         (e.ctrlKey || e.metaKey) &&
//         (e.key.toLowerCase() === "y" ||
//           (e.shiftKey && e.key.toLowerCase() === "z"))
//       ) {
//         e.preventDefault();
//         handleRedo();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [handleUndo, handleRedo]);

//   return null;
// };
