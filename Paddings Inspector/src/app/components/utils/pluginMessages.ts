import { PluginMessage } from '../types';

export const sendPluginMessage = (message: PluginMessage): void => {
  parent.postMessage({ pluginMessage: message }, '*');
};

export const sendSelectNextAutoLayout = (): void => {
  sendPluginMessage({ type: 'select-next-autolayout' });
};

export const sendCreatePaddingVariables = (namePrefix: string): void => {
  sendPluginMessage({ type: 'create-padding-variables', namePrefix });
};

export const sendArrangeFrames = (postfix?: string, randomnessLevel?: number): void => {
  sendPluginMessage({ type: 'arrange-frames', postfix, randomnessLevel });
};

export const sendFindDuplicateFrames = (): void => {
  sendPluginMessage({ type: 'find-duplicate-top-level-frames' });
};

export const sendApplyRandomPaddings = (randomnessLevel: number): void => {
  sendPluginMessage({ type: 'apply-random-paddings', randomnessLevel });
};

export const sendConvertColorsToVariables = (): void => {
  sendPluginMessage({ type: 'convert-colors-to-variables' });
};

export const sendCreateAllColorVariables = (): void => {
  sendPluginMessage({ type: 'create-all-color-variables-in-collection' });
};

export const sendAliasLocalToImported = (): void => {
  sendPluginMessage({ type: 'alias-local-to-imported-by-name' });
};

export const sendZoomToNode = (nodeId: string): void => {
  sendPluginMessage({ type: 'zoom-to-node', nodeId });
};

export const sendRenameNode = (nodeId: string, newName: string): void => {
  sendPluginMessage({ type: 'rename-node', nodeId, newName });
};

export const sendRecomputeTextLayout = (): void => {
  parent.postMessage({ pluginMessage: { type: 'recompute-text-layout' } }, '*');
};

export const sendFindOrphanedInstances = (): void => {
  parent.postMessage({ pluginMessage: { type: 'find-orphaned-instances' } }, '*');
};
