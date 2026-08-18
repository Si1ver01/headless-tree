# Async loading

Pass a `loadChildren` function to `useTreeAsync`. Each request receives an `AbortSignal`; repeated loads for one node
are deduplicated, aborts are ignored, and a stale response cannot replace a newer request. Consumers own the loading,
error, retry, and empty-state UI.
