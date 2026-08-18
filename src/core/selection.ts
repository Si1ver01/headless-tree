import type { NodeId, VisibleTreeRow } from './types';
import type { SelectionMode } from './tree-state';

export interface SelectionResult {
  readonly selectedIds: ReadonlySet<NodeId>;
  readonly anchorId: NodeId | null;
}

export function applySelection(
  rows: readonly VisibleTreeRow<unknown>[],
  selectedIds: ReadonlySet<NodeId>,
  anchorId: NodeId | null,
  id: NodeId,
  options: { readonly mode: SelectionMode; readonly additive: boolean; readonly range: boolean },
): SelectionResult {
  const target = rows.find((row) => row.id === id);
  if (!target || target.disabled) return { selectedIds: new Set(selectedIds), anchorId };
  const next = new Set(options.mode === 'multiple' && options.additive ? selectedIds : []);
  if (options.mode === 'multiple' && options.range && anchorId) {
    const start = rows.findIndex((row) => row.id === anchorId);
    const end = rows.findIndex((row) => row.id === id);
    if (start >= 0 && end >= 0) {
      const [from, to] = start <= end ? [start, end] : [end, start];
      for (const row of rows.slice(from, to + 1)) if (!row.disabled) next.add(row.id);
      return { selectedIds: next, anchorId };
    }
  }
  if (options.mode === 'multiple' && options.additive && selectedIds.has(id)) next.delete(id);
  else next.add(id);
  return { selectedIds: next, anchorId: id };
}

export function sanitizeSelection<TNode>(
  rows: readonly VisibleTreeRow<TNode>[],
  ids: ReadonlySet<NodeId>,
): ReadonlySet<NodeId> {
  const valid = new Set(rows.filter((row) => !row.disabled).map((row) => row.id));
  return new Set([...ids].filter((id) => valid.has(id)));
}
