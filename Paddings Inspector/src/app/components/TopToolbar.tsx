import React from 'react';

type TopToolbarProps = {
  isVisible: boolean;
  paddingDataLength: number;
  selectAutoLayoutLoading: boolean;
  createVariablesLoading: boolean;
  onSelectAutoLayout: () => void;
  onCreateVariables: () => void;
};

export const TopToolbar: React.FC<TopToolbarProps> = ({
  isVisible,
  paddingDataLength,
  selectAutoLayoutLoading,
  createVariablesLoading,
  onSelectAutoLayout,
  onCreateVariables,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '32px',
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        zIndex: 10000,
        padding: '0 4px',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <button
        aria-label="Select Auto Layout"
        onClick={onSelectAutoLayout}
        disabled={selectAutoLayoutLoading}
        style={{
          padding: '6px 12px',
          fontSize: '13px',
          fontWeight: 500,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '0.02em',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          color: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.25), inset 0 0.5px 1px rgba(255,255,255,0.2)',
          cursor: selectAutoLayoutLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: selectAutoLayoutLoading ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(20px) saturate(140%)',
        }}
        title="Select next auto layout frame on page"
      >
        {selectAutoLayoutLoading ? 'Searching…' : 'Select Auto Layout'}
      </button>

      <button
        onClick={onCreateVariables}
        disabled={createVariablesLoading || paddingDataLength === 0}
        style={{
          fontSize: '13.5px',
          fontWeight: 500,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '0.02em',
          background:
            createVariablesLoading || paddingDataLength === 0
              ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          color: createVariablesLoading || paddingDataLength === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.95)',
          border:
            createVariablesLoading || paddingDataLength === 0
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(255,255,255,0.18)',
          borderRadius: '12px',
          boxShadow:
            createVariablesLoading || paddingDataLength === 0
              ? 'inset 0 0 2px rgba(255,255,255,0.08), inset 0 -1px 3px rgba(0,0,0,0.2)'
              : '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
          cursor: createVariablesLoading || paddingDataLength === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
          opacity: createVariablesLoading || paddingDataLength === 0 ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(30px) saturate(160%)',
          padding: '6px 12px',
        }}
        title={paddingDataLength === 0 ? 'please select Auto Layout nodes' : 'Create Figma variables from selected paddings'}
      >
        {createVariablesLoading ? 'Creating...' : 'Create Variables'}
      </button>
    </div>
  );
};
