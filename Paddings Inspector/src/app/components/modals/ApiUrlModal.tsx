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
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>API URL</h2>
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
        <input
          style={{
            width: '100%',
            padding: 10,
            fontSize: 13,
            background: '#333',
            border: '1px solid #555',
            borderRadius: 4,
            color: '#fff',
            outline: 'none',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
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
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.02em',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            color: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '12px',
            boxShadow: '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
            cursor: 'pointer',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(30px) saturate(160%)',
          }}
        >
          Send Request
        </button>
      </div>
    </div>
  );
};
