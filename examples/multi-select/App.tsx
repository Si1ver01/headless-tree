import { useTree } from '../../src/react/use-tree';

export function MultiSelectTree({ roots }: { roots: readonly { id: string; label: string }[] }) {
  const tree = useTree({
    roots,
    selectionMode: 'multiple',
    getNodeId: (node) => node.id,
    getNodeLabel: (node) => node.label,
  });
  return (
    <div {...tree.getTreeProps()}>
      {tree.visibleItems.map((row) => (
        <div key={row.id} {...tree.getItemProps(row.id)}>
          {row.label}
        </div>
      ))}
    </div>
  );
}
