import * as React from 'react';

const ChildComponent = ({ parentData, sendChildToParent }) => {
  let dataFromChild = 3;

  return (
    <div className="child-container">
      <h4>Child Component</h4>
      <button onClick={() => sendChildToParent(dataFromChild)}>
        Send data from child to parent
      </button>
      <h4> {parentData} </h4>
    </div>
  );
};

export default ChildComponent;
