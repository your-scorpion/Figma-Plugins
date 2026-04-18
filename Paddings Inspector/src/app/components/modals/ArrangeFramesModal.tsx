import React from 'react';
import { sendArrangeFrames } from '../utils/pluginMessages';

type ArrangeFramesModalProps = {
  isOpen: boolean;
  postfixInput: string;
  randomnessLevel: number;
  onClose: () => void;
  onPostfixChange: (postfix: string) => void;
};

export const ArrangeFramesModal: React.FC<ArrangeFramesModalProps> = ({
  isOpen,
  postfixInput,
  randomnessLevel,
  onClose,
  onPostfixChange,
}) => {
  if (!isOpen) return null;

  const handleArrange = () => {
    const postfix = postfixInput.trim();
    sendArrangeFrames(postfix, randomnessLevel);
    onClose();
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
          width: '90%',
          maxWidth: 500,
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid #444',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          padding: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 8, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
          Arrange frames with postfix
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 16, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
          Provide a postfix to append to selected frame names while arranging. Example:{' '}
          <span style={{ fontFamily: 'monospace', background: '#333', padding: '3px 8px', borderRadius: 3, fontSize: 12 }}>Mobile</span>.
        </div>
        <input
          type="text"
          placeholder="e.g. Mobile"
          value={postfixInput}
          onChange={(e) => onPostfixChange(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 4,
            border: '1px solid #555',
            background: '#333',
            color: '#fff',
            fontSize: 13,
            marginBottom: 16,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
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
            onClick={handleArrange}
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
            Arrange
          </button>
        </div>
      </div>
    </div>
  );
};
