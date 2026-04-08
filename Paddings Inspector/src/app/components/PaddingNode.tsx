import React from 'react';
import PaddingDropdown from './PaddingDropdown';
import { PaddingNode as PaddingNodeType, NumberVariable } from './types';
import { sendZoomToNode, sendRenameNode } from './utils/pluginMessages';

type PaddingNodeProps = {
  node: PaddingNodeType;
  depth?: number;
  numberVariables: NumberVariable[];
  editingNodeId: string | null;
  editingName: string;
  setEditingNodeId: (id: string | null) => void;
  setEditingName: (name: string) => void;
};

export const PaddingNode: React.FC<PaddingNodeProps> = ({
  node,
  depth = 0,
  numberVariables,
  editingNodeId,
  editingName,
  setEditingNodeId,
  setEditingName,
}) => {
  const indent = depth * 2;

  const handleRename = () => {
    const newName = editingName.trim();
    if (newName && newName !== node.name) {
      sendRenameNode(node.id, newName);
    }
    setEditingNodeId(null);
  };

  return (
    <div key={node.id} className="padding-card" style={{ marginLeft: indent }}>
      <strong className="padding-title" onClick={() => sendZoomToNode(node.id)}>
        {node.name}
      </strong>{' '}
      {editingNodeId === node.id ? (
        <input
          autoFocus
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleRename();
            } else if (e.key === 'Escape') {
              setEditingNodeId(null);
            }
          }}
          onBlur={handleRename}
          className="padding-rename-input"
        />
      ) : (
        <button
          onClick={() => {
            setEditingNodeId(node.id);
            setEditingName(node.name);
          }}
          className="padding-rename-button"
          title="Rename frame"
        >
          ✏️
        </button>
      )}
      {node.isAutoLayout && (
        <div className="padding-controls">
          <PaddingDropdown
            label="Top"
            initialValue={node.padding?.top || 0}
            id={node.id}
            side="top"
            numberVariables={numberVariables}
          />
          <PaddingDropdown
            label="Right"
            initialValue={node.padding?.right || 0}
            id={node.id}
            side="right"
            numberVariables={numberVariables}
          />
          <PaddingDropdown
            label="Bottom"
            initialValue={node.padding?.bottom || 0}
            id={node.id}
            side="bottom"
            numberVariables={numberVariables}
          />
          <PaddingDropdown
            label="Left"
            initialValue={node.padding?.left || 0}
            id={node.id}
            side="left"
            numberVariables={numberVariables}
          />
          {typeof node.itemSpacing === 'number' && (
            <PaddingDropdown
              label="Spacing"
              initialValue={node.itemSpacing}
              id={node.id}
              side="spacing"
              numberVariables={numberVariables}
              isItemSpacing={true}
            />
          )}
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div className="padding-children">
          {node.children.map((child, i) => (
            <React.Fragment key={child.id}>
              <PaddingNode
                node={child}
                depth={depth + 1}
                numberVariables={numberVariables}
                editingNodeId={editingNodeId}
                editingName={editingName}
                setEditingNodeId={setEditingNodeId}
                setEditingName={setEditingName}
              />
              {i < node.children!.length - 1 && (
                <hr className="padding-separator" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
