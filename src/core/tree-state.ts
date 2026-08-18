import { getVisibleRows } from './visible-rows';
import type { NodeId, TreeModel } from './types';

export type SelectionMode = 'single' | 'multiple';

export interface TreeEvent {
  readonly level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  readonly type: string;
  readonly nodeId?: NodeId;
  readonly count?: number;
}

export interface TreeState<TNode> {
  readonly model: TreeModel<TNode>;
  readonly expandedIds: ReadonlySet<NodeId>;
  readonly selectedIds: ReadonlySet<NodeId>;
  readonly activeId: NodeId | null;
  readonly anchorId: NodeId | null;
  readonly selectionMode: SelectionMode;
}

export interface CreateTreeStateOptions {
  readonly expandedIds?: ReadonlySet<NodeId> | readonly NodeId[] | undefined;
  readonly selectedIds?: ReadonlySet<NodeId> | readonly NodeId[] | undefined;
  readonly activeId?: NodeId | null | undefined;
  readonly selectionMode?: SelectionMode | undefined;
  readonly onEvent?: ((event: TreeEvent) => void) | undefined;
}

export function toIdSet(
  ids: ReadonlySet<NodeId> | readonly NodeId[] | undefined,
): ReadonlySet<NodeId> {
  return new Set(ids ? [...ids] : []);
}

export function createTreeState<TNode>(
  model: TreeModel<TNode>,
  options: CreateTreeStateOptions = {},
): TreeState<TNode> {
  const visible = getVisibleRows(model, toIdSet(options.expandedIds));
  const activeId = options.activeId === undefined ? (visible[0]?.id ?? null) : options.activeId;
  const state: TreeState<TNode> = {
    model,
    expandedIds: toIdSet(options.expandedIds),
    selectedIds: toIdSet(options.selectedIds),
    activeId,
    anchorId: activeId,
    selectionMode: options.selectionMode ?? 'single',
  };
  options.onEvent?.({ level: 'DEBUG', type: 'state-created', count: visible.length });
  return state;
}
