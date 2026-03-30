"use client";

import { useState, useCallback, useRef } from "react";

interface UndoEntry<T> {
  item: T;
  timerId: ReturnType<typeof setTimeout>;
}

/**
 * Provides a 5-second undo window after removing an item.
 * Call `remove(item, id)` instead of removing directly.
 * If `undo(id)` is called within 5s, the item is restored.
 */
export function useUndoRemove<T>(
  onRemove: (id: string) => void,
  onRestore: (item: T) => void,
  timeoutMs = 5000
) {
  const [pending, setPending] = useState<Map<string, UndoEntry<T>>>(new Map());
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  const remove = useCallback(
    (id: string, item: T) => {
      const timerId = setTimeout(() => {
        onRemove(id);
        setPending((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      }, timeoutMs);

      setPending((prev) => new Map(prev).set(id, { item, timerId }));
    },
    [onRemove, timeoutMs]
  );

  const undo = useCallback(
    (id: string) => {
      const entry = pendingRef.current.get(id);
      if (!entry) return;
      clearTimeout(entry.timerId);
      onRestore(entry.item);
      setPending((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    },
    [onRestore]
  );

  const pendingIds = Array.from(pending.keys());

  return { remove, undo, pendingIds, hasPending: pending.size > 0 };
}
