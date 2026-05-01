import { isAutoLayoutNode, getAllPaddingData, extractAutoLayoutInfo } from '../utils/autolayout';
import {
  getOrCreatePaddingCollectionWithMode,
  createOrUpdateVariableWithCollection,
  sendNumberVariablesToUI,
} from '../utils/variables';

// Create variables from padding values
export async function createPaddingVariables(namePrefix?: string) {
  const selectedNodes = figma.currentPage.selection;

  if (selectedNodes.length === 0) {
    figma.notify('No Auto Layout frames selected. Please select Auto Layout frames first.');
    return;
  }

  const autoLayoutFrames = selectedNodes.filter(
    (node) =>
      node.type === 'FRAME' &&
      (node as FrameNode).layoutMode !== 'NONE' &&
      node.visible &&
      !node.locked &&
      !node.removed
  ) as FrameNode[];

  if (autoLayoutFrames.length === 0) {
    figma.notify('No valid Auto Layout frames selected. Please select Auto Layout frames.');
    return;
  }

  const paddingData = autoLayoutFrames.map((frame) => extractAutoLayoutInfo(frame)).filter(Boolean);

  if (paddingData.length === 0) {
    figma.notify('No Auto Layout nodes with padding found in selection');
    return;
  }

  try {
    const ensured = await getOrCreatePaddingCollectionWithMode();
    if (!ensured.collection || !ensured.modeId) {
      figma.notify('Failed to prepare Padding variable collection');
      return;
    }
    const collection = ensured.collection as VariableCollection;
    const modeId = ensured.modeId as string;

    const createdVariables: Variable[] = [];
    const valueMap: Map<number, Variable> = new Map();
    const prefix = (() => {
      try {
        const raw = (namePrefix || 'padding').trim();
        const cleaned = raw.replace(/[\x00-\x1F\x7F]/g, '').replace(/\s+/g, '-');
        return cleaned || 'padding';
      } catch {
        return 'padding';
      }
    })();

    async function processNode(node: any, originalFigmaNode?: any) {
      try {
        if (!node) return;

        let figmaNode: any = originalFigmaNode || null;
        if (node.isAutoLayout) {
          const padding = node.padding || {};
          const top = padding.top || 0;
          const bottom = padding.bottom || 0;
          const left = padding.left || 0;
          const right = padding.right || 0;
          const itemSpacing = node.itemSpacing || 0;

          if (!figmaNode && node.id) {
            try {
              figmaNode = figma.getNodeById(node.id);
            } catch (e) {
              console.warn('Could not find Figma node with ID:', node.id);
            }
          }

          const bindVariable = async (value: number, property: string) => {
            if (value >= 0) {
              const variable = await getOrCreateVariableForValue(collection, modeId, value, valueMap);
              if (variable && !createdVariables.includes(variable)) {
                createdVariables.push(variable);
              }
              if (figmaNode && property in figmaNode && variable) {
                try {
                  figmaNode.setBoundVariable(property, variable.id);
                } catch (e) {
                  console.warn(`Could not bind ${property} variable:`, e);
                }
              }
            }
          };

          await bindVariable(top, 'paddingTop');
          await bindVariable(bottom, 'paddingBottom');
          await bindVariable(left, 'paddingLeft');
          await bindVariable(right, 'paddingRight');
          await bindVariable(itemSpacing, 'itemSpacing');
        }

        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
          for (const child of node.children) {
            await processNode(child, figmaNode);
          }
        }
      } catch (error) {
        console.error('Error processing node:', error);
      }
    }

    async function getOrCreateVariableForValue(
      collection: VariableCollection,
      modeId: string,
      value: number,
      valueMap: Map<number, Variable>
    ): Promise<Variable | null> {
      try {
        if (valueMap.has(value)) {
          const existingVariable = valueMap.get(value);
          return existingVariable || null;
        }

        const varName = `${prefix}-${value}`;
        const variable = await createOrUpdateVariableWithCollection(collection, modeId, varName, value);

        if (variable) {
          valueMap.set(value, variable);
        }

        return variable;
      } catch (error) {
        console.error(`Error creating variable for value ${value}:`, error);
        return null;
      }
    }

    for (const node of paddingData) {
      let figmaNode = null;
      if (node.id) {
        try {
          figmaNode = figma.getNodeById(node.id);
        } catch (e) {
          console.warn('Could not find Figma node with ID:', node.id);
        }
      }
      await processNode(node, figmaNode);
    }

    if (createdVariables.length > 0) {
      figma.notify(
        `Created ${createdVariables.length} padding variables and assigned to ${autoLayoutFrames.length} selected Auto Layout frames`
      );
      await sendNumberVariablesToUI();
      figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
    } else {
      figma.notify('No padding variables created');
    }
  } catch (error) {
    console.error('Error creating padding variables:', error);
    figma.notify('Error creating variables: ' + (error as Error).message);
  }
}

// Update padding value
export function handleUpdatePadding(msg: any) {
  const { id, side, value, variableId } = msg;

  figma.getNodeByIdAsync(id).then((node) => {
    if (
      !node ||
      !(node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') ||
      !isAutoLayoutNode(node)
    ) {
      console.warn('Invalid node for padding update:', node);
      return;
    }

    const sideKey = `padding${side.charAt(0).toUpperCase()}${side.slice(1)}` as
      | 'paddingTop'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'paddingRight';

    try {
      if (typeof variableId === 'string') {
        (node as any).setBoundVariable(sideKey, variableId);
      } else if (typeof value === 'number' && !isNaN(value)) {
        (node as any)[sideKey] = value;
      } else {
        console.warn('Invalid padding value:', value);
      }
      figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
    } catch (e) {
      console.error(`Failed to update padding for ${id}`, e);
    }
  });
}

// Update item spacing
export function handleUpdateItemSpacing(msg: any) {
  const { id, value, variableId } = msg;
  const node = figma.getNodeById(id);
  if (
    !node ||
    !(node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'SECTION') ||
    !isAutoLayoutNode(node)
  )
    return;

  try {
    if (variableId) {
      try {
        (node as any).setBoundVariable('primaryAxisSpacing', variableId);
      } catch {}
      try {
        (node as any).setBoundVariable('counterAxisSpacing', variableId);
      } catch {}
      try {
        (node as any).setBoundVariable('itemSpacing', variableId);
      } catch {}
    } else if (typeof value === 'number') {
      try {
        (node as any).primaryAxisSpacing = value;
      } catch {}
      try {
        (node as any).counterAxisSpacing = value;
      } catch {}
      try {
        (node as any).itemSpacing = value;
      } catch {}
    }
    figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
  } catch (e) {
    console.error(`Failed to update itemSpacing for ${id}`, e);
  }
}

// Apply a uniform padding increase to selected Auto Layout nodes
export function handleApplyEvenPaddings(msg: any) {
  try {
    const selectedRoots = figma.currentPage.selection.filter(
      (node): node is FrameNode | ComponentNode | InstanceNode =>
        (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
        isAutoLayoutNode(node) &&
        node.visible &&
        !node.locked
    );

    if (selectedRoots.length === 0) {
      figma.notify('Select at least one Auto Layout node.');
      return;
    }

    const paddingIncrement = typeof msg.paddingIncrement === 'number'
      ? Math.max(0, Math.round(msg.paddingIncrement))
      : 0;

    type PaddingBaseline = {
      paddingTop: number;
      paddingBottom: number;
      paddingLeft: number;
      paddingRight: number;
    };

    type PaddingPreviewSession = {
      selectionKey: string;
      baselineByNodeId: Record<string, PaddingBaseline>;
    };

    const previewStore = figma.root.getPluginData('paddingPreviewSession');
    let previewSession: PaddingPreviewSession | null = null;

    if (previewStore) {
      try {
        previewSession = JSON.parse(previewStore) as PaddingPreviewSession;
      } catch {
        previewSession = null;
      }
    }

    const collectAutoLayoutTree = (node: SceneNode, nodes: Array<FrameNode | ComponentNode | InstanceNode>) => {
      if (
        (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
        isAutoLayoutNode(node) &&
        node.visible &&
        !node.locked
      ) {
        nodes.push(node);
      }

      if ('children' in node && Array.isArray((node as any).children)) {
        for (const child of (node as any).children as ReadonlyArray<SceneNode>) {
          collectAutoLayoutTree(child, nodes);
        }
      }
    };

    const selectedNodes: Array<FrameNode | ComponentNode | InstanceNode> = [];
    for (const root of selectedRoots) {
      collectAutoLayoutTree(root, selectedNodes);
    }

    const selectionKey = selectedNodes.map((node: FrameNode | ComponentNode | InstanceNode) => node.id).sort().join(',');

    if (!previewSession || previewSession.selectionKey !== selectionKey) {
      previewSession = {
        selectionKey,
        baselineByNodeId: selectedNodes.reduce<Record<string, PaddingBaseline>>((acc: Record<string, PaddingBaseline>, node: FrameNode | ComponentNode | InstanceNode) => {
          acc[node.id] = {
            paddingTop: node.paddingTop,
            paddingBottom: node.paddingBottom,
            paddingLeft: node.paddingLeft,
            paddingRight: node.paddingRight,
          };
          return acc;
        }, {}),
      };
    }

    const applyIncrementToNode = (node: FrameNode | ComponentNode | InstanceNode) => {
      const baseline = previewSession?.baselineByNodeId[node.id];
      if (!baseline) return;

      try {
        (node as any).paddingTop = Math.max(0, baseline.paddingTop + paddingIncrement);
      } catch {}
      try {
        (node as any).paddingBottom = Math.max(0, baseline.paddingBottom + paddingIncrement);
      } catch {}
      try {
        (node as any).paddingLeft = Math.max(0, baseline.paddingLeft + paddingIncrement);
      } catch {}
      try {
        (node as any).paddingRight = Math.max(0, baseline.paddingRight + paddingIncrement);
      } catch {}
    };

    for (const node of selectedNodes) {
      applyIncrementToNode(node);
    }

    if (paddingIncrement === 0) {
      figma.root.setPluginData('paddingPreviewSession', '');
    } else {
      figma.root.setPluginData('paddingPreviewSession', JSON.stringify(previewSession));
    }

    figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
  } catch (e) {
    console.error('Error applying even paddings:', e);
    figma.notify('Error applying even paddings.');
  }
}

export function handleSnapAutoLayoutToGrid() {
  try {
    const selected = figma.currentPage.selection.filter(
      (node): node is FrameNode | ComponentNode | InstanceNode =>
        (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
        node.visible &&
        !node.locked
    );

    if (selected.length === 0) {
      figma.notify('Select at least one Auto Layout node.');
      return;
    }

    const snapToTwoPixelGrid = (value: number) => {
      if (!Number.isFinite(value) || value <= 0) return 0;
      return Math.ceil(value / 2) * 2;
    };

    const applyGridToNode = (node: FrameNode | ComponentNode | InstanceNode) => {
      try {
        (node as any).paddingTop = snapToTwoPixelGrid(node.paddingTop);
      } catch {}
      try {
        (node as any).paddingBottom = snapToTwoPixelGrid(node.paddingBottom);
      } catch {}
      try {
        (node as any).paddingLeft = snapToTwoPixelGrid(node.paddingLeft);
      } catch {}
      try {
        (node as any).paddingRight = snapToTwoPixelGrid(node.paddingRight);
      } catch {}
      try {
        (node as any).itemSpacing = snapToTwoPixelGrid(node.itemSpacing ?? 0);
      } catch {}
    };

    const walk = (node: SceneNode) => {
      if (
        (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
        isAutoLayoutNode(node) &&
        node.visible &&
        !node.locked
      ) {
        applyGridToNode(node);
      }

      if ('children' in node && Array.isArray((node as any).children)) {
        for (const child of (node as any).children as ReadonlyArray<SceneNode>) {
          walk(child);
        }
      }
    };

    for (const node of selected) {
      walk(node);
    }

    figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
    figma.notify(
      `Snapped selected Auto Layout paddings and spacing to the 2px grid for ${selected.length} selection root${selected.length === 1 ? '' : 's'}.`
    );
  } catch (e) {
    console.error('Error snapping Auto Layout values to grid:', e);
    figma.notify('Error snapping Auto Layout values to the 2px grid.');
  }
}

// Bulk apply depth-based spacing
export function handleBulkApplyDepthSpacing() {
  try {
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify('No frames selected. Please select Auto Layout frames first.');
      return;
    }

    const autoLayoutFrames = selectedNodes.filter(
      (node) =>
        node.type === 'FRAME' &&
        (node as FrameNode).layoutMode !== 'NONE' &&
        node.visible &&
        !node.locked &&
        !node.removed
    ) as FrameNode[];

    if (autoLayoutFrames.length === 0) {
      figma.notify('No valid Auto Layout frames selected.');
      return;
    }

    const getPaddingForDepth = (depth: number): number => {
      return Math.max(8, 24 - depth * 8);
    };

    const getSpacingForDepth = (depth: number): number => {
      return Math.max(4, 12 - depth * 4);
    };

    const applyCascadingPaddings = (
      node: FrameNode | ComponentNode | InstanceNode | SectionNode,
      depth: number = 0
    ) => {
      try {
        if (isAutoLayoutNode(node)) {
          const paddingValue = getPaddingForDepth(depth);
          const spacingValue = getSpacingForDepth(depth);

          try {
            (node as any).paddingTop = paddingValue;
            (node as any).paddingRight = paddingValue;
            (node as any).paddingBottom = paddingValue;
            (node as any).paddingLeft = paddingValue;
          } catch (e) {
            console.warn('Could not set padding for node:', node.id, e);
          }

          try {
            (node as any).primaryAxisSpacing = spacingValue;
            (node as any).counterAxisSpacing = spacingValue;
            (node as any).itemSpacing = spacingValue;
          } catch (e) {
            console.warn('Could not set spacing for node:', node.id, e);
          }
        }

        if ('children' in node && node.children) {
          for (const child of node.children) {
            if (
              child.type === 'FRAME' ||
              child.type === 'COMPONENT' ||
              child.type === 'INSTANCE' ||
              child.type === 'SECTION'
            ) {
              applyCascadingPaddings(child as any, depth + 1);
            }
          }
        }
      } catch (error) {
        console.error('Error processing node:', node.id, error);
      }
    };

    for (const frame of autoLayoutFrames) {
      applyCascadingPaddings(frame, 0);
    }

    figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
    figma.notify(`Applied cascading paddings to ${autoLayoutFrames.length} Auto Layout frames`);
  } catch (error) {
    console.error('Error applying cascading paddings:', error);
    figma.notify('Error applying cascading paddings: ' + (error as Error).message);
  }
}
