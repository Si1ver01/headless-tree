import type { NodeId, TreeModel, VisibleTreeRow } from './types';

export function getVisibleRows<TNode>(
  model: TreeModel<TNode>,
  expandedIds: ReadonlySet<NodeId>,
): readonly VisibleTreeRow<TNode>[] {
  const rows: VisibleTreeRow<TNode>[] = [];
  const visit = (
    id: NodeId,
    depth: number,
    posInSet: number,
    setSize: number,
    parentId: NodeId | null,
  ): void => {
    const node = model.nodes.get(id);
    if (!node) return;
    const expanded = expandedIds.has(id);
    rows.push({
      id: node.id,
      data: node.data,
      label: node.label,
      depth,
      index: rows.length,
      setSize,
      posInSet,
      parentId,
      disabled: node.disabled,
      expandable: node.expandable,
      expanded,
    });
    if (!expanded) return;
    node.childrenIds.forEach((childId, index) =>
      visit(childId, depth + 1, index + 1, node.childrenIds.length, id),
    );
  };
  model.roots.forEach((id, index) => visit(id, 1, index + 1, model.roots.length, null));
  return rows;
}
