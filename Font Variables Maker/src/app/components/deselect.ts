// selectTextNodesWithSameFont.js
export function deselect2() {
  const currentPage = figma.currentPage;
  currentPage.selection = [];
  figma.notify('All nodes have been deselected.');
}