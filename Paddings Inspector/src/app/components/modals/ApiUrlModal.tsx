import React from 'react';
import { fetchApiData } from '../utils/apiUtils';

type ApiUrlModalProps = {
  isOpen: boolean;
  apiUrl: string;
  onClose: () => void;
  onUrlChange: (url: string) => void;
  onResponse: (content: string) => void;
  onOpenResponse: () => void;
};

export const ApiUrlModal: React.FC<ApiUrlModalProps> = ({
  isOpen,
  apiUrl,
  onClose,
  onUrlChange,
  onResponse,
  onOpenResponse,
}) => {
  if (!isOpen) return null;

  const handleRequest = async () => {
    try {
      const content = await fetchApiData(apiUrl);
      onResponse(content);
      onClose();
      onOpenResponse();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      onResponse(`Request failed: ${message}`);
      onClose();
      onOpenResponse();
    }
  };

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
          width: '90%',
          maxWidth: 500,
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <strong>API URL</strong>
          <button onClick={onClose}>Close</button>
        </div>
        <input
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            border: '1px solid #ccc',
            borderRadius: 4,
            outline: 'none',
            marginBottom: '12px',
          }}
          type="text"
          placeholder="Enter API URL and press Enter"
          value={apiUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleRequest();
            }
          }}
          autoFocus
        />
        <button
          onClick={handleRequest}
          style={{
            padding: '8px 16px',
            background: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Send Request
        </button>
      </div>
    </div>
  );
};
