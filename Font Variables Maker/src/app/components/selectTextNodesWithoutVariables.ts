// selectTextNodesWithoutVariables.ts
export function selectTextNodesWithoutVariables() {
  const currentPage = figma.currentPage;
  const selectedNodes: SceneNode[] = [];

  currentPage.children.forEach(node => {
    if (node.type === 'TEXT' && Object.keys((node as TextNode).boundVariables).length === 0) {
      selectedNodes.push(node);
    }
  });

  if (selectedNodes.length > 0) {
    currentPage.selection = selectedNodes;
  } else {
    figma.notify('No text nodes without applied variables found.');
  }
}
