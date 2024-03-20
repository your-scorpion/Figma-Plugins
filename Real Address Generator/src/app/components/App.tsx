import React from 'react';
import '../styles/ui.css';
import Stringer from './Stringer'
import './cat.css';
import {Button, Tooltip, TooltipTrigger} from 'react-aria-components';




function App() {
 // const textbox = React.useRef<HTMLInputElement>(undefined);

 /* const countRef = React.useCallback((element: HTMLInputElement) => {
    if (element) element.value = '5';
    textbox.current = element;
  }, []);*/

  const onCreate = () => {
    //const count = parseInt(textbox.current.value, 10);
    parent.postMessage({ pluginMessage: { type: 'create-rectangles' } }, '*');
  };

 /* const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };*/

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (



<span>
  <div  className='global'>
    <div className="row">

      <div id='uniswap'>
        <Stringer />
      </div>
    </div>
    <div className="row" id="ajodhakdhak">
      <div className = "hideme">
        <TooltipTrigger>
          <Button id="create" onPress={onCreate}>
            Text extraction to separate textNodes
          </Button>
          <Tooltip className='tooltiptiptip'>
            All selected text will be duplicated into new text layers without any decoration.
          </Tooltip>
        </TooltipTrigger>
      </div>
    </div>
    {/* <button onClick={onCancel}>Cancel</button> */}
  </div>
</span>



  );
}

export default App;
