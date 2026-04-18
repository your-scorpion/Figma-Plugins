import React from 'react';
import { sendFindOrphanedInstances, sendRecomputeTextLayout } from './utils/pluginMessages';;

type ButtonsTabProps = {
  orphanScanRunning?: boolean;
  orphanScanTotal?: number;
  orphanScanChecked?: number;
  orphanScanFound?: number;
  recomputeRunning?: boolean;
  recomputeTotal?: number;
  recomputeDone?: number;
  onApiUrlPopupOpen: () => void;
  onNodeOperationsOpen: () => void;
  onComponentSearchOpen: () => void;
  onSelectionValidatorOpen: () => void;
};

export const ButtonsTab: React.FC<ButtonsTabProps> = ({
  orphanScanRunning = false,
  orphanScanTotal = 0,
  orphanScanChecked = 0,
  orphanScanFound = 0,
  recomputeRunning = false,
  recomputeTotal = 0,
  recomputeDone = 0,
  onApiUrlPopupOpen,
  onNodeOperationsOpen,
  onComponentSearchOpen,
  onSelectionValidatorOpen,
}) => {
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
      {/* Find Orphaned Instances */}
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
          type="button"
          onClick={() => sendFindOrphanedInstances()}
          className={`color-action-btn alias${orphanScanRunning ? ' loading' : ''}`}
          disabled={orphanScanRunning}
          aria-busy={orphanScanRunning}
          title="Find orphaned instances with deleted parent (missing main component)"
        >
          {orphanScanRunning
            ? `Checking instances… ${orphanScanChecked}/${orphanScanTotal}`
            : 'Find orphaned instances'}
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
            Find instances with deleted parent (missing main component).
          </span>
        </div>
        {(orphanScanRunning || orphanScanTotal > 0) && (
          <div
            role="status"
            aria-live="polite"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}
          >
            {orphanScanRunning ? (
              <span>
                Checked {orphanScanChecked} of {orphanScanTotal} instances. Orphaned found: {orphanScanFound}
              </span>
            ) : orphanScanTotal > 0 ? (
              <span>
                Last scan checked {orphanScanChecked} instances. Orphaned found: {orphanScanFound}
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Recompute Text Layout */}
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
          type="button"
          onClick={() => sendRecomputeTextLayout()}
          className={`color-action-btn recompute${recomputeRunning ? ' loading' : ''}`}
          disabled={recomputeRunning}
          aria-busy={recomputeRunning}
          title="Loads fonts used on the current page, touches each text layer to force Figma to recalculate its layout, and keeps you updated with progress while it runs"
        >
          {recomputeRunning ? `Recomputing… ${recomputeDone}/${recomputeTotal}` : 'Recompute text layout'}
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
            Load fonts and touch each text layer to force Figma to recalculate layout.
          </span>
        </div>
        {recomputeRunning && (
          <div
            role="status"
            aria-live="polite"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}
          >
            <span>Found {recomputeTotal} text layers. Progress: {recomputeDone}/{recomputeTotal}</span>
          </div>
        )}
      </div>

      {/* API Test */}
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
          type="button"
          onClick={onApiUrlPopupOpen}
          className="color-action-btn"
          title="Open API URL input for testing external API calls"
        >
          API Test
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
            Open API URL input for testing external API calls.
          </span>
        </div>
      </div>

      {/* MCP Tools Section */}
      <div style={{ marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
          MCP Validated Tools
        </div>

        {/* CRUD API */}
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
            marginBottom: 10,
          }}
        >
          <button
            type="button"
            onClick={onNodeOperationsOpen}
            className="color-action-btn"
            title="Read, update, delete, or select nodes by ID"
          >
            CRUD API
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
                background: 'linear-gradient(135deg, #0066ff, #0099ff)',
                boxShadow: '0 0 6px rgba(0,102,255,0.5)',
              }}
            />
            <span style={{ fontSize: 12, lineHeight: 1.4 }}>
              Read, update, delete, or select nodes by ID.
            </span>
          </div>
        </div>

        {/* Component Search */}
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
            marginBottom: 10,
          }}
        >
          <button
            type="button"
            onClick={onComponentSearchOpen}
            className="color-action-btn"
            title="Search for components by name and variant"
          >
            Component Search
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
                background: 'linear-gradient(135deg, #0066ff, #0099ff)',
                boxShadow: '0 0 6px rgba(0,102,255,0.5)',
              }}
            />
            <span style={{ fontSize: 12, lineHeight: 1.4 }}>
              Search for components by name and variant.
            </span>
          </div>
        </div>

        {/* Selection to JSON */}
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
            type="button"
            onClick={onSelectionValidatorOpen}
            className="color-action-btn"
            title="Export current selection as JSON data"
          >
            Selection to JSON
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
                background: 'linear-gradient(135deg, #0066ff, #0099ff)',
                boxShadow: '0 0 6px rgba(175,82,222,0.5)',
              }}
            />
            <span style={{ fontSize: 12, lineHeight: 1.4 }}>
              Export current selection as JSON data.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
