import type { NodeId, VisibleTreeRow } from './types';

export interface TreeKeyboardInput {
  readonly key: string;
  readonly ctrlKey?: boolean | undefined;
  readonly metaKey?: boolean | undefined;
  readonly shiftKey?: boolean | undefined;
}

export type TreeKeyboardAction =
  | { readonly type: 'move'; readonly id: NodeId }
  | { readonly type: 'expand'; readonly id: NodeId }
  | { readonly type: 'collapse'; readonly id: NodeId }
  | {
      readonly type: 'select';
      readonly id: NodeId;
      readonly additive: boolean;
      readonly range: boolean;
    }
  | { readonly type: 'select-all' }
  | { readonly type: 'none' };

export function getNextEnabledRow<TNode>(
  rows: readonly VisibleTreeRow<TNode>[],
  currentId: NodeId | null,
  direction: 1 | -1,
): NodeId | null {
  let index = currentId
    ? rows.findIndex((row) => row.id === currentId)
    : direction === 1
      ? -1
      : rows.length;
  while ((index += direction) >= 0 && index < rows.length)
    if (!rows[index]!.disabled) return rows[index]!.id;
  return currentId;
}

export function getKeyboardAction<TNode>(
  rows: readonly VisibleTreeRow<TNode>[],
  activeId: NodeId | null,
  input: TreeKeyboardInput,
): TreeKeyboardAction {
  const active = rows.find((row) => row.id === activeId);
  if (!active) return { type: 'none' };
  const additive = Boolean(input.ctrlKey || input.metaKey);
  if (input.key === 'ArrowDown')
    return { type: 'move', id: getNextEnabledRow(rows, active.id, 1) ?? active.id };
  if (input.key === 'ArrowUp')
    return { type: 'move', id: getNextEnabledRow(rows, active.id, -1) ?? active.id };
  if (input.key === 'Home')
    return { type: 'move', id: rows.find((row) => !row.disabled)?.id ?? active.id };
  if (input.key === 'End')
    return { type: 'move', id: [...rows].reverse().find((row) => !row.disabled)?.id ?? active.id };
  if (input.key === 'ArrowRight')
    return active.expandable && !active.expanded
      ? { type: 'expand', id: active.id }
      : {
          type: 'move',
          id: rows.find((row) => row.parentId === active.id && !row.disabled)?.id ?? active.id,
        };
  if (input.key === 'ArrowLeft')
    return active.expanded
      ? { type: 'collapse', id: active.id }
      : active.parentId
        ? { type: 'move', id: active.parentId }
        : { type: 'none' };
  if (input.key === 'Enter' || input.key === ' ')
    return { type: 'select', id: active.id, additive, range: Boolean(input.shiftKey) };
  if (input.key.toLowerCase() === 'a' && additive) return { type: 'select-all' };
  return { type: 'none' };
}
