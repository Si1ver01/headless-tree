import { describe, expect, it } from 'vitest';
import { getKeyboardAction } from '../../src/core/keyboard';
import type { VisibleTreeRow } from '../../src/core/types';

const rows: readonly VisibleTreeRow<unknown>[] = [
  {
    id: 'parent',
    data: {},
    label: 'Parent',
    depth: 1,
    index: 0,
    setSize: 1,
    posInSet: 1,
    parentId: null,
    disabled: false,
    expandable: true,
    expanded: true,
  },
  {
    id: 'child',
    data: {},
    label: 'Child',
    depth: 2,
    index: 1,
    setSize: 1,
    posInSet: 1,
    parentId: 'parent',
    disabled: false,
    expandable: false,
    expanded: false,
  },
];

describe('keyboard actions', () => {
  it('moves to the next row and collapses with ArrowLeft', () => {
    expect(getKeyboardAction(rows, 'parent', { key: 'ArrowDown' })).toEqual({
      type: 'move',
      id: 'child',
    });
    expect(getKeyboardAction(rows, 'parent', { key: 'ArrowLeft' })).toEqual({
      type: 'collapse',
      id: 'parent',
    });
  });
});
