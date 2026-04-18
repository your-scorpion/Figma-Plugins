import React, { useState, useEffect } from 'react';

type ComponentSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ComponentSearchModal: React.FC<ComponentSearchModalProps> = ({ isOpen, onClose }) => {
  const [componentName, setComponentName] = useState('');
  const [result, setResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeComponentSearch = () => {
    if (!componentName) {
      setResult({ success: false, error: 'Please enter a component name' });
      return;
    }

    const args: any = { comp: componentName };

    setIsLoading(true);
    setResult(null);
    parent.postMessage({ pluginMessage: { type: 'mcp_component_search', arguments: args } }, '*');
  };

  const downloadJSON = () => {
    if (!result || !result.success) return;

    const dataStr = JSON.stringify(result.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `components-${componentName}-${Date.now()}.json`;
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
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>Component Search</h2>
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
              onKeyPress={(e) => e.key === 'Enter' && executeComponentSearch()}
            />
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 4, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
              Searches for components matching the name
            </p>
          </div>

          <button
            onClick={executeComponentSearch}
            disabled={isLoading || !componentName}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.02em',
              background: (isLoading || !componentName)
                ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              color: (isLoading || !componentName) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
              border: (isLoading || !componentName)
                ? '1px solid rgba(255,255,255,0.05)'
                : '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              boxShadow: (isLoading || !componentName)
                ? 'inset 0 0 2px rgba(255,255,255,0.05), inset 0 -1px 3px rgba(0,0,0,0.15)'
                : '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
              cursor: (isLoading || !componentName) ? 'not-allowed' : 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
              opacity: (isLoading || !componentName) ? 0.4 : 1,
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
            {isLoading ? 'Searching...' : 'Search Components'}
          </button>

          {result && result.success && (
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
                  Found: <strong style={{ color: '#0066ff' }}>{result.data.count}</strong> components
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
                ⬇️ Download JSON ({result.data.count} components)
              </button>
            </>
          )}

          {result && !result.success && (
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                color: '#ff6666',
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              {result.error}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
