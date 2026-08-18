import type { AriaTreeItemProps, NodeId, VisibleTreeRow } from './types';

export function deriveAriaProps<TNode>(
  row: VisibleTreeRow<TNode>,
  options: {
    readonly activeId: NodeId | null;
    readonly selectedIds: ReadonlySet<NodeId>;
    readonly domIdPrefix: string;
  },
): AriaTreeItemProps {
  const props: {
    -readonly [Key in keyof AriaTreeItemProps]: AriaTreeItemProps[Key];
  } = {
    id: `${options.domIdPrefix}-${row.id}`,
    role: 'treeitem',
    'aria-level': row.depth,
    'aria-posinset': row.posInSet,
    'aria-setsize': row.setSize,
    tabIndex: options.activeId === row.id ? 0 : -1,
  };
  if (row.expandable) props['aria-expanded'] = row.expanded;
  if (options.selectedIds.size > 0) props['aria-selected'] = options.selectedIds.has(row.id);
  if (row.disabled) props['aria-disabled'] = true;
  return props;
}
