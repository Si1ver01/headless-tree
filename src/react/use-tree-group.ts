import { useMemo } from 'react';
import type { NodeId } from '../core/types';

export function useTreeGroup<TNode>(
  tree: ReturnType<typeof import('./use-tree').useTree<TNode>>,
  parentId: NodeId,
) {
  return useMemo(
    () => ({
      parentId,
      rows: tree.visibleItems.filter((row) => row.parentId === parentId),
      getGroupProps: tree.getGroupProps,
    }),
    [parentId, tree],
  );
}
