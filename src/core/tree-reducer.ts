import { applySelection, sanitizeSelection } from './selection';
import type { TreeAction } from './tree-actions';
import type { TreeState } from './tree-state';
import { getVisibleRows } from './visible-rows';

export function treeReducer<TNode>(
  state: TreeState<TNode>,
  action: TreeAction<TNode>,
): TreeState<TNode> {
  switch (action.type) {
    case 'replace-model': {
      const rows = getVisibleRows(action.model, state.expandedIds);
      const selectedIds = sanitizeSelection(rows, state.selectedIds);
      const activeId = rows.some((row) => row.id === state.activeId)
        ? state.activeId
        : (rows[0]?.id ?? null);
      return { ...state, model: action.model, selectedIds, activeId, anchorId: activeId };
    }
    case 'focus':
      return { ...state, activeId: action.id, anchorId: action.id ?? state.anchorId };
    case 'toggle-expanded': {
      const node = state.model.nodes.get(action.id);
      if (!node?.expandable) return state;
      const expandedIds = new Set(state.expandedIds);
      if (expandedIds.has(action.id)) expandedIds.delete(action.id);
      else expandedIds.add(action.id);
      return { ...state, expandedIds };
    }
    case 'set-expanded': {
      const node = state.model.nodes.get(action.id);
      if (!node?.expandable) return state;
      const expandedIds = new Set(state.expandedIds);
      if (action.expanded) expandedIds.add(action.id);
      else expandedIds.delete(action.id);
      return { ...state, expandedIds };
    }
    case 'select': {
      const rows = getVisibleRows(state.model, state.expandedIds);
      const result = applySelection(rows, state.selectedIds, state.anchorId, action.id, {
        mode: state.selectionMode,
        additive: action.additive,
        range: action.range,
      });
      return {
        ...state,
        selectedIds: result.selectedIds,
        anchorId: result.anchorId,
        activeId: action.id,
      };
    }
    case 'select-all': {
      if (state.selectionMode !== 'multiple') return state;
      const rows = getVisibleRows(state.model, state.expandedIds);
      return {
        ...state,
        selectedIds: new Set(rows.filter((row) => !row.disabled).map((row) => row.id)),
      };
    }
    case 'clear-selection':
      return { ...state, selectedIds: new Set(), anchorId: state.activeId };
  }
}
