import { useCallback, useEffect, useRef, useState } from 'react';
import type { NodeId } from '../core/types';

export interface AsyncLoadState {
  readonly status: 'idle' | 'loading' | 'loaded' | 'error';
  readonly error: unknown;
  readonly requestToken: number;
}

export type LoadChildren<TNode> = (
  nodeId: NodeId,
  context: { readonly signal: AbortSignal },
) => Promise<readonly TNode[]>;

export function useTreeAsync<TNode>(loadChildren: LoadChildren<TNode>) {
  const requests = useRef(new Map<NodeId, { token: number; controller: AbortController }>());
  const [states, setStates] = useState<ReadonlyMap<NodeId, AsyncLoadState>>(new Map());
  const load = useCallback(
    async (nodeId: NodeId) => {
      const existing = requests.current.get(nodeId);
      if (existing) return;
      const controller = new AbortController();
      const token = (states.get(nodeId)?.requestToken ?? 0) + 1;
      requests.current.set(nodeId, { token, controller });
      setStates((previous) =>
        new Map(previous).set(nodeId, { status: 'loading', error: null, requestToken: token }),
      );
      try {
        const children = await loadChildren(nodeId, { signal: controller.signal });
        if (requests.current.get(nodeId)?.token !== token) return;
        requests.current.delete(nodeId);
        setStates((previous) =>
          new Map(previous).set(nodeId, { status: 'loaded', error: null, requestToken: token }),
        );
        return children;
      } catch (error) {
        if (controller.signal.aborted || requests.current.get(nodeId)?.token !== token) return;
        requests.current.delete(nodeId);
        setStates((previous) =>
          new Map(previous).set(nodeId, { status: 'error', error, requestToken: token }),
        );
        throw error;
      }
    },
    [loadChildren, states],
  );
  const abort = useCallback((nodeId: NodeId) => {
    requests.current.get(nodeId)?.controller.abort();
    requests.current.delete(nodeId);
  }, []);
  useEffect(
    () => () => {
      for (const request of requests.current.values()) request.controller.abort();
    },
    [],
  );
  return { states, load, abort, retry: load };
}
