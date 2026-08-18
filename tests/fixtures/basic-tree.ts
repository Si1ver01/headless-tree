export interface FixtureNode {
  readonly id: string;
  readonly label: string;
  readonly children?: readonly FixtureNode[];
  readonly disabled?: boolean;
}

export const basicTree: readonly FixtureNode[] = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'resume', label: 'Resume' },
      { id: 'notes', label: 'Notes' },
    ],
  },
  { id: 'archive', label: 'Archive', disabled: true },
];
