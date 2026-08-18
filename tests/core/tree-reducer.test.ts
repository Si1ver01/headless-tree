import { describe, expect, it } from 'vitest';
import { normalizeTree } from '../../src/core/normalize-tree';
import { treeReducer } from '../../src/core/tree-reducer';
import { createTreeState } from '../../src/core/tree-state';
import { basicTree } from '../fixtures/basic-tree';

const model = normalizeTree(basicTree, {
  getNodeId: (node) => node.id,
  getNodeLabel: (node) => node.label,
  getNodeChildren: (node) => node.children,
  getNodeDisabled: (node) => node.disabled,
});

describe('tree reducer', () => {
  it('expands and selects without mutating the previous state', () => {
    const state = createTreeState(model, { selectionMode: 'multiple' });
    const expanded = treeReducer(state, { type: 'toggle-expanded', id: 'documents' });
    const selected = treeReducer(expanded, {
      type: 'select',
      id: 'notes',
      additive: false,
      range: false,
    });
    expect([...state.expandedIds]).toEqual([]);
    expect([...selected.expandedIds]).toEqual(['documents']);
    expect([...selected.selectedIds]).toEqual(['notes']);
  });

  it('skips disabled nodes during select all', () => {
    const state = createTreeState(model, { selectionMode: 'multiple' });
    const next = treeReducer(state, { type: 'select-all' });
    expect(next.selectedIds.has('archive')).toBe(false);
  });
});
