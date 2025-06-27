figma.showUI(__html__, { width: 400, height: 600 });

// Helper: check if a node is Auto Layout
function isAutoLayoutNode(
  node: BaseNode & { layoutMode?: string }
): node is FrameNode | ComponentNode | InstanceNode {
  // exclude SectionNode here because it doesn't have those properties
  return (
    (node.type === 'FRAME' ||
      node.type === 'COMPONENT' ||
      node.type === 'INSTANCE') && // no SECTION here
    (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL')
  );
}


// Recursively extract padding info from Auto Layout nodes
function extractAutoLayoutInfo(
  node: FrameNode | ComponentNode | InstanceNode | SectionNode
): any {
  const isAuto = isAutoLayoutNode(node); // now excludes SectionNode with layoutMode

  const children = node.children
    .filter(
      (child): child is FrameNode | ComponentNode | InstanceNode | SectionNode =>
        (child.type === 'FRAME' ||
          child.type === 'COMPONENT' ||
          child.type === 'INSTANCE' ||
          child.type === 'SECTION') &&
        (child.type === 'SECTION' || isAutoLayoutNode(child)) // allow SECTION children but don't assume layout props
    )
    .map((node) => {
  try {
    return extractAutoLayoutInfo(node);
  } catch (e) {
    console.warn('Failed to extract node:', node.id, e);
    return null;
  }
})

    .filter(Boolean);

  if (!isAuto && children.length === 0) return null;

  return {
    id: node.id,
    name: node.name,
    isAutoLayout: isAuto,
    layoutMode: isAuto ? node.layoutMode : undefined,
    ...(isAuto && {
      padding: {
        top: node.paddingTop,
        bottom: node.paddingBottom,
        left: node.paddingLeft,
        right: node.paddingRight,
      },
      itemSpacing: node.itemSpacing,
    }),
    children,
  };
}


// Get all Auto Layout padding data from selection
function getAllPaddingData() {
  const selection = figma.currentPage.selection;
  return selection
    .filter(
      (node): node is FrameNode | ComponentNode | InstanceNode | SectionNode =>
        (node.type === 'FRAME' ||
          node.type === 'COMPONENT' ||
          node.type === 'INSTANCE' ||
          node.type === 'SECTION') &&
        isAutoLayoutNode(node)
    )
    .map(extractAutoLayoutInfo)
    .filter(Boolean);
}

// Send number variable list to UI
function sendNumberVariablesToUI() {
  const collections = figma.variables.getLocalVariableCollections();
  const allVariables: Variable[] = [];

  for (const collection of collections) {
    const fullCollection = figma.variables.getVariableCollectionById(collection.id);
    if (fullCollection) {
      for (const varId of fullCollection.variableIds) {
        const variable = figma.variables.getVariableById(varId);
        if (variable) {
          allVariables.push(variable);
        } 
      }
    }
  }

  const numberVars = allVariables.filter((v) => v.resolvedType === 'FLOAT');


const sanitizedVariables = Array.isArray(numberVars)
  ? numberVars.map((v) => ({
      id: v.id,
      name: v.name,
      key: v.key,
    }))
  : [];

figma.ui.postMessage({
  type: 'number-variables',
  data: sanitizedVariables,
});
}

// Initial push of variables and padding data
(async () => {
  await sendNumberVariablesToUI();
  figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
})();

// Update padding data on selection change
figma.on('selectionchange', () => {
  figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
});

// Handle messages from UI
figma.ui.onmessage = async (msg) => {

   if (msg.type === 'select-all-autolayout') {
    const autoLayoutNodes = figma.root.findAll(
      (node) =>
        node.type === 'FRAME' &&
        (node as FrameNode).layoutMode !== 'NONE'
    ) as FrameNode[];

    if (autoLayoutNodes.length > 0) {
      figma.currentPage.selection = autoLayoutNodes;
      figma.viewport.scrollAndZoomIntoView(autoLayoutNodes);
    } else {
      figma.notify('No Auto Layout frames found on this page.');
    }
  }

  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }

  if (msg.type === 'zoom-to-node') {
    const node = await figma.getNodeByIdAsync(msg.nodeId);
    if (node && 'parent' in node) {
      figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
      figma.currentPage.selection = [node as SceneNode];
    }
  }

if (msg.type === 'update-padding') {
  const { id, side, value, variableId } = msg;

  figma.getNodeByIdAsync(id).then((node) => {
    if (
      !node ||
      !(
        node.type === 'FRAME' ||
        node.type === 'COMPONENT' ||
        node.type === 'INSTANCE'
      ) || // no SECTION
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
    } catch (e) {
      console.error(`Failed to update padding for ${id}`, e);
    }
  });
}


  if (msg.type === 'update-item-spacing') {
    const { id, value, variableId } = msg;
    const node = figma.getNodeById(id);
    if (
      !node ||
      !(
        node.type === 'FRAME' ||
        node.type === 'COMPONENT' ||
        node.type === 'INSTANCE' ||
        node.type === 'SECTION'
      ) ||
      !isAutoLayoutNode(node)
    )
      return;

    try {
      if (variableId) {
        (node as any).setBoundVariable('itemSpacing', variableId);
      } else if (typeof value === 'number') {
        (node as any).itemSpacing = value;
      }
    } catch (e) {
      console.error(`Failed to update itemSpacing for ${id}`, e);
    }
  }
};
