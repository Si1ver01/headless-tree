# Async loading

Pass a `loadChildren` function to `useTreeAsync`. Each request receives an `AbortSignal`; repeated loads for one node
are deduplicated, aborts are ignored, and a stale response cannot replace a newer request. Consumers own the loading,
error, retry, and empty-state UI. Failed requests expose only the stable client-safe error
`{ code: 'TREE_CHILDREN_LOAD_FAILED', message: 'Unable to load tree children.' }`; never render a raw exception,
stack trace, upstream response, or internal path. Pass `onEvent` when development diagnostics are needed; events use
the `[FIX:client-safe-error]` prefix and never include the original error value.
