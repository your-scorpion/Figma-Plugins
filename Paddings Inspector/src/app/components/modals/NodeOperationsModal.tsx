import React, { useState, useEffect } from 'react';

type NodeOperationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NodeOperationsModal: React.FC<NodeOperationsModalProps> = ({ isOpen, onClose }) => {
  const [nodeId, setNodeId] = useState('');
  const [nodeOperation, setNodeOperation] = useState<'read' | 'select' | 'update' | 'delete'>('read');
  const [nodeProps, setNodeProps] = useState('');
  const [result, setResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set default template when switching to update operation
  useEffect(() => {
    if (nodeOperation === 'update' && !nodeProps) {
      setNodeProps(`{
  "name": "New Name",
  "visible": true,
  "locked": false
}`);
    }
  }, [nodeOperation]);

  // Auto-fill node ID when modal opens
  useEffect(() => {
    if (isOpen) {
      parent.postMessage({ pluginMessage: { type: 'mcp_get_current_selection' } }, '*');
    }
  }, [isOpen]);

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

    setIsLoading(true);
    setResult(null);
    parent.postMessage({ pluginMessage: { type: 'mcp_node_operation', arguments: args } }, '*');
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;

      if (msg.type === 'mcp_result') {
        setIsLoading(false);
        setResult(msg.data);
      } else if (msg.type === 'mcp_current_selection') {
        if (msg.data && msg.data.nodeId) {
          setNodeId(msg.data.nodeId);
          // Don't auto-execute, just fill the field
        }
      } else if (msg.type === 'mcp_selection_changed') {
        // Update node ID when selection changes in Figma (only if modal is open)
        if (isOpen && msg.data && msg.data.nodeId) {
          setNodeId(msg.data.nodeId);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
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
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Node Operations</h2>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
              Node ID <span style={{ background: '#0066ff', color: '#fff', padding: '3px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600 }}>Required</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                placeholder="123:456 or 123-456"
                style={{
                  width: '100%',
                  padding: 10,
                  paddingRight: nodeId ? 32 : 10,
                  fontSize: 13,
                  background: '#333',
                  border: '1px solid #555',
                  borderRadius: 4,
                  color: '#fff',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                }}
              />
              {nodeId && (
                <button
                  onClick={() => setNodeId('')}
                  style={{
                    position: 'absolute',
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#999',
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#999';
                  }}
                  title="Clear"
                >
                  ×
                </button>
              )}
            </div>
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
              Select anything in Figma to auto-fill
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 8, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Operation</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 4,
                padding: 4,
                background: '#1e1e1e',
                borderRadius: 8,
                border: '1px solid #444',
              }}
            >
              {(['read', 'select', 'update', 'delete'] as const).map((op) => (
                <button
                  key={op}
                  onClick={() => setNodeOperation(op)}
                  style={{
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 500,
                    background: nodeOperation === op
                      ? 'linear-gradient(145deg, #0066ff, #0052cc)'
                      : 'transparent',
                    color: nodeOperation === op ? '#fff' : 'rgba(255,255,255,0.7)',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {nodeOperation === 'update' && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Properties (JSON)</label>
              <textarea
                value={nodeProps}
                onChange={(e) => setNodeProps(e.target.value)}
                placeholder=""
                style={{
                  width: '100%',
                  padding: 10,
                  fontSize: 13,
                  background: '#333',
                  border: '1px solid #555',
                  borderRadius: 4,
                  color: '#fff',
                  minHeight: 80,
                  resize: 'vertical',
                  fontFamily: 'monospace',
                }}
              />
              <p style={{ fontSize: 12, color: '#aaa', marginTop: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                Edit the properties you want to update
              </p>
            </div>
          )}

          <button
            onClick={executeNodeOp}
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.02em',
              background: isLoading
                ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                : (nodeOperation === 'delete'
                  ? 'linear-gradient(145deg, rgba(255,0,0,0.15) 0%, rgba(255,0,0,0.05) 100%)'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'),
              color: isLoading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
              border: isLoading
                ? '1px solid rgba(255,255,255,0.05)'
                : (nodeOperation === 'delete'
                  ? '1px solid rgba(255,0,0,0.3)'
                  : '1px solid rgba(255,255,255,0.18)'),
              borderRadius: '12px',
              boxShadow: isLoading
                ? 'inset 0 0 2px rgba(255,255,255,0.05), inset 0 -1px 3px rgba(0,0,0,0.15)'
                : '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
              opacity: isLoading ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(30px) saturate(160%)',
            }}
          >
            {isLoading && (
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(0, 255, 255, 0.4)',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite, pulse 2s ease-in-out infinite',
                  boxShadow: '0 0 8px rgba(0,255,255,0.5)',
                }}
              />
            )}
            {isLoading ? 'Executing...' : (() => {
              switch (nodeOperation) {
                case 'read':
                  return 'Get Details';
                case 'select':
                  return nodeId ? `Select Node ${nodeId}` : 'Select Node';
                case 'update':
                  return 'Apply Changes';
                case 'delete':
                  return 'Delete Node';
                default:
                  return 'Execute';
              }
            })()}
          </button>

          {result && (
            <div
              style={{
                padding: 12,
                borderRadius: 4,
                fontSize: 13,
                marginTop: 8,
                background: result.success ? 'rgba(0, 200, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                border: result.success ? '1px solid rgba(0, 200, 0, 0.3)' : '1px solid rgba(255, 0, 0, 0.3)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#fff' }}>
                {result.success ? '✅ Success' : '❌ Error'}
              </div>
              <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#fff', margin: 0 }}>
                {result.success ? JSON.stringify(result.data, null, 2) : result.error}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
