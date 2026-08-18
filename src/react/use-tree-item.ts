import { useMemo } from 'react';
import type { NodeId } from '../core/types';

export function useTreeItem<TNode>(
  tree: ReturnType<typeof import('./use-tree').useTree<TNode>>,
  id: NodeId,
) {
  return useMemo(() => {
    const row = tree.visibleItems.find((item) => item.id === id);
    return { row, getItemProps: (props?: Record<string, unknown>) => tree.getItemProps(id, props) };
  }, [id, tree]);
}
