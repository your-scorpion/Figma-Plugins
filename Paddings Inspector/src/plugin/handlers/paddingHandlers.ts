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

// Apply random paddings
export function handleApplyRandomPaddings(msg: any) {
  try {
    const selected = figma.currentPage.selection.filter(
      (node): node is FrameNode | ComponentNode | InstanceNode =>
        (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
        isAutoLayoutNode(node) &&
        node.visible &&
        !node.locked
    );

    if (selected.length === 0) {
      figma.notify('Select at least one Auto Layout node.');
      return;
    }

    const randomnessLevel = msg.randomnessLevel || 50;

    const getPaddingScale = (level: number) => {
      if (level <= 20) return [0, 4, 8];
      if (level <= 40) return [0, 4, 8, 12, 16];
      if (level <= 60) return [0, 4, 8, 12, 16, 20, 24];
      if (level <= 80) return [0, 4, 8, 12, 16, 20, 24, 28, 32];
      return [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
    };

    const getSpacingScale = (level: number) => {
      if (level <= 20) return [0, 4, 8];
      if (level <= 40) return [0, 4, 8, 12];
      if (level <= 60) return [0, 4, 8, 12, 16, 20];
      if (level <= 80) return [0, 4, 8, 12, 16, 20, 24];
      return [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
    };

    const paddingScale = getPaddingScale(randomnessLevel);
    const spacingScale = getSpacingScale(randomnessLevel);

    const randFrom = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)];

    const applyRandomToNode = (node: FrameNode | ComponentNode | InstanceNode) => {
      if (!isAutoLayoutNode(node)) return;
      const padV = randFrom(paddingScale);
      const padH = randFrom(paddingScale);
      const maxPad = paddingScale[paddingScale.length - 1];
      const vPad = Math.min(padV, maxPad);
      const hPad = Math.min(padH, maxPad);
      const gap = randFrom(spacingScale);

      try {
        (node as any).paddingTop = vPad;
      } catch {}
      try {
        (node as any).paddingBottom = vPad;
      } catch {}
      try {
        (node as any).paddingLeft = hPad;
      } catch {}
      try {
        (node as any).paddingRight = hPad;
      } catch {}
      try {
        (node as any).primaryAxisSpacing = gap;
      } catch {}
      try {
        (node as any).counterAxisSpacing = gap;
      } catch {}
      try {
        (node as any).itemSpacing = gap;
      } catch {}
    };

    const walk = (node: SceneNode) => {
      if (
        (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
        isAutoLayoutNode(node)
      ) {
        applyRandomToNode(node);
      }
      if ('children' in node && Array.isArray((node as any).children)) {
        for (const child of (node as any).children as ReadonlyArray<SceneNode>) {
          walk(child);
        }
      }
    };

    for (const n of selected) walk(n);

    figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
    figma.notify(
      `Assigned random paddings (${randomnessLevel}% randomness) to ${selected.length} selection roots (and their descendants).`
    );
  } catch (e) {
    console.error('Error applying random paddings:', e);
    figma.notify('Error applying random paddings.');
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
