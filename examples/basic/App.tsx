import { useTree } from '../../src/react/use-tree';

type ExampleNode = { id: string; label: string; children?: readonly ExampleNode[] };
const roots: readonly ExampleNode[] = [
  { id: 'root', label: 'Root', children: [{ id: 'child', label: 'Child' }] },
];

export function BasicTree() {
  const tree = useTree({
    roots,
    getNodeId: (node) => node.id,
    getNodeLabel: (node) => node.label,
    getNodeChildren: (node) => node.children,
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
