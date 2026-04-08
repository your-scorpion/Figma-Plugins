// Helper: check if a node is Auto Layout
export function isAutoLayoutNode(
  node: BaseNode & { layoutMode?: string }
): node is FrameNode | ComponentNode | InstanceNode {
  return (
    (node.type === 'FRAME' ||
      node.type === 'COMPONENT' ||
      node.type === 'INSTANCE') &&
    (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL')
  );
}

// Recursively extract padding info from Auto Layout nodes
export function extractAutoLayoutInfo(
  node: FrameNode | ComponentNode | InstanceNode | SectionNode
): any {
  const isAuto = isAutoLayoutNode(node);

  const children = node.children
    .filter(
      (child): child is FrameNode | ComponentNode | InstanceNode | SectionNode =>
        (child.type === 'FRAME' ||
          child.type === 'COMPONENT' ||
          child.type === 'INSTANCE' ||
          child.type === 'SECTION') &&
        (child.type === 'SECTION' || isAutoLayoutNode(child))
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
export function getAllPaddingData() {
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
