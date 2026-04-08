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
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          width: '92%',
          maxWidth: 560,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Arrange frames with postfix
        </div>
        <div style={{ fontSize: 13, color: '#444', marginBottom: 16 }}>
          Provide a postfix to append to selected frame names while arranging. Example:{' '}
          <span style={{ fontFamily: 'monospace' }}>Mobile</span>.
        </div>
        <input
          type="text"
          placeholder="e.g. Mobile"
          value={postfixInput}
          onChange={(e) => onPostfixChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 14,
            marginBottom: 16,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: '#eee',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleArrange}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: '#5b9cf5',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Arrange
          </button>
        </div>
      </div>
    </div>
  );
};
