import React, { useEffect } from "react";

export const Creation = () => {
  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === "create-rectangles") {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  // @ts-ignore
  const onCreate = () => {
    const formDataObj = {
      fname2: "12",
      fname3: "12",
      fname4: "12",
      fname5: "12",
    };
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", formDataObj } },
      "*"
    );
  };

  // @ts-ignore
  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };
  return (
    <div>
      {/*Count: <input ref={countRef} />
        <Button onClick={onCreate}>Create</Button>
        <Button variant="outlined" onClick={onCancel} >Cancel</Button>*/}
    </div>
  );
};

export default Creation;
