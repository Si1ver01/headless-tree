import { describe, expect, it } from 'vitest';
import { applySelection } from '../../src/core/selection';
import type { VisibleTreeRow } from '../../src/core/types';

const rows: readonly VisibleTreeRow<unknown>[] = [
  {
    id: 'a',
    data: {},
    label: 'A',
    depth: 1,
    index: 0,
    setSize: 3,
    posInSet: 1,
    parentId: null,
    disabled: false,
    expandable: false,
    expanded: false,
  },
  {
    id: 'b',
    data: {},
    label: 'B',
    depth: 1,
    index: 1,
    setSize: 3,
    posInSet: 2,
    parentId: null,
    disabled: true,
    expandable: false,
    expanded: false,
  },
  {
    id: 'c',
    data: {},
    label: 'C',
    depth: 1,
    index: 2,
    setSize: 3,
    posInSet: 3,
    parentId: null,
    disabled: false,
    expandable: false,
    expanded: false,
  },
];

describe('selection', () => {
  it('selects a range while skipping disabled rows', () => {
    const result = applySelection(rows, new Set(), 'a', 'c', {
      mode: 'multiple',
      additive: false,
      range: true,
    });
    expect([...result.selectedIds]).toEqual(['a', 'c']);
  });
});
