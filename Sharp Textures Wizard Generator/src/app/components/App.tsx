import React, { useState, useEffect } from 'react';
import '../styles/ui.css';
import { MantineProvider, Slider, Button, rem, Title } from '@mantine/core';

function App() {
  const [value, setValue] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', value } }, '*');
  };

  const handleClick = () => {
    if (!isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowOverlay(true);
      }, 2000);
    }
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  const valueLabelFormat = (value) => {
    const units = ['', '', '', ''];
    let unitIndex = 0;
    let scaledValue = value;

    while (scaledValue >= 1024 && unitIndex < units.length - 1) {
      unitIndex += 1;
      scaledValue /= 1024;
    }

    return `${scaledValue} ${units[unitIndex]}`;
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div>
        <Title id="titleAdjuster" order={3}>
          Labyrinthine level:
        </Title>
        <Slider
          sx={{ paddingTop: '45px', marginLeft: '30px', marginRight: '30px', marginTop: '-32px' }}
          color="grape"
          labelTransitionDuration={250}
          labelTransitionTimingFunction="ease"
          defaultValue={220}
          styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
          min={100}
          max={600}
          step={2}
          thumbSize={24}
          size="xl"
          labelTransition="scale-x"
          value={value}
          onChange={setValue}
          radius="xl"
          showLabelOnHover={true}
          label={valueLabelFormat}
          marks={[
            { value: 100, label: '100' },
            { value: 300, label: '300' },
            { value: 500, label: '500' },
            { value: 600, label: '600' },
          ]}
        />
        <div id="buttonStyler">
          <Button
            id="create"
            onClick={() => {
              handleClick();
              onCreate();
            }}
            loading={isLoading}
            variant="gradient"
            gradient={{ from: 'orange', to: 'grape', deg: 60 }}
            radius="xl"
            size="lg"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
          <Button variant="outline" onClick={onCancel} color="gray" radius="xl" size="lg">
            Close
          </Button>

          {showOverlay && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999999,
            }}
          >
            <div style={{ color: 'white' }}>
              <p>Please Wait</p>
            </div>
          </div>
        )}


        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
