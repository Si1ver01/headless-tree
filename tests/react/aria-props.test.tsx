import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTree } from '../../src/react/use-tree';
import { basicTree } from '../fixtures/basic-tree';

describe('useTree ARIA API', () => {
  it('returns headless tree and item props', () => {
    const { result } = renderHook(() =>
      useTree({
        roots: basicTree,
        getNodeId: (node) => node.id,
        getNodeLabel: (node) => node.label,
        getNodeChildren: (node) => node.children,
        getNodeDisabled: (node) => node.disabled,
      }),
    );
    const tree = result.current;
    expect(tree.getTreeProps()).toMatchObject({ role: 'tree' });
    expect(tree.getItemProps('documents')).toMatchObject({
      role: 'treeitem',
      'aria-level': 1,
      tabIndex: 0,
    });
  });
});
