export function createHistoryManager(initialState, { onChange, onStackChange } = {}) {
  const undoStack = [];
  const redoStack = [];
  let currentState = initialState;

  function updateState(newState) {
    currentState = newState;
    onChange?.(currentState);
    onStackChange?.({
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
    });
  }

  function execute(newState) {
    undoStack.push(JSON.parse(JSON.stringify(currentState)));
    redoStack.length = 0;
    updateState(newState);
  }

  function undo() {
    if (!undoStack.length) return;
    redoStack.push(currentState);
    const prev = undoStack.pop();
    updateState(prev);
  }

  function redo() {
    if (!redoStack.length) return;
    undoStack.push(currentState);
    const next = redoStack.pop();
    updateState(next);
  }

  return { execute, undo, redo, getState: () => currentState };
}
