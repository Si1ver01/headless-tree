import type { NodeId, VisibleTreeRow } from './types';

export interface TypeaheadState {
  readonly buffer: string;
  readonly timestamp: number;
}

export function findTypeaheadMatch<TNode>(
  rows: readonly VisibleTreeRow<TNode>[],
  activeId: NodeId | null,
  query: string,
): NodeId | null {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return null;
  const start = Math.max(
    rows.findIndex((row) => row.id === activeId),
    -1,
  );
  const ordered = [...rows.slice(start + 1), ...rows.slice(0, start + 1)];
  return (
    ordered.find((row) => !row.disabled && row.label.toLocaleLowerCase().startsWith(normalized))
      ?.id ?? null
  );
}

export function updateTypeahead(
  state: TypeaheadState,
  character: string,
  now: number,
  timeoutMs = 500,
): TypeaheadState {
  const buffer = now - state.timestamp > timeoutMs ? character : `${state.buffer}${character}`;
  return { buffer, timestamp: now };
}
