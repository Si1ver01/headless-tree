import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTreeAsync } from '../../src/react/use-tree-async';

describe('useTreeAsync', () => {
  it('deduplicates an in-flight request and exposes loaded state', async () => {
    let resolve: ((nodes: readonly string[]) => void) | undefined;
    const loader = vi.fn(
      () =>
        new Promise<readonly string[]>((done) => {
          resolve = done;
        }),
    );
    const { result } = renderHook(() => useTreeAsync(loader));
    let first: Promise<readonly string[] | undefined> | undefined;
    act(() => {
      first = result.current.load('parent');
      void result.current.load('parent');
    });
    expect(loader).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve?.(['child']);
      await first;
    });
    expect(result.current.states.get('parent')).toMatchObject({
      status: 'loaded',
      requestVersion: 1,
    });
  });

  it('withholds raw loader errors from state and rejected promises', async () => {
    const events: string[] = [];
    const loader = vi.fn(() =>
      Promise.reject(new Error('database connection string must never reach the UI')),
    );
    const { result } = renderHook(() =>
      useTreeAsync(loader, { onEvent: (event) => events.push(event.message) }),
    );

    await expect(result.current.load('parent')).rejects.toMatchObject({
      code: 'TREE_CHILDREN_LOAD_FAILED',
      message: 'Unable to load tree children.',
    });
    await waitFor(() =>
      expect(result.current.states.get('parent')?.error).toMatchObject({
        code: 'TREE_CHILDREN_LOAD_FAILED',
        message: 'Unable to load tree children.',
      }),
    );
    expect(events.at(-1)).toContain('raw error withheld');
  });
});
