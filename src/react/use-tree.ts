import { useCallback, useMemo, useReducer, useRef } from 'react';
import { deriveAriaProps } from '../core/derive-aria';
import { getKeyboardAction } from '../core/keyboard';
import { normalizeTree } from '../core/normalize-tree';
import { treeReducer } from '../core/tree-reducer';
import { createTreeState, type SelectionMode, type TreeState } from '../core/tree-state';
import { getVisibleRows } from '../core/visible-rows';
import type { NodeId, NormalizeTreeOptions } from '../core/types';

export interface UseTreeOptions<TNode> extends NormalizeTreeOptions<TNode> {
  readonly roots: readonly TNode[];
  readonly expandedIds?: ReadonlySet<NodeId> | readonly NodeId[] | undefined;
  readonly selectedIds?: ReadonlySet<NodeId> | readonly NodeId[] | undefined;
  readonly activeId?: NodeId | null | undefined;
  readonly selectionMode?: SelectionMode | undefined;
  readonly onExpandedChange?: ((ids: ReadonlySet<NodeId>) => void) | undefined;
  readonly onSelectionChange?: ((ids: ReadonlySet<NodeId>) => void) | undefined;
  readonly onActiveChange?: ((id: NodeId | null) => void) | undefined;
  readonly domIdPrefix?: string | undefined;
}

export interface TreeItemApi<TNode> {
  readonly row: ReturnType<typeof getVisibleRows<TNode>>[number];
  readonly getItemProps: (props?: Record<string, unknown>) => Record<string, unknown>;
}

export function useTree<TNode>(options: UseTreeOptions<TNode>) {
  const model = useMemo(
    () => normalizeTree(options.roots, options),
    [
      options.roots,
      options.getNodeId,
      options.getNodeLabel,
      options.getNodeChildren,
      options.getNodeDisabled,
    ],
  );
  const [state, dispatch] = useReducer(
    (current: TreeState<TNode>, action: Parameters<typeof treeReducer<TNode>>[1]) =>
      treeReducer(current, action),
    undefined,
    () => createTreeState(model, options),
  );
  const latest = useRef(state);
  latest.current = state;
  const expandedIds = state.expandedIds;
  const visibleItems = useMemo(
    () => getVisibleRows(state.model, expandedIds),
    [state.model, expandedIds],
  );
  const domIdPrefix = options.domIdPrefix ?? 'headless-tree';
  const emit = useCallback(
    (action: Parameters<typeof treeReducer<TNode>>[1]) => {
      const before = latest.current;
      dispatch(action);
      queueMicrotask(() => {
        const after = latest.current;
        if (after.expandedIds !== before.expandedIds) options.onExpandedChange?.(after.expandedIds);
        if (after.selectedIds !== before.selectedIds)
          options.onSelectionChange?.(after.selectedIds);
        if (after.activeId !== before.activeId) options.onActiveChange?.(after.activeId);
      });
    },
    [options.onActiveChange, options.onExpandedChange, options.onSelectionChange],
  );
  const getItemProps = useCallback(
    (id: NodeId, props: Record<string, unknown> = {}) => {
      const row = visibleItems.find((item) => item.id === id);
      if (!row) return props;
      const aria = deriveAriaProps(row, {
        activeId: state.activeId,
        selectedIds: state.selectedIds,
        domIdPrefix,
      });
      return {
        ...aria,
        ...props,
        onClick: (event: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }) => {
          emit({
            type: 'select',
            id,
            additive: Boolean(event.ctrlKey || event.metaKey),
            range: Boolean(event.shiftKey),
          });
          (props.onClick as ((event: unknown) => void) | undefined)?.(event);
        },
        onKeyDown: (event: {
          key: string;
          ctrlKey?: boolean;
          metaKey?: boolean;
          shiftKey?: boolean;
          preventDefault?: () => void;
        }) => {
          const action = getKeyboardAction(visibleItems, state.activeId, event);
          if (action.type !== 'none') event.preventDefault?.();
          if (action.type === 'move') emit({ type: 'focus', id: action.id });
          if (action.type === 'expand')
            emit({ type: 'set-expanded', id: action.id, expanded: true });
          if (action.type === 'collapse')
            emit({ type: 'set-expanded', id: action.id, expanded: false });
          if (action.type === 'select') emit(action);
          if (action.type === 'select-all') emit(action);
          (props.onKeyDown as ((event: unknown) => void) | undefined)?.(event);
        },
      };
    },
    [domIdPrefix, emit, state.activeId, state.selectedIds, visibleItems],
  );
  const getTreeProps = useCallback(
    (props: Record<string, unknown> = {}) => ({ role: 'tree', ...props }),
    [],
  );
  const getGroupProps = useCallback(
    (props: Record<string, unknown> = {}) => ({ role: 'group', ...props }),
    [],
  );
  return {
    ...state,
    visibleItems,
    diagnostics: state.model.diagnostics,
    getTreeProps,
    getItemProps,
    getGroupProps,
    dispatch: emit,
  };
}
