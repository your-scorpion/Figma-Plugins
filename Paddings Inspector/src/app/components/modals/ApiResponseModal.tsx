import React from 'react';

type ApiResponseModalProps = {
  isOpen: boolean;
  content: string;
  onClose: () => void;
};

export const ApiResponseModal: React.FC<ApiResponseModalProps> = ({
  isOpen,
  content,
  onClose,
}) => {
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
          maxWidth: 720,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid #444',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>API Response</h2>
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
        <pre
          style={{
            margin: 0,
            padding: 12,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: '#fff',
            fontSize: 13,
            background: '#1e1e1e',
            borderRadius: 8,
            border: '1px solid #444',
            fontFamily: 'monospace',
          }}
        >
          {content}
        </pre>
      </div>
    </div>
  );
};
