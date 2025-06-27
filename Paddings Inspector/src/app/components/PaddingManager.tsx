import React from 'react';
import PaddingDropdown from './PaddingDropdown';
import { NumberVariable } from './types';

export default function PaddingManager() {
  const [numberVariables] = React.useState<NumberVariable[]>([]);
  const [paddingValues, setPaddingValues] = React.useState({
    top: 8,
    bottom: 8,
    left: 16,
    right: 16,
  });

  const handlePaddingChange = (side: 'top' | 'bottom' | 'left' | 'right', value: number) => {
    setPaddingValues((prev) => ({ ...prev, [side]: value }));
  };

  const renderDropdown = (
    label: string,
    value: number,
    id: string,
    side: 'top' | 'bottom' | 'left' | 'right' 
  ) => (
    <PaddingDropdown
      label={label}
      initialValue={value}
      id={id}
      side={side}
      numberVariables={numberVariables}
      onValueChange={(newValue) => handlePaddingChange(side, newValue)}
    />
  );

  return (
    <div
      style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        padding: 16,
        backgroundColor: '#e0e0e0',
        fontFamily: 'sans-serif',
      }}
    >
      {renderDropdown('Top', paddingValues.top, 'node-id', 'top')}
      {renderDropdown('Bottom', paddingValues.bottom, 'node-id', 'bottom')}
      {renderDropdown('Left', paddingValues.left, 'node-id', 'left')}
      {renderDropdown('Right', paddingValues.right, 'node-id', 'right')}
    </div>
  );
}
