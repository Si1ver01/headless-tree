import { useMemo } from 'react';
import type { NodeId } from '../core/types';
import type { useTree } from './use-tree';

type TreeApi<TNode> = ReturnType<typeof useTree<TNode>>;

export function useTreeItem<TNode>(tree: TreeApi<TNode>, id: NodeId) {
  return useMemo(() => {
    const row = tree.visibleItems.find((item) => item.id === id);
    return { row, getItemProps: (props?: Record<string, unknown>) => tree.getItemProps(id, props) };
  }, [id, tree]);
}
