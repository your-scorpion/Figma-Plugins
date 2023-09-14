import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import App2 from './newCom';
import '../styles/ui.css';

export function App() {
  const textbox = useRef();
  
  const countRef = useCallback((element) => {
    if (element) element.value = '5';
    textbox.current = element;
  }, []);

  const onCreate = () => {
    const count = parseInt(textbox.current.value, 10);
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  useEffect(() => {
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div>
      <p>Count: <input ref={countRef} /></p>
      <button id="create" onClick={onCreate}>Create</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
