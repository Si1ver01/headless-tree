# headless-tree

Headless React primitives for accessible tree views. The package provides typed state, ARIA prop getters,
keyboard navigation, selection and async children loading while leaving markup and styling to the consumer.

```tsx
const tree = useTree({ nodes, getNodeId: (node) => node.id, getNodeLabel: (node) => node.label });
return (
  <div {...tree.getTreeProps()}>
    {tree.visibleItems.map((item) => (
      <div {...item.getItemProps()} />
    ))}
  </div>
);
```

The first release focuses on predictable keyboard and async behavior. Virtualization, drag-and-drop and inline
editing are intentionally outside the package scope.
