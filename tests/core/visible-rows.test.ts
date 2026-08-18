import { describe, expect, it } from 'vitest';
import { deriveAriaProps } from '../../src/core/derive-aria';
import { normalizeTree } from '../../src/core/normalize-tree';
import { getVisibleRows } from '../../src/core/visible-rows';
import { basicTree } from '../fixtures/basic-tree';

const model = normalizeTree(basicTree, {
  getNodeId: (node) => node.id,
  getNodeLabel: (node) => node.label,
  getNodeChildren: (node) => node.children,
  getNodeDisabled: (node) => node.disabled,
});

describe('visible rows', () => {
  it('walks expanded nodes in preorder with sibling metadata', () => {
    const rows = getVisibleRows(model, new Set(['documents']));
    expect(rows.map((row) => row.id)).toEqual(['documents', 'resume', 'notes', 'archive']);
    expect(rows[1]).toMatchObject({ depth: 2, posInSet: 1, setSize: 2 });
  });

  it('derives ARIA attributes and one tab stop', () => {
    const rows = getVisibleRows(model, new Set(['documents']));
    const props = deriveAriaProps(rows[0]!, {
      activeId: 'documents',
      selectedIds: new Set(['documents']),
      domIdPrefix: 'tree',
    });
    expect(props).toMatchObject({
      role: 'treeitem',
      'aria-level': 1,
      'aria-expanded': true,
      'aria-selected': true,
      tabIndex: 0,
    });
  });
});
