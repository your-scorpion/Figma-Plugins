import * as React from 'react';
import { useState } from "react";
import ChildComponent from "./childComponent"; 

const ParentComponent = () => {
  const [parentData, setParentData] = useState("");
  const [childData, setChildData] = useState("");

  const sendParentData = () => {
    setParentData("hey, this is coming from parent");
  };

  const sendChildToParent = (dataFromChild) => {
    setChildData(dataFromChild);
  };

  return (
    <div className="parent-container">
      <h4>Parent Component</h4>
      <button onClick={sendParentData}>Send data from parent to child</button>
      <h4> {childData} </h4>
      <ChildComponent
        sendChildToParent={sendChildToParent}
        parentData={parentData}
      />
    </div>
  );
};

export default ParentComponent;
