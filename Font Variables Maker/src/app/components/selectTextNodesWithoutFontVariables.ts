// selectAllNodesExceptTextNodes.ts
export function selectAllNodesExceptTextNodes() {
  const currentPage = figma.currentPage;
  const nonTextNodes: SceneNode[] = [];

  currentPage.children.forEach(node => {
    if (node.type !== 'TEXT') {
      nonTextNodes.push(node);
    }
  });

  if (nonTextNodes.length > 0) {
    currentPage.selection = nonTextNodes;
  } else {
    figma.notify('No non-text nodes found.');
  }
}
