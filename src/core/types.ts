export type NodeId = string;

export type TreeDiagnosticCode =
  'duplicate-id' | 'missing-parent' | 'cycle' | 'invalid-children' | 'invalid-controlled-state';

export interface TreeDiagnostic {
  readonly code: TreeDiagnosticCode;
  readonly nodeId?: NodeId | undefined;
  readonly path: readonly NodeId[];
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface TreeNodeRecord<TNode> {
  readonly id: NodeId;
  readonly data: TNode;
  readonly label: string;
  readonly parentId: NodeId | null;
  readonly childrenIds: readonly NodeId[];
  readonly disabled: boolean;
  readonly expandable: boolean;
}

export interface TreeModel<TNode> {
  readonly nodes: ReadonlyMap<NodeId, TreeNodeRecord<TNode>>;
  readonly roots: readonly NodeId[];
  readonly diagnostics: readonly TreeDiagnostic[];
}

export interface NormalizeTreeOptions<TNode> {
  readonly getNodeId: (node: TNode) => NodeId;
  readonly getNodeLabel: (node: TNode) => string;
  readonly getNodeChildren?: (node: TNode) => readonly TNode[] | undefined;
  readonly getNodeDisabled?: (node: TNode) => boolean | undefined;
}

export interface VisibleTreeRow<TNode> {
  readonly id: NodeId;
  readonly data: TNode;
  readonly label: string;
  readonly depth: number;
  readonly index: number;
  readonly setSize: number;
  readonly posInSet: number;
  readonly parentId: NodeId | null;
  readonly disabled: boolean;
  readonly expandable: boolean;
  readonly expanded: boolean;
}

export interface AriaTreeItemProps {
  readonly id: string;
  readonly role: 'treeitem';
  readonly 'aria-level': number;
  readonly 'aria-posinset': number;
  readonly 'aria-setsize': number;
  readonly 'aria-expanded'?: boolean | undefined;
  readonly 'aria-selected'?: boolean | undefined;
  readonly 'aria-disabled'?: boolean | undefined;
  readonly tabIndex: -1 | 0;
}
