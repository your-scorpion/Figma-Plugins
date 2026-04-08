import React from 'react';
import '../styles/colors-actions.css';
import { FixDeletedVariables } from './FixDeletedVariables';
import { sendConvertColorsToVariables, sendCreateAllColorVariables } from './utils/pluginMessages';

type ColorTabProps = {
  hasFramesSelected: boolean;
  colorsToVarsLoading: boolean;
  allColorsToVarsLoading: boolean;
  onColorsToVarsLoadingChange: (loading: boolean) => void;
  onAllColorsToVarsLoadingChange: (loading: boolean) => void;
};

export const ColorTab: React.FC<ColorTabProps> = ({
  hasFramesSelected,
  colorsToVarsLoading,
  allColorsToVarsLoading,
  onColorsToVarsLoadingChange,
  onAllColorsToVarsLoadingChange,
}) => {
  const handleConvertColors = () => {
    if (colorsToVarsLoading || !hasFramesSelected) return;
    onColorsToVarsLoadingChange(true);
    sendConvertColorsToVariables();
    setTimeout(() => onColorsToVarsLoadingChange(false), 1200);
  };

  const handleCreateAllColors = () => {
    if (allColorsToVarsLoading || !hasFramesSelected) return;
    onAllColorsToVarsLoadingChange(true);
    sendCreateAllColorVariables();
    setTimeout(() => onAllColorsToVarsLoadingChange(false), 1600);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 10,
        padding: 16,
        background: 'linear-gradient(180deg, rgba(18,20,30,0.85), rgba(12,14,22,0.70))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
      }}
    >
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
          onClick={handleConvertColors}
          disabled={colorsToVarsLoading || !hasFramesSelected}
          className={`color-action-btn replace${colorsToVarsLoading ? ' loading' : ''}`}
          title={hasFramesSelected ? 'Create color variables and replace paints in selection' : 'please select frames'}
        >
          {colorsToVarsLoading && (
            <div
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(175,82,222,0.35)',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite, pulse 2s ease-in-out infinite',
              }}
            />
          )}
          Replace HEX with existing variables
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
            Bind paints in selection to matching existing color variables. No new variables.
          </span>
        </div>
      </div>
      <FixDeletedVariables hasFramesSelected={hasFramesSelected} />
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
          onClick={handleCreateAllColors}
          disabled={allColorsToVarsLoading || !hasFramesSelected}
          className={`color-action-btn generate${allColorsToVarsLoading ? ' loading' : ''}`}
          title={hasFramesSelected ? 'Parse all colors in selection (including hex) and create variables in the current collection' : 'please select frames'}
        >
          {allColorsToVarsLoading && (
            <div
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(175,82,222,0.35)',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite, pulse 2s ease-in-out infinite',
              }}
            />
          )}
          Generate new variables from HEX colors
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
            Create variables for all colors (including hex) and bind paints to them.
          </span>
        </div>
      </div>
    </div>
  );
};
