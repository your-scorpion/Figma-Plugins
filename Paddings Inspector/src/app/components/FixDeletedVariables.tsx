import React from 'react';
import '../styles/colors-actions.css';

interface FixDeletedVariablesProps {
  hasFramesSelected: boolean;
}

export const FixDeletedVariables: React.FC<FixDeletedVariablesProps> = ({ hasFramesSelected }) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '10px 12px',
        background: 'linear-gradient(180deg, rgba(20,24,36,0.65), rgba(12,14,22,0.65))',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        boxShadow: '0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <button
        onClick={() => {
          if (loading || !hasFramesSelected) return;
          setLoading(true);
          try {
            parent.postMessage(
              { pluginMessage: { type: 'create-color-collection-from-selection' } },
              '*'
            );
          } finally {
            setTimeout(() => setLoading(false), 1400);
          }
        }}
        disabled={loading || !hasFramesSelected}
        className={`color-action-btn fix${loading ? ' loading' : ''}`}
        title={hasFramesSelected ? 'Create a new variable collection from styled or variable-bound colors in selection' : 'please select frames'}
      >
        {loading && (
          <div
            style={{
              width: 14,
              height: 14,
              border: '2px solid rgba(0,122,255,0.35)',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite, pulse 2s ease-in-out infinite',
            }}
          />
        )}
        Fix deleted variables. Ignore HEX.
      </button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00FFA2, #AF52DE)',
            boxShadow: '0 0 6px rgba(175,82,222,0.5)',
          }}
        />
        <span style={{ fontSize: 12, lineHeight: 1.4 }}>
          Have you found a deleted colour variable that has been assigned? This button will create a new variable and reassign it.
        </span>
      </div>
    </div>
  );
};
