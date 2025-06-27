import React from 'react';
//import ReactDOM from 'react-dom';
import { NumberVariable } from './types';

type PaddingDropdownProps = {
  label: string;
  initialValue: number;
  id: string;
  side: 'top' | 'bottom' | 'left' | 'right' | 'spacing';
  numberVariables: NumberVariable[];
  onValueChange: (value: number) => void;
};

const PaddingDropdown: React.FC<PaddingDropdownProps> = ({
  label,
  initialValue,
  id,
  side,
  numberVariables,
  onValueChange,
}) => {
  const [inputValue, setInputValue] = React.useState(initialValue.toString());
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLLabelElement>(null);

  const variableOptions = React.useMemo(
    () =>
      numberVariables.map((v) => {
        const parts = v.name.split('/');
        const finalName = parts[parts.length - 1];
        return { id: v.id, label: finalName };
      }),
    [numberVariables]
  );

  const filteredOptions = variableOptions.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const postUpdate = (value: number | undefined, variableId: string | null) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'update-padding',
          id,
          side,
          value,
          variableId,
        },
      },
      '*'
    );
  };



  const handleBlur = () => {
    setTimeout(() => {
      if (!isPopoverOpen) {
        const matchedOption = variableOptions.find(
          (v) => v.label.toLowerCase() === inputValue.toLowerCase()
        );

        if (matchedOption) {
          postUpdate(undefined, matchedOption.id);
        } else {
          const parsed = parseInt(inputValue, 10);
          if (!isNaN(parsed)) {
            postUpdate(parsed, null);
            setInputValue(parsed.toString());
            onValueChange(parsed); // ✅ Call parent handler with the new value
          } else {
            setInputValue(initialValue.toString());
            postUpdate(initialValue, null);
          }
        }
      }
    }, 150);
  };

  return (
    <label
      ref={containerRef}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '0 1px 0 0',
        fontSize: 10,
        cursor: 'default',
        whiteSpace: 'nowrap',
        minWidth: 22,
        position: 'relative',
      }}
      title={label}
    >
      <span
        style={{
          marginBottom: 2,
          fontSize: 10,
          color: '#555',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {label}
      </span>
      <input
        ref={inputRef}
        className={`retro gray-bg-input ${
          (() => {
            const num = parseInt(inputValue, 10);
            return !isNaN(num) && num % 2 !== 0 ? 'odd-value' : '';
          })()
        }`}
        value={inputValue}
        onFocus={() => setIsPopoverOpen(true)}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        autoComplete="off"
      />

    {filteredOptions.length > 0 && (
  <div
    style={{
      padding: '4px 8px',
      fontWeight: 600,
      fontSize: 11,
      color: '#444',
      background: '#eee',
      borderBottom: '1px solid #aaa',
    }}
  >
    Select Variable
  </div>
)}

    </label>
  );
};

export default PaddingDropdown;
