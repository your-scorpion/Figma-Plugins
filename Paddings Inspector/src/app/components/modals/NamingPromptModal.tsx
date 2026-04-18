import React from 'react';
import { DEFAULT_PREFIX } from '../constants';
import { sendCreatePaddingVariables } from '../utils/pluginMessages';

type NamingPromptModalProps = {
  isOpen: boolean;
  prefixInput: string;
  onClose: () => void;
  onPrefixChange: (prefix: string) => void;
  onCreate: () => void;
  isLoading: boolean;
};

export const NamingPromptModal: React.FC<NamingPromptModalProps> = ({
  isOpen,
  prefixInput,
  onClose,
  onPrefixChange,
  onCreate,
  isLoading,
}) => {
  if (!isOpen) return null;

  const handleCreate = () => {
    const raw = (prefixInput || DEFAULT_PREFIX).trim();
    let prefix = raw.replace(/[\x00-\x1F\x7F]/g, '').replace(/\s+/g, '-');
    if (!prefix) prefix = DEFAULT_PREFIX;
    sendCreatePaddingVariables(prefix);
    onCreate();
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
          maxWidth: 500,
          width: '90%',
          background: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          padding: 20,
          color: '#fff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
          Name your variables
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 12, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
          Prefix for variable names. They will look like{' '}
          <code style={{ background: '#333', padding: '3px 8px', borderRadius: 3, fontSize: 12 }}>{prefixInput || DEFAULT_PREFIX}-8</code>,{' '}
          <code style={{ background: '#333', padding: '3px 8px', borderRadius: 3, fontSize: 12 }}>{prefixInput || DEFAULT_PREFIX}-16</code>.
        </div>
        <input
          type="text"
          value={prefixInput}
          onChange={(e) => onPrefixChange(e.target.value)}
          placeholder="e.g. spacing, padding, gap"
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 4,
            border: '1px solid #555',
            background: '#333',
            color: '#fff',
            fontSize: 13,
            outline: 'none',
            marginBottom: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 20px',
              fontSize: '13.5px',
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.02em',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
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
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.02em',
              background: isLoading
                ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              color: isLoading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
              border: isLoading
                ? '1px solid rgba(255,255,255,0.05)'
                : '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              boxShadow: isLoading
                ? 'inset 0 0 2px rgba(255,255,255,0.05), inset 0 -1px 3px rgba(0,0,0,0.15)'
                : '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
              opacity: isLoading ? 0.4 : 1,
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(30px) saturate(160%)',
            }}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};
