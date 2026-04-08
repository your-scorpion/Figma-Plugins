import { isAutoLayoutNode, getAllPaddingData } from '../utils/autolayout';

// Select all Auto Layout frames
export function handleSelectAllAutoLayout() {
  const autoLayoutNodes = figma.root.findAll(
    (node) => node.type === 'FRAME' && (node as FrameNode).layoutMode !== 'NONE'
  ) as FrameNode[];

  if (autoLayoutNodes.length > 0) {
    figma.currentPage.selection = autoLayoutNodes;
    figma.viewport.scrollAndZoomIntoView(autoLayoutNodes);
  } else {
    figma.notify('No Auto Layout frames found on this page.');
  }
}

// Select next Auto Layout (random or sequential)
export function handleSelectNextAutoLayout(_msg?: any) {
  try {
    // Check if this is a sequential selection (from current selection)
    const currentSelection = figma.currentPage.selection;
    const autoLayoutNodes = figma.currentPage.findAll(
      (node) =>
        (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') &&
        isAutoLayoutNode(node)
    ) as (FrameNode | ComponentNode | InstanceNode)[];

    if (autoLayoutNodes.length === 0) {
      figma.notify('No Auto Layout frames found on this page.');
      return;
    }

    // Try sequential selection first
    if (currentSelection.length > 0) {
      const currentAutoLayout = currentSelection.find((node) =>
        autoLayoutNodes.some((alNode) => alNode.id === node.id)
      );

      if (currentAutoLayout) {
        const currentIndex = autoLayoutNodes.findIndex((node) => node.id === currentAutoLayout.id);
        const nextIndex = (currentIndex + 1) % autoLayoutNodes.length;
        const nextNode = autoLayoutNodes[nextIndex];
        figma.currentPage.selection = [nextNode];
        figma.viewport.scrollAndZoomIntoView([nextNode]);
        figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
        return;
      }
    }

    // Fall back to random selection
    const validNodes = autoLayoutNodes.filter(
      (node) =>
        node &&
        !node.removed &&
        node.visible &&
        !node.locked &&
        (node as FrameNode).layoutMode &&
        (node as FrameNode).layoutMode !== 'NONE'
    );

    if (validNodes.length === 0) {
      figma.notify('No valid Auto Layout frames found.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * validNodes.length);
    const selectedNode = validNodes[randomIndex];

    if (!selectedNode || selectedNode.removed || !selectedNode.visible) {
      figma.notify('Selected node is no longer valid. Please try again.');
      return;
    }

    figma.currentPage.selection = [selectedNode];

    try {
      figma.viewport.scrollAndZoomIntoView([selectedNode]);
    } catch (zoomError) {
      console.warn('Could not zoom to selected node:', zoomError);
    }

    figma.notify(`Selected: ${selectedNode.name}`);
  } catch (error) {
    console.error('Error selecting random Auto Layout:', error);
    figma.notify('Error selecting Auto Layout frame. Please try again.');
  }
}

// Zoom to node
export async function handleZoomToNode(msg: any) {
  const node = await figma.getNodeByIdAsync(msg.nodeId);
  if (node && 'parent' in node) {
    figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
    figma.currentPage.selection = [node as SceneNode];
  }
}

// Rename node
export function handleRenameNode(msg: any) {
  const { nodeId, newName } = msg;
  figma.getNodeByIdAsync(nodeId).then((node) => {
    if (node && 'name' in node) {
      let name: string = String(newName ?? '').trim();
      name = name.replace(/[\x00-\x1F\x7F]/g, '');
      if (name.length > 128) name = name.slice(0, 128);
      if (!name || name === (node as any).name) return;
      (node as any).name = name;
      figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
    }
  });
}
