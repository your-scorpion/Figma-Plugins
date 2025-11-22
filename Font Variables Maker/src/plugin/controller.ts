import { selectAllTextNodes } from '../app/components/selectAllTextNodes';
import { selectTextNodesWithoutVariables } from '../app/components/selectTextNodesWithoutVariables';
import { selectAllNodesExceptTextNodes } from '../app/components/selectTextNodesWithoutFontVariables';
import { loadFonts } from '../app/components/loadFonts';
import { selectTextNodesWithSameFont } from '../app/components/selectBasedonSelected';
import { deselect2 } from '../app/components/deselect';
import { invertSelection } from '../app/components/invertSelection';

figma.showUI(__html__, { width: 440, height: 570 });

const updateSelectedTextNodesCount = () => {
  const selectedNodes = figma.currentPage.selection;
  const countTextNodes = (nodes: readonly SceneNode[]): number => {
    let count = 0;
    for (const n of nodes) {
      if (n.type === 'TEXT') count++;
      if ('children' in n) count += countTextNodes((n as any).children as readonly SceneNode[]);
    }
    return count;
  };
  const selectedTextNodesCount = countTextNodes(selectedNodes);
  figma.ui.postMessage({ type: 'selected-text-nodes-count', selectedTextNodesCount });
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

  if (msg.type === 'replace-texts-by-size') {
    const selectedNodes = figma.currentPage.selection;
    const collectTextNodes = (nodes: readonly SceneNode[]): TextNode[] => {
      const acc: TextNode[] = [];
      for (const n of nodes) {
        if (n.type === 'TEXT') acc.push(n as TextNode);
        if ('children' in n) acc.push(...collectTextNodes((n as any).children as readonly SceneNode[]));
      }
      return acc;
    };
    const textNodes = collectTextNodes(selectedNodes);
    figma.ui.postMessage({ type: 'replace-start', total: textNodes.length, processed: 0 });
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const collectionModeMap = new Map<string, string>();
    for (const c of collections) {
      const full = await figma.variables.getVariableCollectionByIdAsync(c.id);
      if (full) {
        for (const vid of full.variableIds) {
          collectionModeMap.set(vid, full.modes[0].modeId);
        }
      }
    }
    const allVars = [] as Variable[];
    for (const c of collections) {
      const full = await figma.variables.getVariableCollectionByIdAsync(c.id);
      if (full) {
        for (const vid of full.variableIds) {
          const v = await figma.variables.getVariableByIdAsync(vid);
          if (v) allVars.push(v);
        }
      }
    }
    const numberVars = allVars.filter((v) => v.resolvedType === 'FLOAT');
    const stringVars = allVars.filter((v) => v.resolvedType === 'STRING');
    const targetFamily = (msg && (msg as any).targetFamily) ? (msg as any).targetFamily : 'Manrope';
    const getVarValue = (v: Variable) => {
      const modeId = collectionModeMap.get(v.id);
      return modeId ? (v as any).valuesByMode[modeId] : undefined;
    };
    const findSizeVar = (size: number) => {
      let best: Variable | null = null;
      let bestDelta = Number.POSITIVE_INFINITY;
      for (const v of numberVars) {
        const val = getVarValue(v);
        if (typeof val === 'number') {
          const d = Math.abs(val - size);
          if (d < bestDelta) {
            bestDelta = d;
            best = v;
          }
        }
      }
      return bestDelta <= 0.5 ? best : null;
    };
    const findFamilyVar = (family: string) => {
      for (const v of stringVars) {
        const val = getVarValue(v);
        if (typeof val === 'string' && val.toLowerCase().includes(family.toLowerCase())) return v;
      }
      for (const v of stringVars) {
        const val = getVarValue(v);
        if (typeof val === 'string' && val.toLowerCase().includes(targetFamily.toLowerCase())) return v;
      }
      return null;
    };
    let processed = 0;
    for (const t of textNodes) {
      const fontSize = (t as any).fontSize as number | typeof figma.mixed;
      if (fontSize !== figma.mixed && typeof fontSize === 'number') {
        const sizeVar = findSizeVar(fontSize);
        if (sizeVar) {
          try {
            t.setBoundVariable('fontSize', sizeVar);
          } catch {}
        }
      }
      let familyName = '';
      const fontName = t.fontName as FontName | typeof figma.mixed;
      if (fontName !== figma.mixed && typeof fontName !== 'string') {
        familyName = fontName.family;
      }
      const famVar = familyName ? findFamilyVar(familyName) : findFamilyVar(targetFamily);
      if (famVar) {
        try {
          t.setBoundVariable('fontFamily', famVar);
          continue;
        } catch {}
      }
      try {
        await figma.loadFontAsync({ family: targetFamily, style: 'Regular' });
        (t as any).fontName = { family: targetFamily, style: 'Regular' } as FontName;
      } catch {}
      processed++;
      figma.ui.postMessage({ type: 'replace-progress', total: textNodes.length, processed });
    }
    figma.ui.postMessage({ type: 'replace-complete' });
    figma.notify(`Replaced by variables using font size. Fallback to ${targetFamily}.`);
    return;
  }

  if (msg.type === 'replace-unavailable-fonts') {
    const selectedNodes = figma.currentPage.selection;
    const collectTextNodes = (nodes: readonly SceneNode[]): TextNode[] => {
      const acc: TextNode[] = [];
      for (const n of nodes) {
        if (n.type === 'TEXT') acc.push(n as TextNode);
        if ('children' in n) acc.push(...collectTextNodes((n as any).children as readonly SceneNode[]));
      }
      return acc;
    };
    const textNodes = collectTextNodes(selectedNodes);
    const fallbackFamily = (msg && (msg as any).fallbackFamily) ? (msg as any).fallbackFamily : 'Manrope';
    figma.ui.postMessage({ type: 'unavailable-start', total: textNodes.length, processed: 0 });
    let processed = 0;
    for (const t of textNodes) {
      let needsReplace = false;
      const fn = t.fontName as FontName | typeof figma.mixed;
      if (fn === figma.mixed) {
        needsReplace = true;
      } else {
        try {
          await figma.loadFontAsync(fn as FontName);
        } catch {
          needsReplace = true;
        }
      }
      if (needsReplace) {
        try {
          await figma.loadFontAsync({ family: fallbackFamily, style: 'Regular' });
          (t as any).fontName = { family: fallbackFamily, style: 'Regular' } as FontName;
        } catch {}
      }
      processed++;
      figma.ui.postMessage({ type: 'unavailable-progress', total: textNodes.length, processed });
    }
    figma.ui.postMessage({ type: 'unavailable-complete' });
    figma.notify(`Unavailable fonts replaced with ${fallbackFamily}.`);
    return;
  }

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
