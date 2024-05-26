import { selectAllTextNodes } from '../app/components/selectAllTextNodes';
import { selectTextNodesWithoutVariables } from '../app/components/selectTextNodesWithoutVariables';
import { selectAllNodesExceptTextNodes } from '../app/components/selectTextNodesWithoutFontVariables';
import { loadFonts } from '../app/components/loadFonts';
import { selectTextNodesWithSameFont } from '../app/components/selectBasedonSelected';
import { deselect2 } from '../app/components/deselect';
import { invertSelection } from '../app/components/invertSelection';

figma.showUI(__html__, { width: 440, height: 510 });

const updateSelectedTextNodesCount = () => {
  const selectedNodes = figma.currentPage.selection;
  const selectedTextNodesCount = selectedNodes.filter((node) => node.type === 'TEXT').length;

  figma.ui.postMessage({
    type: 'selected-text-nodes-count',
    selectedTextNodesCount,
  });
};

// Initial update of the count when the plugin is first run
updateSelectedTextNodesCount();

// Listen for selection change events and update the count
figma.on('selectionchange', updateSelectedTextNodesCount);

figma.ui.onmessage = async (msg) => {
  if (msg.selectAlltexts === true) {
    selectAllTextNodes();
    return; // Stop execution if selectAllTextNodes is called
  }

  if (msg.type === 'select-text-nodes-without-variables') {
    selectTextNodesWithoutVariables();
    return;
    console.clear();
  }

  if (msg.type === 'select-text-nodes-without-variables2') {
    selectAllNodesExceptTextNodes();
    return;
    console.clear();
  }

  if (msg.type === 'select-text-nodes-without-variables3') {
    selectTextNodesWithSameFont();
    return;
  }

  if (msg.type === 'select-text-nodes-without-variables4') {
    deselect2();
    return;
  }

  if (msg.type === 'select-text-nodes-without-variables5') {
    invertSelection();
    return;
    console.clear();
  }
  console.clear();

  if (msg.type === 'create-rectangles') {
    const selectedNodes = figma.currentPage.selection;

    // Send the count of selected text nodes to the UI
    figma.ui.postMessage({
      type: 'selected-text-nodes-count',
      selectedTextNodesCount: selectedNodes.filter((node) => node.type === 'TEXT').length,
    });

    if (selectedNodes.length === 0) {
      figma.ui.postMessage({
        type: 'update-text-styles',
        message: 'No text nodes selected',
      });
      figma.closePlugin();
      return;
    }

    // Collect all font names from the selected text nodes
    const fontNamesSet = new Set<string>();

    selectedNodes.forEach((node) => {
      if (node.type === 'TEXT') {
        const textNode = node as TextNode;
        const fontName = textNode.fontName;

        if (Array.isArray(fontName)) {
          console.log('TextNode has mixed fonts:', fontName);
          fontName.forEach((fn) => fontNamesSet.add(`${fn.family}-${fn.style}`));
        } else if (fontName !== figma.mixed) {
          fontNamesSet.add(`${fontName.family}`);
        } else {
          console.log('TextNode has mixed fonts.');
        }
      } else {
        console.log('Selected node is not a TextNode.');
      }
    });

    // Convert the set to an array
    let allCollectedFonts = Array.from(fontNamesSet);

    // If no fonts are found in selected nodes, load fonts
    if (allCollectedFonts.length === 0) {
      allCollectedFonts = await loadFonts();
    }
    console.log(allCollectedFonts);

    // Create a single variable collection
    const collection = figma.variables.createVariableCollection('Generated Font Collection');
    const modeId = collection.modes[0].modeId;

    // Create font family variables using allCollectedFonts
    const fontFamilyVars = [];
    for (let i = 0; i < allCollectedFonts.length; i++) {
      // Limit the number of created variables to msg.count
      if (i >= msg.count) break;

      const fontName = allCollectedFonts[i];
      const fontFamilyVar = figma.variables.createVariable(fontName, collection, 'STRING');
      fontFamilyVar.setValueForMode(modeId, fontName);
      fontFamilyVars.push(fontFamilyVar);
    }

    // Remove excess variables randomly if there are more than msg.count
    while (fontFamilyVars.length > msg.count) {
      const randomIndexToRemove = Math.floor(Math.random() * fontFamilyVars.length);
      const removedVar = fontFamilyVars.splice(randomIndexToRemove, 1)[0];
      removedVar.remove();
    }

    // Function to check if a text node already has bound variables
    const hasBoundVariables = (node: TextNode) => {
      return Object.keys(node.boundVariables).length > 0;
    };

    // Assign these variables randomly to the selected text nodes
    for (let i = 0; i < selectedNodes.length; i++) {
      const node = selectedNodes[i];

      if (node.type !== 'TEXT') continue;
      console.clear();
      // Cast node to TextNode
      const textNode = node as TextNode;

      // Determine if the checkbox is unchecked and if the node has bound variables
      const shouldSkipAssignment = msg.isChecked === false && hasBoundVariables(textNode);

      if (!shouldSkipAssignment) {
        const randomIndex = Math.floor(Math.random() * fontFamilyVars.length);
        const randomFontFamilyVar = fontFamilyVars[randomIndex];
        textNode.setBoundVariable('fontFamily', randomFontFamilyVar);
      }
    }

    // Respond back to the UI
    figma.ui.postMessage({
      type: 'update-text-styles',
      message: `Updated styles for ${selectedNodes.length} text nodes`,
    });

    figma.closePlugin();
  }
};
