import { renderHook, act } from '@testing-library/react';
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
    expect(result.current.states.get('parent')?.status).toBe('loaded');
  });
});
