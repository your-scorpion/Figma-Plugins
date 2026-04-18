import React, { useState, useEffect } from 'react';

type SelectionValidatorModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SelectionValidatorModal: React.FC<SelectionValidatorModalProps> = ({ isOpen, onClose }) => {
  const [result, setResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSelection = () => {
    setIsLoading(true);
    setResult(null);
    parent.postMessage({ pluginMessage: { type: 'mcp_get_selection', arguments: {} } }, '*');
  };

  // Auto-fetch on modal open
  useEffect(() => {
    if (isOpen) {
      fetchSelection();
    }
  }, [isOpen]);

  const downloadJSON = () => {
    if (!result || !result.success) return;

    const dataStr = JSON.stringify(result.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `selection-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;

      if (msg.type === 'mcp_result') {
        setIsLoading(false);
        setResult(msg.data);
      } else if (msg.type === 'mcp_selection_changed') {
        // Auto-update when selection changes (only if modal is open)
        if (isOpen) {
          fetchSelection();
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
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Selection to JSON</h2>
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
          {isLoading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: '3px solid rgba(0, 102, 255, 0.2)',
                  borderTop: '3px solid #0066ff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ fontSize: 12, color: '#aaa', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Loading selection data...</p>
            </div>
          )}

          {!isLoading && result && result.success && (
            <>
              <div
                style={{
                  padding: 8,
                  background: '#1e1e1e',
                  borderRadius: 8,
                  border: '1px solid #444',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: '#bbb', marginBottom: 8, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                  Selected items: <strong style={{ color: '#0066ff' }}>{result.data.count}</strong>
                </div>
                <pre
                  style={{
                    fontSize: 12,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    color: '#fff',
                    margin: 0,
                    maxHeight: 300,
                    overflowY: 'auto',
                    padding: 12,
                    background: '#2a2a2a',
                    borderRadius: 4,
                  }}
                >
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>

              <button
                onClick={downloadJSON}
                style={{
                  padding: '9px 16px',
                  width: '100%',
                  gap: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: '600 14px/1.15 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '0.015em',
                  color: 'rgba(255, 255, 255, 0.96)',
                  background: 'linear-gradient(145deg, rgba(24, 54, 88, 0.95) 0%, rgba(16, 38, 68, 0.95) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(120, 200, 255, 0.25)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.06), 0 6px 14px rgba(0,0,0,.42)',
                  backdropFilter: 'blur(14px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(90, 200, 250, 0.25), 0 0 24px rgba(0, 122, 255, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.06), 0 6px 14px rgba(0,0,0,.42)';
                }}
              >
                ⬇️ Download JSON ({result.data.count} items)
              </button>
            </>
          )}

          {!isLoading && result && !result.success && (
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                color: '#ff6666',
                fontSize: 13,
                textAlign: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {result.error || 'No selection found'}
            </div>
          )}

          {!isLoading && !result && (
            <div
              style={{
                padding: 20,
                textAlign: 'center',
                color: '#aaa',
                fontSize: 13,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              Select elements in Figma to export as JSON
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
