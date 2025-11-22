// selectAllTextNodes.js

export function selectAllTextNodes() {
  const all = figma.currentPage.findAll((node) => node.type === 'TEXT');
  figma.ui.postMessage({ type: 'select-all-start', total: all.length, processed: 0 });
  const selection = [];
  const batchSize = 200;
  function step(i) {
    const end = Math.min(i + batchSize, all.length);
    for (let k = i; k < end; k++) selection.push(all[k]);
    figma.currentPage.selection = selection;
    figma.ui.postMessage({ type: 'select-all-progress', total: all.length, processed: end });
    if (end < all.length) {
      setTimeout(() => step(end), 0);
    } else {
      figma.ui.postMessage({ type: 'select-all-complete' });
      figma.notify(`Selected ${all.length} text layers`);
    }
  }
  step(0);
}
