// selectTextNodesWithSameFont.js
export function selectTextNodesWithSameFont() {
  const currentPage = figma.currentPage;
  const selectedNodes: SceneNode[] = [];

  currentPage.children.forEach(node => {
    if (node.type === 'FRAME') {
      // Traverse the children of the frame
      node.children.forEach(child => {
        if (child.type === 'TEXT' && Object.keys((child as TextNode).boundVariables).length === 0) {
          selectedNodes.push(child);
        }
      });
    }
  });

  if (selectedNodes.length > 0) {
    currentPage.selection = selectedNodes;
  } else {
    figma.notify('No text nodes without applied variables found inside frames.');
  }
}
