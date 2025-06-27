// VariableList.tsx
import React from 'react';
import { NumberVariable } from './types';

export const VariableList = ({
  numberVariables,
  onAssignToAll,
}: {
  numberVariables: NumberVariable[];
  onAssignToAll: () => void;
}) => {
  const [selectedId, setSelectedId] = React.useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <div
      style={{
        position: 'relative',
        margin: 4,
        padding: 8,
        background: '#f9f9f9',
        borderRadius: 6,
        border: '1px solid #ccc',
        width: 280,
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <strong
        style={{
          marginBottom: 6,
          fontSize: 12,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title="Available Variables"
      >
        Available Variables
      </strong>

      <div
        onClick={() => setIsSheetOpen((open) => !open)}
        style={{
          width: '100%',
          padding: '6px 8px',
          fontSize: 13,
          borderRadius: 4,
          border: '1px solid #aaa',
          background: '#fff',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsSheetOpen((open) => !open);
          }
        }}
      >
        <span>
          {selectedId
            ? numberVariables.find((v) => v.id === selectedId)?.name || 'Select a variable'
            : 'Select a variable'}
        </span>
        <span style={{ transform: isSheetOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </div>

      <div style={{ flexGrow: 1 }} />

      {isSheetOpen && (
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: 200,
            overflowY: 'auto',
            backgroundColor: '#fff',
            borderTop: '1px solid #ccc',
            boxShadow: '0 -4px 6px rgba(0,0,0,0.1)',
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            zIndex: 10,
          }}
        >
          {numberVariables.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedId(v.id);
                setIsSheetOpen(false);
              }}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                borderRadius: 4,
                border: selectedId === v.id ? '2px solid #007AFF' : '1px solid #aaa',
                backgroundColor: selectedId === v.id ? '#e6f0ff' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
              type="button"
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          if (selectedId) {
            parent.postMessage(
              { pluginMessage: { type: 'assign-variable', variableId: selectedId } },
              '*'
            );
            onAssignToAll();
          }
        }}
        disabled={!selectedId}
      >
        Assign Selected Variable
      </button>
    </div>
  );
};
