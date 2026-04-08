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
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          width: '80%',
          maxWidth: 720,
          maxHeight: '80%',
          overflow: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #eee' }}>
          <strong>API Response</strong>
          <button onClick={onClose}>Close</button>
        </div>
        <pre style={{ margin: 0, padding: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {content}
        </pre>
      </div>
    </div>
  );
};
