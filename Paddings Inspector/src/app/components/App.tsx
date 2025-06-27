import React from 'react';
//import ReactDOM from 'react-dom';
import '../styles/ui.css';
//import { VariableList } from './VariableList';
import { NumberVariable } from './types';




function PaddingDropdown({
  label,
  initialValue,
  id,
  side,
  numberVariables,
}: {
  label: string;
  initialValue: number;
  id: string;
  side: 'top' | 'bottom' | 'left' | 'right';
  numberVariables: NumberVariable[];
}) {
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

  const handleSelectOption = (optionId: string, label: string) => {
    setInputValue(label);
    postUpdate(undefined, optionId);
    setIsPopoverOpen(false);
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
        fontSize: 12,
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


{isPopoverOpen && filteredOptions.length > 0 && (
  <div
    style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      maxHeight: 120,
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid #aaa',
      borderRadius: 4,
      zIndex: 999,
      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
    }}
  >
    {filteredOptions.map((option) => (
      <div
        key={option.id}
        style={{
          padding: '4px 8px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f9f9f9',
        }}
        onMouseDown={(e) => {
          e.preventDefault(); // prevents blur
          handleSelectOption(option.id, option.label);
        }}
      >
        {option.label}
      </div>
    ))}
  </div>
)}

    </label>
  );
}

function App() {
  const [paddingData, setPaddingData] = React.useState<any[]>([]);
  const [numberVariables, setNumberVariables] = React.useState<NumberVariable[]>([]);

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { pluginMessage } = event.data;
      if (pluginMessage.type === 'padding-data') setPaddingData(pluginMessage.data);
      if (pluginMessage.type === 'number-variables') setNumberVariables(pluginMessage.data);
    };
  }, []);

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
    />
  );

const renderItemSpacingDropdown = (value: number, id: string) => (
  <PaddingDropdown
    label="Spacing"
    initialValue={value}
    id={id}
    side={'spacing' as any} // 'side' field won't be used meaningfully, but must match type
    numberVariables={numberVariables}
  />
);


  const renderNode = (node: any, depth = 0): JSX.Element => {
 const indent = depth * 2;
  const bgColor = depth % 2 === 0 ? '#fff' : '#f7f8fa';


    return (
      <div
        key={node.id}
        style={{
          marginLeft: indent,
          marginBottom: 6,
          backgroundColor: bgColor,
          padding: '10px 12px',
          borderRadius: 6,
          boxShadow:
            depth === 0
              ? '0 1px 4px rgba(0,0,0,0.08)'
              : '0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #e0e0e0',
          transition: 'background-color 0.3s',
          maxWidth: 600,
          overflowWrap: 'break-word',
        }}
      >
        <strong
          style={{
            fontWeight: 600,
            color: '#222',
            fontSize: 13,
            cursor: 'pointer',
            textDecoration: 'underline',
            userSelect: 'none',
          }}
          onClick={() =>
            parent.postMessage(
              { pluginMessage: { type: 'zoom-to-node', nodeId: node.id } },
              '*'
            )
          }
        >
          {node.name}
        </strong>{' '}
{node.isAutoLayout && (
  <div
    style={{
      marginTop: 10,
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      alignItems: 'flex-end',
      flexWrap: 'nowrap',
    }}
  >
    {renderDropdown('Top', node.padding.top, node.id, 'top')}
    {renderDropdown('Right', node.padding.right, node.id, 'right')}
    {renderDropdown('Bottom', node.padding.bottom, node.id, 'bottom')}
    {renderDropdown('Left', node.padding.left, node.id, 'left')}
    {typeof node.itemSpacing === 'number' &&
      renderItemSpacingDropdown(node.itemSpacing, node.id)}
  </div>
)}



        {node.children?.length > 0 && (
          <div style={{ marginTop: 2, borderTop: '1px solid #864588', paddingTop: 6 }}>
            {node.children.map((child: any, i: number) => (
              <React.Fragment key={child.id}>
                {renderNode(child, depth + 1)}
                {i < node.children.length - 1 && (
                  <hr
                    style={{
                      borderColor: '#e6e6e6',
                      margin: '8px 0',
                      opacity: 0.6,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 1,
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {paddingData.length === 0 ? (
<div className="retro-screen2 " style={{ position: 'relative' }}>
<div className="retro-screen">
  <div className="retro-warning-box dos-box">

    NO VALID AUTO LAYOUT<br />
   SELECTED
     <span className="blinking-cursor"></span>

        <div className="dos-box">
      👉 To continue, kindly select at least one element that uses <strong>Auto Layout</strong>.
  </div></div>
</div></div>

      ) : (
        paddingData.map((node) => renderNode(node))
      )}

    </div>
  );
}

export default App;
