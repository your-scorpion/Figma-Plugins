export type NumberVariable = {
  id: string;
  name: string;
  key: string;
  value?: number;
};

export type PaddingNode = {
  id: string;
  name: string;
  isAutoLayout: boolean;
  layoutMode?: string;
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  itemSpacing?: number;
  children?: PaddingNode[];
};

export type TabType = 'paddings' | 'colors' | 'buttons';

export type PluginMessageType =
  | 'padding-data'
  | 'number-variables'
  | 'selection-frames'
  | 'selection-changed'
  | 'duplicate-selection'
  | 'select-next-autolayout'
  | 'create-padding-variables'
  | 'arrange-frames'
  | 'find-duplicate-top-level-frames'
  | 'apply-even-paddings'
  | 'snap-auto-layout-to-grid'
  | 'convert-colors-to-variables'
  | 'create-all-color-variables-in-collection'
  | 'alias-local-to-imported-by-name'
  | 'update-padding'
  | 'update-item-spacing'
  | 'rename-node'
  | 'zoom-to-node'
  | 'recompute-text-layout'
  | 'text-recompute-start'
  | 'text-recompute-progress'
  | 'text-recompute-end'
  | 'orphan-scan-start'
  | 'orphan-scan-progress'
  | 'orphan-scan-end'
  | 'find-orphaned-instances';

export type PluginMessage = {
  type: PluginMessageType;
  data?: any;
  [key: string]: any;
};
