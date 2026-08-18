import type { NodeId, TreeModel } from './types';

export type TreeAction<TNode> =
  | { readonly type: 'replace-model'; readonly model: TreeModel<TNode> }
  | { readonly type: 'focus'; readonly id: NodeId | null }
  | { readonly type: 'toggle-expanded'; readonly id: NodeId }
  | { readonly type: 'set-expanded'; readonly id: NodeId; readonly expanded: boolean }
  | {
      readonly type: 'select';
      readonly id: NodeId;
      readonly additive: boolean;
      readonly range: boolean;
    }
  | { readonly type: 'select-all' }
  | { readonly type: 'clear-selection' };
