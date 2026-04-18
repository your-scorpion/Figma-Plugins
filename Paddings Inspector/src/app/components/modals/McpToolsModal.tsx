import React, { useState } from 'react';

type McpToolsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const McpToolsModal: React.FC<McpToolsModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'node' | 'component' | 'selection' | null>('node');
  const [nodeId, setNodeId] = useState('');
  const [nodeOperation, setNodeOperation] = useState<'read' | 'select' | 'update' | 'delete'>('read');
  const [nodeProps, setNodeProps] = useState('');
  const [componentName, setComponentName] = useState('');
  const [componentVariant, setComponentVariant] = useState('');
  const [selectionMin, setSelectionMin] = useState('');
  const [result, setResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);

  const executeNodeOp = () => {
    const args: any = {
      id: nodeId,
      action: nodeOperation,
    };

    if (nodeOperation === 'update' && nodeProps) {
      try {
        args.properties = JSON.parse(nodeProps);
      } catch (e) {
        setResult({ success: false, error: 'Invalid JSON in properties' });
        return;
      }
    }

    parent.postMessage({ pluginMessage: { type: 'mcp_node_operation', arguments: args } }, '*');
  };

  const executeComponentSearch = () => {
    if (!componentName) {
      setResult({ success: false, error: 'Please enter a component name' });
      return;
    }

    const args: any = { comp: componentName };
    if (componentVariant) args.variantName = componentVariant;

    parent.postMessage({ pluginMessage: { type: 'mcp_component_search', arguments: args } }, '*');
  };

  const executeGetSelection = () => {
    const args: any = {};
    if (selectionMin) args.min = parseInt(selectionMin);

    parent.postMessage({ pluginMessage: { type: 'mcp_get_selection', arguments: args } }, '*');
  };

  const loadNodeExample = (op: 'read' | 'select') => {
    setNodeOperation(op);
    parent.postMessage({ pluginMessage: { type: 'mcp_get_current_selection' } }, '*');
  };

  // Listen for results
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;

      if (msg.type === 'mcp_result') {
        setResult(msg.data);
      } else if (msg.type === 'mcp_current_selection') {
        if (msg.data && msg.data.nodeId) {
          setNodeId(msg.data.nodeId);
          setTimeout(() => executeNodeOp(), 100);
        } else {
          setResult({ success: false, error: 'Please select a node in Figma first' });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [nodeId, nodeOperation, nodeProps]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#2a2a2a',
          borderRadius: 12,
          padding: 20,
          maxWidth: 500,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid #444',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>🚀 MCP Validated Tools</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#999',
              fontSize: 24,
              cursor: 'pointer',
              padding: 0,
              width: 30,
              height: 30,
            }}
          >
            ×
          </button>
        </div>

        {/* Node Operations */}
        <div style={{ marginBottom: 16, padding: 12, background: '#1e1e1e', borderRadius: 8 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}
            onClick={() => setActiveSection(activeSection === 'node' ? null : 'node')}
          >
            <span style={{ fontSize: 16 }}>🎯</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', flex: 1, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Node Operations</span>
            <span style={{ fontSize: 12, color: '#999' }}>{activeSection === 'node' ? '▼' : '▶'}</span>
          </div>

          {activeSection === 'node' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                  Node ID <span style={{ background: '#0066ff', color: '#fff', padding: '3px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>Required</span>
                </label>
                <input
                  type="text"
                  value={nodeId}
                  onChange={(e) => setNodeId(e.target.value)}
                  placeholder="123:456 or 123-456"
                  style={{
                    width: '100%',
                    padding: 10,
                    fontSize: 13,
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: 4,
                    color: '#fff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Operation</label>
                <select
                  value={nodeOperation}
                  onChange={(e) => setNodeOperation(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: 10,
                    fontSize: 13,
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: 4,
                    color: '#fff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  <option value="read">Read (get info)</option>
                  <option value="select">Select (focus node)</option>
                  <option value="update">Update (modify)</option>
                  <option value="delete">Delete (remove)</option>
                </select>
              </div>

              {nodeOperation === 'update' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Properties (JSON)</label>
                  <textarea
                    value={nodeProps}
                    onChange={(e) => setNodeProps(e.target.value)}
                    placeholder='{"name": "New Name", "visible": true}'
                    style={{
                      width: '100%',
                      padding: 10,
                      fontSize: 13,
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: 4,
                      color: '#fff',
                      minHeight: 60,
                      resize: 'vertical',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                    }}
                  />
                </div>
              )}

              <button
                onClick={executeNodeOp}
                style={{
                  padding: '10px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  background: '#0066ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                Execute
              </button>

              <div style={{ fontSize: 12, color: '#aaa', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                <strong>Examples (click to try):</strong>
                <div
                  onClick={() => loadNodeExample('read')}
                  style={{
                    padding: 6,
                    background: '#333',
                    borderRadius: 3,
                    marginTop: 4,
                    cursor: 'pointer',
                    border: '1px solid transparent',
                  }}
                >
                  ✓ Read node info
                </div>
                <div
                  onClick={() => loadNodeExample('select')}
                  style={{
                    padding: 6,
                    background: '#333',
                    borderRadius: 3,
                    marginTop: 4,
                    cursor: 'pointer',
                    border: '1px solid transparent',
                  }}
                >
                  ✓ Select and focus node
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Component Search */}
        <div style={{ marginBottom: 16, padding: 12, background: '#1e1e1e', borderRadius: 8 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}
            onClick={() => setActiveSection(activeSection === 'component' ? null : 'component')}
          >
            <span style={{ fontSize: 16 }}>🔍</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', flex: 1, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Component Search</span>
            <span style={{ fontSize: 12, color: '#999' }}>{activeSection === 'component' ? '▼' : '▶'}</span>
          </div>

          {activeSection === 'component' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                  Component Name <span style={{ background: '#0066ff', color: '#fff', padding: '3px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>Required</span>
                </label>
                <input
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="Button"
                  style={{
                    width: '100%',
                    padding: 10,
                    fontSize: 13,
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: 4,
                    color: '#fff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Variant (optional)</label>
                <input
                  type="text"
                  value={componentVariant}
                  onChange={(e) => setComponentVariant(e.target.value)}
                  placeholder="Primary"
                  style={{
                    width: '100%',
                    padding: 10,
                    fontSize: 13,
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: 4,
                    color: '#fff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  }}
                />
              </div>

              <button
                onClick={executeComponentSearch}
                style={{
                  padding: '10px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  background: '#0066ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                Search
              </button>
            </div>
          )}
        </div>

        {/* Selection Validator */}
        <div style={{ marginBottom: 16, padding: 12, background: '#1e1e1e', borderRadius: 8 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}
            onClick={() => setActiveSection(activeSection === 'selection' ? null : 'selection')}
          >
            <span style={{ fontSize: 16 }}>✅</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', flex: 1, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Selection Validator</span>
            <span style={{ fontSize: 12, color: '#999' }}>{activeSection === 'selection' ? '▼' : '▶'}</span>
          </div>

          {activeSection === 'selection' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Min Items</label>
                <input
                  type="number"
                  value={selectionMin}
                  onChange={(e) => setSelectionMin(e.target.value)}
                  placeholder="1"
                  min="0"
                  style={{
                    width: '100%',
                    padding: 10,
                    fontSize: 13,
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: 4,
                    color: '#fff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  }}
                />
              </div>

              <button
                onClick={executeGetSelection}
                style={{
                  padding: '10px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  background: '#0066ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                Validate Selection
              </button>
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div
            style={{
              padding: 12,
              borderRadius: 4,
              fontSize: 13,
              background: result.success ? 'rgba(0, 200, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
              border: result.success ? '1px solid rgba(0, 200, 0, 0.3)' : '1px solid rgba(255, 0, 0, 0.3)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#fff' }}>
              {result.success ? '✅ Success' : '❌ Error'}
            </div>
            <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#fff' }}>
              {result.success ? JSON.stringify(result.data, null, 2) : result.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
