import { describe, expect, it } from 'vitest';
import { getAncestors, isDescendant } from '../../src/core/node-registry';
import { normalizeTree } from '../../src/core/normalize-tree';
import { basicTree } from '../fixtures/basic-tree';

const model = normalizeTree(basicTree, {
  getNodeId: (node) => node.id,
  getNodeLabel: (node) => node.label,
  getNodeChildren: (node) => node.children,
  getNodeDisabled: (node) => node.disabled,
});

describe('node registry', () => {
  it('keeps parent links and ancestors immutable', () => {
    expect(getAncestors(model, 'notes')).toEqual(['documents']);
    expect(isDescendant(model, 'documents', 'notes')).toBe(true);
    expect(isDescendant(model, 'notes', 'documents')).toBe(false);
  });

  it('reports duplicate ids and cycles', () => {
    const duplicate = normalizeTree(
      [
        { id: 'a', label: 'A' },
        { id: 'a', label: 'Again' },
      ],
      {
        getNodeId: (node) => node.id,
        getNodeLabel: (node) => node.label,
      },
    );
    expect(duplicate.diagnostics.some(({ code }) => code === 'duplicate-id')).toBe(true);
  });
});
