import { getAllPaddingData } from './utils/autolayout';
import { sendNumberVariablesToUI } from './utils/variables';
import { createPaddingVariables, handleUpdatePadding, handleUpdateItemSpacing, handleApplyRandomPaddings, handleBulkApplyDepthSpacing } from './handlers/paddingHandlers';
import { handleArrangeFrames, handleGroupSelectedFrames, handlePairSelectedFrames, handleFindDuplicateTopLevelFrames } from './handlers/frameHandlers';
import { handleSelectAllAutoLayout, handleSelectNextAutoLayout, handleZoomToNode, handleRenameNode } from './handlers/selectionHandlers';
import { handleConvertColorsToVariables, handleCreateColorCollectionFromSelection, handleCreateAllColorVariables, handleAliasLocalToImportedByName } from './handlers/colorHandlers';
import { handleMcpNodeOperation, handleMcpComponentSearch, handleMcpGetSelection, handleMcpGetCurrentSelection } from './handlers/mcpHandlers';

figma.showUI(__html__, { width: 400, height: 660 });

async function loadAllFontsForText(text: TextNode): Promise<void> {
  try {
    const mixed = (figma as any).mixed;
    const chars = text.characters || '';
    if ((text as any).fontName !== mixed) {
      await figma.loadFontAsync((text as any).fontName as FontName);
      return;
    }
    const seen = new Set<string>();
    for (let i = 0; i < chars.length; i++) {
      try {
        const fn = (text as any).getRangeFontName(i, i + 1) as FontName | typeof mixed;
        if (fn && fn !== mixed) {
          const key = `${fn.family}__${fn.style}`;
          if (!seen.has(key)) {
            seen.add(key);
            await figma.loadFontAsync({ family: fn.family, style: fn.style });
          }
        }
      } catch {}
    }
  } catch (e) {
    console.warn('Failed to load fonts for text node', (text as any).id, e);
  }
}

async function recomputeTextLayoutOnPage(): Promise<number> {
  const texts = figma.currentPage.findAll((n) => n.type === 'TEXT') as TextNode[];
  figma.ui.postMessage({ type: 'text-recompute-start', total: texts.length });
  let updated = 0;
  for (let i = 0; i < texts.length; i++) {
    const t = texts[i];
    try {
      await loadAllFontsForText(t);
      const current = t.characters;
      t.characters = current;
      try {
        (t as any).textAutoResize = (t as any).textAutoResize;
      } catch {}
      updated++;
      figma.ui.postMessage({ type: 'text-recompute-progress', done: updated, total: texts.length });
    } catch (e) {
      console.warn('Failed to recompute text layout for', (t as any).id, e);
    }
  }
  figma.ui.postMessage({ type: 'text-recompute-end', done: updated, total: texts.length });
  return updated;
}

async function findOrphanedInstancesOnPage(): Promise<{ checked: number; total: number; found: number }> {
  const instances = figma.currentPage.findAll((n) => n.type === 'INSTANCE') as InstanceNode[];
  const total = instances.length;
  const orphans: InstanceNode[] = [];
  let checked = 0;

  figma.ui.postMessage({ type: 'orphan-scan-start', total });

  for (const instance of instances) {
    try {
      if (!instance.mainComponent) {
        orphans.push(instance);
      }
    } catch {
      orphans.push(instance);
    }

    checked += 1;

    if (checked === total || checked % 25 === 0) {
      figma.ui.postMessage({
        type: 'orphan-scan-progress',
        checked,
        total,
        found: orphans.length,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  figma.ui.postMessage({
    type: 'orphan-scan-end',
    checked,
    total,
    found: orphans.length,
  });

  if (orphans.length > 0) {
    figma.currentPage.selection = orphans;
    try {
      figma.viewport.scrollAndZoomIntoView(orphans);
    } catch {}
  }

  return { checked, total, found: orphans.length };
}

// Initial push of variables and padding data
(async () => {
  await sendNumberVariablesToUI();
  figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
  const frames = figma.currentPage.selection.filter((n) => n.type === 'FRAME') as FrameNode[];
  figma.ui.postMessage({ type: 'selection-frames', count: frames.length, hasFrames: frames.length > 0 });
})();

// Update padding data on selection change
figma.on('selectionchange', () => {
  figma.ui.postMessage({ type: 'padding-data', data: getAllPaddingData() });
  const frames = figma.currentPage.selection.filter((n) => n.type === 'FRAME') as FrameNode[];
  figma.ui.postMessage({ type: 'selection-frames', count: frames.length, hasFrames: frames.length > 0 });

  // Send selected node ID for MCP tools
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    figma.ui.postMessage({
      type: 'mcp_selection_changed',
      data: { nodeId: selection[0].id }
    });
  } else {
    figma.ui.postMessage({
      type: 'mcp_selection_changed',
      data: null
    });
  }
});

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'arrange-frames') {
    handleArrangeFrames(msg);
    return;
  }

  if (msg.type === 'group-selected-frames') {
    handleGroupSelectedFrames(msg);
    return;
  }

  if (msg.type === 'pair-selected-frames') {
    handlePairSelectedFrames(msg);
    return;
  }

  if (msg.type === 'create-padding-variables') {
    await createPaddingVariables((msg as any).namePrefix);
    return;
  }

  if (msg.type === 'select-all-autolayout') {
    handleSelectAllAutoLayout();
    return;
  }

  if (msg.type === 'find-duplicate-top-level-frames') {
    handleFindDuplicateTopLevelFrames();
    return;
  }

  if (msg.type === 'select-next-autolayout') {
    handleSelectNextAutoLayout(msg);
    return;
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'zoom-to-node') {
    await handleZoomToNode(msg);
    return;
  }

  if (msg.type === 'update-padding') {
    handleUpdatePadding(msg);
    return;
  }

  if (msg.type === 'update-item-spacing') {
    handleUpdateItemSpacing(msg);
    return;
  }

  if (msg.type === 'rename-node') {
    handleRenameNode(msg);
    return;
  }

  if (msg.type === 'bulk-apply-depth-spacing') {
    handleBulkApplyDepthSpacing();
    return;
  }

  if (msg.type === 'apply-random-paddings') {
    handleApplyRandomPaddings(msg);
    return;
  }

  if (msg.type === 'convert-colors-to-variables') {
    try {
      await handleConvertColorsToVariables();
    } catch (e) {
      console.error('Error converting colors to variables:', e);
      figma.notify('Error converting colors to variables');
    }
    return;
  }

  if (msg.type === 'create-color-collection-from-selection') {
    try {
      await handleCreateColorCollectionFromSelection();
    } catch (e) {
      console.error('Error creating color collection from selection:', e);
      figma.notify('Error creating color collection from selection');
    }
    return;
  }

  if (msg.type === 'create-all-color-variables-in-collection') {
    try {
      await handleCreateAllColorVariables();
    } catch (e) {
      console.error('Error creating variables for all colors in selection:', e);
      figma.notify('Error creating variables for all colors in selection');
    }
    return;
  }

  if (msg.type === 'alias-local-to-imported-by-name') {
    try {
      await handleAliasLocalToImportedByName();
    } catch (e) {
      console.error('Error aliasing variables:', e);
      figma.notify('Error aliasing variables');
    }
    return;
  }

  if (msg.type === 'find-orphaned-instances') {
    try {
      const result = await findOrphanedInstancesOnPage();
      if (result.found > 0) {
        figma.notify(
          `Checked ${result.checked} instances and found ${result.found} orphaned instances on this page`
        );
      } else {
        figma.notify(`Checked ${result.checked} instances. No orphaned instances found on this page`);
      }
    } catch (e) {
      console.error('Error finding orphaned instances:', e);
      figma.ui.postMessage({ type: 'orphan-scan-end', checked: 0, total: 0, found: 0 });
      figma.notify('Error finding orphaned instances');
    }
    return;
  }
  if (msg.type === 'recompute-text-layout') {
    try {
      const count = await recomputeTextLayoutOnPage();
      figma.notify(`Recomputed text layout for ${count} text layers`);
    } catch (e) {
      console.error('Error recomputing text layout:', e);
      figma.notify('Error recomputing text layout');
    }
    return;
  }

  // MCP Tools handlers
  if (msg.type === 'mcp_node_operation') {
    await handleMcpNodeOperation(msg);
    return;
  }

  if (msg.type === 'mcp_component_search') {
    await handleMcpComponentSearch(msg);
    return;
  }

  if (msg.type === 'mcp_get_selection') {
    handleMcpGetSelection(msg);
    return;
  }

  if (msg.type === 'mcp_get_current_selection') {
    handleMcpGetCurrentSelection();
    return;
  }
};
