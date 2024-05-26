// invertSelection.js
export function invertSelection() {
  const currentPage = figma.currentPage;
  const allNodes: SceneNode[] = [];
  const selectedNodes = new Set(currentPage.selection);

  // Function to traverse and collect all nodes in the current page
  function traverse(node) {
    if ('children' in node) {
      for (const child of node.children) {
        traverse(child);
      }
    } else {
      allNodes.push(node);
    }
  }

  // Traverse the current page starting from the root
  traverse(currentPage);

  // Filter nodes to get the inverted selection
  const invertedSelection = allNodes.filter((node) => !selectedNodes.has(node));

  // Apply the inverted selection
  currentPage.selection = invertedSelection;

  // Notify the user
  figma.notify(`Selection inverted. ${invertedSelection.length} nodes selected.`);
}
