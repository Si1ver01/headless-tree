# Architecture

The package separates pure model and interaction helpers under `src/core` from the React adapter under `src/react`.
Core functions return immutable values and diagnostics. The adapter owns hooks, DOM events, and prop getters.
