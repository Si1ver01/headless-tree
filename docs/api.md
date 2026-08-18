# API

`useTree` accepts root data and typed accessors, then returns `visibleItems`, state snapshots, `getTreeProps`,
`getItemProps`, `getGroupProps`, and a dispatch function. `useTreeAsync` manages cancellable child loading and
exposes `idle`, `loading`, `loaded`, and `error` states.
