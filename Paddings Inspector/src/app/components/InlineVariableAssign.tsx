// components/InlineVariableAssign.tsx
import React from 'react';

type NumberVariable = {
  id: string;
  name: string;
  key: string;
  value?: number;
};

export function InlineVariableAssign({
  nodeId,
  side,
  numberVariables,
}: {
  nodeId: string;
  side: 'top' | 'bottom' | 'left' | 'right' | 'itemSpacing';
  numberVariables: NumberVariable[];
}) {
  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{
          padding: '4px 6px',
          fontSize: 12,
          borderRadius: 4,
          border: '1px solid #aaa',
          background: '#fff',
          width: 120,
        }}
      >
        <option value="" disabled>
          Assign variable
        </option>
        {numberVariables.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (!selectedId) return;
          parent.postMessage(
            {
              pluginMessage: {
                type: 'assign-variable-to-group',
                nodeId,
                side,
                variableId: selectedId,
              },
            },
            '*'
          );
        }}
        disabled={!selectedId}
        style={{
          fontSize: 12,
          padding: '4px 8px',
          borderRadius: 4,
          background: selectedId ? '#eee' : '#f5f5f5',
          border: '1px solid #999',
          cursor: selectedId ? 'pointer' : 'not-allowed',
        }}
      >
        Assign
      </button>
    </div>
  );
}
