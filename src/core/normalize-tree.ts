import type {
  NodeId,
  NormalizeTreeOptions,
  TreeDiagnostic,
  TreeModel,
  TreeNodeRecord,
} from './types';

const diagnostic = (
  code: TreeDiagnostic['code'],
  message: string,
  path: readonly NodeId[],
  nodeId?: NodeId,
): TreeDiagnostic => ({ code, message, path, nodeId, severity: 'error' });

export function normalizeTree<TNode>(
  roots: readonly TNode[],
  options: NormalizeTreeOptions<TNode>,
): TreeModel<TNode> {
  const nodes = new Map<NodeId, TreeNodeRecord<TNode>>();
  const diagnostics: TreeDiagnostic[] = [];
  const rootIds: NodeId[] = [];

  const visit = (
    node: TNode,
    parentId: NodeId | null,
    ancestors: readonly NodeId[],
  ): NodeId | null => {
    let id: NodeId;
    try {
      id = options.getNodeId(node);
    } catch {
      diagnostics.push(diagnostic('invalid-children', 'getNodeId failed', ancestors));
      return null;
    }
    if (!id || typeof id !== 'string') {
      diagnostics.push(
        diagnostic('invalid-children', 'node id must be a non-empty string', ancestors, id),
      );
      return null;
    }
    if (ancestors.includes(id)) {
      diagnostics.push(diagnostic('cycle', 'node references an ancestor', [...ancestors, id], id));
      return null;
    }
    if (nodes.has(id)) {
      diagnostics.push(
        diagnostic('duplicate-id', 'node id is declared more than once', [...ancestors, id], id),
      );
      return null;
    }

    const children = options.getNodeChildren?.(node);
    if (children !== undefined && !Array.isArray(children)) {
      diagnostics.push(
        diagnostic('invalid-children', 'children must be an array', [...ancestors, id], id),
      );
    }
    const childIds: NodeId[] = [];
    const record: TreeNodeRecord<TNode> = {
      id,
      data: node,
      label: options.getNodeLabel(node),
      parentId,
      childrenIds: childIds,
      disabled: options.getNodeDisabled?.(node) ?? false,
      expandable: Boolean(children?.length),
    };
    nodes.set(id, record);
    for (const child of children ?? []) {
      const childId = visit(child, id, [...ancestors, id]);
      if (childId) childIds.push(childId);
    }
    return id;
  };

  for (const root of roots) {
    const id = visit(root, null, []);
    if (id) rootIds.push(id);
  }

  return { nodes, roots: rootIds, diagnostics };
}
