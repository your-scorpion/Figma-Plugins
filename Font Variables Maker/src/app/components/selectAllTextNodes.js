// selectAllTextNodes.js

export function selectAllTextNodes() {
  let textNodes = figma.currentPage.findAll(node => node.type === 'TEXT');
  figma.currentPage.selection = textNodes;
}
