import React from 'react';
import { sendFindOrphanedInstances, sendRecomputeTextLayout } from './utils/pluginMessages';
import '../styles/colors-actions.css';

type ButtonsTabProps = {
  orphanScanRunning?: boolean;
  orphanScanTotal?: number;
  orphanScanChecked?: number;
  orphanScanFound?: number;
  recomputeRunning?: boolean;
  recomputeTotal?: number;
  recomputeDone?: number;
};

export const ButtonsTab: React.FC<ButtonsTabProps> = ({
  orphanScanRunning = false,
  orphanScanTotal = 0,
  orphanScanChecked = 0,
  orphanScanFound = 0,
  recomputeRunning = false,
  recomputeTotal = 0,
  recomputeDone = 0,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
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
        role="status"
        aria-live="polite"
        style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', minHeight: 18 }}
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
        role="status"
        aria-live="polite"
        style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}
      >
        {recomputeRunning ? (
          <span>Found {recomputeTotal} text layers. Progress: {recomputeDone}/{recomputeTotal}</span>
        ) : null}
      </div>
    </div>
  );
};
