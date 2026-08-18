import type { NodeId, TreeModel, TreeNodeRecord } from './types';

export function getNode<TNode>(
  model: TreeModel<TNode>,
  id: NodeId,
): TreeNodeRecord<TNode> | undefined {
  return model.nodes.get(id);
}

export function getAncestors<TNode>(model: TreeModel<TNode>, id: NodeId): readonly NodeId[] {
  const result: NodeId[] = [];
  let current = model.nodes.get(id)?.parentId ?? null;
  while (current) {
    result.unshift(current);
    current = model.nodes.get(current)?.parentId ?? null;
  }
  return result;
}

export function isDescendant<TNode>(
  model: TreeModel<TNode>,
  ancestorId: NodeId,
  id: NodeId,
): boolean {
  let current = model.nodes.get(id)?.parentId ?? null;
  while (current) {
    if (current === ancestorId) return true;
    current = model.nodes.get(current)?.parentId ?? null;
  }
  return false;
}
