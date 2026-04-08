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
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001,
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 340,
          maxWidth: '90%',
          background: '#111',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
          padding: 16,
          color: '#fff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Name your variables
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>
          Prefix for variable names. They will look like{' '}
          <code>{prefixInput || DEFAULT_PREFIX}-8</code>,{' '}
          <code>{prefixInput || DEFAULT_PREFIX}-16</code>.
        </div>
        <input
          type="text"
          value={prefixInput}
          onChange={(e) => onPrefixChange(e.target.value)}
          placeholder="e.g. spacing, padding, gap"
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#0c0c0c',
            color: '#fff',
            fontSize: 13,
            outline: 'none',
            marginBottom: 12,
          }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isLoading}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(120,80,255,0.5)',
              background: 'linear-gradient(145deg, rgba(120,80,255,0.45), rgba(80,0,255,0.35))',
              color: '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};
