figma.showUI(__html__, { width: 340, height: 460 });
console.clear();

figma.ui.onmessage = async () => {
  figma.closePlugin();
};
