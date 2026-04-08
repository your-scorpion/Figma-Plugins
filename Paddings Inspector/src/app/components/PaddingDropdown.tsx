import React from 'react';
import { NumberVariable } from './types';

type PaddingDropdownProps = {
  label: string;
  initialValue: number;
  id: string;
  side: 'top' | 'bottom' | 'left' | 'right' | 'spacing';
  numberVariables: NumberVariable[];
  isItemSpacing?: boolean;
  onValueChange?: (value: number) => void;
};

const PaddingDropdown: React.FC<PaddingDropdownProps> = ({
  label,
  initialValue,
  id,
  side,
  isItemSpacing,
  onValueChange,
}) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const updateValue = (newValue: number, variableId?: string) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      // Default behavior: post message to Figma
      if (isItemSpacing) {
        parent.postMessage({
          pluginMessage: {
            type: 'update-item-spacing',
            id,
            value: newValue,
            variableId
          }
        }, '*');
      } else {
        parent.postMessage({
          pluginMessage: {
            type: 'update-padding',
            id,
            side,
            value: newValue,
            variableId
          }
        }, '*');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      updateValue(newValue);
    }
  };

  return (
    <div className="padding-field">
      <label className="padding-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="padding-input"
        />
      </div>
    </div>
  );
};

export default PaddingDropdown;
