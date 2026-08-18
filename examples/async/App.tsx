import { useTreeAsync } from '../../src/react/use-tree-async';

export function AsyncStatus({
  load,
}: {
  load: (id: string, context: { signal: AbortSignal }) => Promise<readonly string[]>;
}) {
  const asyncTree = useTreeAsync(load);
  const state = asyncTree.states.get('root');
  return (
    <button type="button" onClick={() => void asyncTree.load('root')}>
      {state?.status ?? 'idle'}
    </button>
  );
}
