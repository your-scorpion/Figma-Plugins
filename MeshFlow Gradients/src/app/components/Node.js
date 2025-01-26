import React from 'react';

const Node = ({ node }) => {
  return (
    <g className="node">
      <foreignObject className="text-container" x={-50} y={-20} width={100} height={40}>
        <div className="label">{node.label}</div>
      </foreignObject>
      <text textAnchor="middle" dominantBaseline="central" fontSize="20px" y={20}>
        {node.emoji}
      </text>
    </g>
  );
};

export default Node;
