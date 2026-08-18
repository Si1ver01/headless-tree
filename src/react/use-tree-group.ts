import { useMemo } from 'react';
import type { NodeId } from '../core/types';
import type { useTree } from './use-tree';

type TreeApi<TNode> = ReturnType<typeof useTree<TNode>>;

export function useTreeGroup<TNode>(tree: TreeApi<TNode>, parentId: NodeId) {
  return useMemo(
    () => ({
      parentId,
      rows: tree.visibleItems.filter((row) => row.parentId === parentId),
      getGroupProps: tree.getGroupProps,
    }),
    [parentId, tree],
  );
}
