import React from 'react';
import '../styles/ui.css';
import '../styles/colors-actions.css';

interface FixDeletedVariablesProps {
  hasFramesSelected: boolean;
}

export const FixDeletedVariables: React.FC<FixDeletedVariablesProps> = ({ hasFramesSelected }) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="panel-container">
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
      <div className="panel-note">
        <span className="panel-note-indicator" />
        <span className="panel-note-text">
          Have you found a deleted colour variable that has been assigned? This button will create a new variable and reassign it.
        </span>
      </div>
    </div>
  );
};
