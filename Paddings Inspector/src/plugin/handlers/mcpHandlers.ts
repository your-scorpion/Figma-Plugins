/**
 * MCP Validated Tools Handlers
 */

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

class ValidationError extends Error {
  field: string;
  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.field = field;
    this.name = 'ValidationError';
  }
}

/**
 * Normalize payload by mapping field aliases
 */
function normalizePayload(payload: any, aliases: Record<string, string>): any {
  const normalized: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const canonicalKey = aliases[key] || key;
    normalized[canonicalKey] = value;
  }
  return normalized;
}

/**
 * Validate node ID format
 */
function validateNodeId(id: string): string {
  const normalized = id.replace('-', ':');
  if (!normalized.includes(':')) {
    throw new ValidationError('nodeId', 'Must be in format "123:456"');
  }
  return normalized;
}

/**
 * Validate operation type
 */
function validateOperation(op: string): string {
  const valid = ['read', 'update', 'delete', 'select'];
  if (!valid.includes(op)) {
    throw new ValidationError('operation', `Must be one of: ${valid.join(', ')}`);
  }
  return op;
}

/**
 * Validate component name
 */
function validateComponentName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('name', 'Component name cannot be empty');
  }
  return trimmed;
}

/**
 * Validate selection constraints
 */
function validateSelection(selection: readonly SceneNode[], constraints: any): readonly SceneNode[] {
  const { minItems = 0, maxItems = Infinity, allowedTypes } = constraints;

  if (selection.length < minItems) {
    throw new ValidationError('selection', `Select at least ${minItems} item(s)`);
  }
  if (selection.length > maxItems) {
    throw new ValidationError('selection', `Select at most ${maxItems} item(s)`);
  }
  if (allowedTypes) {
    const invalid = selection.filter((node: any) => !allowedTypes.includes(node.type));
    if (invalid.length > 0) {
      throw new ValidationError('selection', `Invalid node types. Allowed: ${allowedTypes.join(', ')}`);
    }
  }
  return selection;
}

// Field aliases (common LLM variations)
const NODE_ALIASES: Record<string, string> = {
  id: 'nodeId',
  node: 'nodeId',
  node_id: 'nodeId',
  action: 'operation',
  op: 'operation',
  props: 'properties',
  data: 'properties',
};

const COMPONENT_ALIASES: Record<string, string> = {
  componentName: 'name',
  component: 'name',
  comp: 'name',
  variantName: 'variant',
  pageName: 'page',
};

const SELECTION_ALIASES: Record<string, string> = {
  min: 'minItems',
  max: 'maxItems',
  types: 'allowedTypes',
  nodeTypes: 'allowedTypes',
};

// ============================================================================
// HANDLERS
// ============================================================================

/**
 * Handle node operations (read, update, delete, select)
 */
export async function handleMcpNodeOperation(msg: any): Promise<void> {
  try {
    // 1. Normalize field names
    const normalized = normalizePayload(msg.arguments, NODE_ALIASES);

    // 2. Validate
    const nodeId = validateNodeId(normalized.nodeId);
    const operation = validateOperation(normalized.operation || 'read');

    // 3. Execute - use async version for dynamic-page access
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    let resultData: any;

    switch (operation) {
      case 'read':
        resultData = {
          id: node.id,
          name: node.name,
          type: node.type,
          visible: (node as any).visible,
          locked: (node as any).locked,
        };
        break;

      case 'update':
        if (normalized.properties) {
          if ('name' in normalized.properties) (node as any).name = normalized.properties.name;
          if ('visible' in normalized.properties) (node as any).visible = normalized.properties.visible;
          if ('locked' in normalized.properties) (node as any).locked = normalized.properties.locked;
        }
        resultData = { updated: true };
        break;

      case 'delete':
        node.remove();
        resultData = { deleted: true };
        break;

      case 'select':
        figma.currentPage.selection = [node as SceneNode];
        figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
        resultData = { selected: true };
        break;
    }

    figma.ui.postMessage({
      type: 'mcp_result',
      data: { success: true, data: resultData },
    });
  } catch (error: any) {
    figma.ui.postMessage({
      type: 'mcp_result',
      data: { success: false, error: error.message },
    });
  }
}

/**
 * Search for components by name
 */
export async function handleMcpComponentSearch(msg: any): Promise<void> {
  try {
    // 1. Normalize
    const normalized = normalizePayload(msg.arguments, COMPONENT_ALIASES);

    // 2. Validate
    const name = validateComponentName(normalized.name);

    // 3. Load all pages (required for dynamic-page access)
    await figma.loadAllPagesAsync();

    // 4. Execute
    const components = figma.root.findAll((node) => {
      if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
        return false;
      }
      const nameMatch = node.name.toLowerCase().includes(name.toLowerCase());
      if (normalized.page) {
        const pageMatch = node.parent ? node.parent.name === normalized.page : false;
        return nameMatch && pageMatch;
      }
      return nameMatch;
    });

    // 5. Select found components
    if (components.length > 0) {
      const sceneNodes = components.filter((c): c is SceneNode =>
        'parent' in c && c.parent !== null
      );
      if (sceneNodes.length > 0) {
        figma.currentPage.selection = sceneNodes;
        try {
          figma.viewport.scrollAndZoomIntoView(sceneNodes);
        } catch {}
      }
    }

    figma.ui.postMessage({
      type: 'mcp_result',
      data: {
        success: true,
        data: {
          count: components.length,
          components: components.slice(0, 10).map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            page: c.parent ? c.parent.name : null,
          })),
        },
      },
    });
  } catch (error: any) {
    figma.ui.postMessage({
      type: 'mcp_result',
      data: { success: false, error: error.message },
    });
  }
}

/**
 * Validate and get current selection
 */
export function handleMcpGetSelection(msg: any): void {
  try {
    // 1. Normalize
    const normalized = normalizePayload(msg.arguments, SELECTION_ALIASES);

    // 2. Validate selection
    const selection = validateSelection(figma.currentPage.selection, {
      minItems: normalized.minItems,
      maxItems: normalized.maxItems,
      allowedTypes: normalized.allowedTypes,
    });

    // 3. Return data
    figma.ui.postMessage({
      type: 'mcp_result',
      data: {
        success: true,
        data: {
          count: selection.length,
          nodes: selection.map((node) => ({
            id: node.id,
            name: node.name,
            type: node.type,
          })),
        },
      },
    });
  } catch (error: any) {
    figma.ui.postMessage({
      type: 'mcp_result',
      data: { success: false, error: error.message },
    });
  }
}

/**
 * Get current selection node ID
 */
export function handleMcpGetCurrentSelection(): void {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    figma.ui.postMessage({
      type: 'mcp_current_selection',
      data: { nodeId: selection[0].id },
    });
  } else {
    figma.ui.postMessage({
      type: 'mcp_current_selection',
      data: null,
    });
  }
}
