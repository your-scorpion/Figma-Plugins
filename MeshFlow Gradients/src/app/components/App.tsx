import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
const html2canvas = require('html2canvas');
import { NextUIProvider } from '@nextui-org/react';
import { Button, Spacer, Loading } from '@nextui-org/react';
import { Grid } from '@nextui-org/react';
import { Dropdown } from '@nextui-org/react';
import { CopyDocumentIcon } from './CopyDocumentIcon';
import { CopyDocumentIcon2 } from './CopyDocumentIcon33';
import { Tooltip, Progress, Card } from '@nextui-org/react';

function App() {
  const [capturedDataURL, setCapturedDataURL] = useState(null); // State variable to store the captured data URL
  const svgRef = useRef(null);
  const [linkColor, setLinkColor] = useState('#065372'); // State variable to keep track of the link color
  const [simulationChecked, setSimulationChecked] = useState(false); // State variable to track checkbox checked state
  const [isLoading, setIsLoading] = useState(false); // State variable to track the loading state
  const [activeButton, setActiveButton] = useState('randomColor'); // Default value can be 'randomColor'


  

  function getRandomColor() {
    const excludeHues = [30, 60, 90, 120]; // Exclude orange, yellow, and green hues
    const complementOffset = 180; // Offset to avoid complementary hues

    let hue = Math.floor(Math.random() * 360); // Random hue value between 0 and 360

    // Check if the generated hue is in the excluded range or close to its complement
    while (excludeHues.includes(hue) || excludeHues.includes((hue + complementOffset) % 360)) {
      hue = Math.floor(Math.random() * 360); // Generate a new hue value
    }

    const saturation = '100%'; // Set saturation to 100%
    const lightness = '70%'; // Set lightness to 70%

    return `hsl(${hue}, ${saturation}, ${lightness})`;
  }

  const minHue = 0; // Minimum hue (blue-green)
  const maxHue = 360; // Maximum hue (blue)
  const hue = Math.random() * (maxHue - minHue) + minHue;

  function getRandomColor2() {
    const minLightness = 60; // Minimum lightness
    const maxLightness = 80; // Maximum lightness
    const minSaturation = 60; // Minimum saturation
    const maxSaturation = 80; // Maximum saturation

    // Generate random lightness and saturation values within the specified range
    const lightness = Math.random() * (maxLightness - minLightness) + minLightness;
    const saturation = Math.random() * (maxSaturation - minSaturation) + minSaturation;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  const recolorLinks = (trfk) => {
    const newColor = trfk ? getRandomColor2() : getRandomColor();
    setActiveButton(trfk ? 'randomColor2' : 'randomColor');
    setLinkColor(newColor);
    updateLinksAndNodes();
    setSimulationChecked(false);
  };

  const updateLinksAndNodes = () => {
    //const width = 640;
    //const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear the SVG content before updating

    // Rest of your D3 code to create and update links and nodes
    // ...

    //svg.append('svg').attr('width', width).attr('height', height);
    // Create and update links and nodes using D3
    // ...
console.clear();

    captureGraph()
      .then(function (base64Data) {
        const capturedBase64Data = base64Data;
        return capturedBase64Data;
      })
      .catch(function (error) {
        console.error('An error occurred during graph capture:', error);
      });
  };

  let capturedDataURLData = capturedDataURL;
  console.log(typeof capturedDataURLData);

  //let base64value = _base64ToUint8Array(base64Data);

  const width = 640;
  const height = 480;

  const onCreate = () => {
    setIsLoading(true); // Set loading state to true

    setTimeout(() => {
      setIsLoading(false); // Set loading state to false after 1 second
    }, 1000);

    const count = 1;
    captureGraph() // Capture the graph
      .then(function (base64Data) {
        // Double the width and height of the canvas
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.onload = function () {
          canvas.width = img.width * 2;
          canvas.height = img.height * 2;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

          const capturedBase64Data = canvas.toDataURL('image/png');

          // Trigger the creation event and pass the captured data
          parent.postMessage(
            {
              pluginMessage: {
                type: 'create-rectangles',
                count,
                capturedDataURLData: capturedBase64Data,
                width,
                height,
              },
            },
            '*'
          );
        };
        img.src = base64Data as string; // Explicitly cast base64Data to string
      })
      .catch(function (error) {
        // Handle the error if necessary
        console.error('An error occurred during graph capture:', error);
      });
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  let css22 = 'blur(4%)';
  const captureGraph = () => {
    return new Promise((resolve, reject) => {
      const svgElement = svgRef.current;
      svgElement.style.filter = css22;

      const handleSvgInteraction = () => {
        setSimulationChecked(false); // Update the state to uncheck the checkbox
      };

      svgElement.style.cursor = 'all-scroll';

      svgElement.addEventListener('click', handleSvgInteraction);
      svgElement.addEventListener('mousedown', handleSvgInteraction);
      svgElement.addEventListener('mouseup', handleSvgInteraction);
      svgElement.addEventListener('mousedown', handleSvgInteraction);

      // Apply filters to the SVG element before capturing
      //svgElement.style.filter = css22;

      html2canvas(svgElement)
        .then(function (canvas) {
          const dataURL = canvas.toDataURL('image/png');
          setCapturedDataURL(dataURL);
          resolve(dataURL); // Resolve the promise with the data URL
        })
        .catch(function (error) {
          reject(error); // Reject the promise with the error
        })
        .finally(function () {
          // Reset the filters after capturing
          svgElement.style.filter = '';
        });
    });
  };

  const randomizeZIndex = () => {
    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll('.node');
    const nodeArray = Array.from(nodes);
    nodeArray.sort(() => Math.random() - 0.5); // Randomly shuffle the node elements
    nodeArray.forEach((node) => {
      d3.select(node).raise(); // Bring each node to the top based on the shuffled order
    });
  };

  useEffect(() => {
    captureGraph()
      .then(function (base64Data) {
        const capturedBase64Data = base64Data;
        return capturedBase64Data;
      })
      .catch(function (error) {
        // Handle the error if necessary
        console.error('An error occurred during graph capture:', error);
      });

    /*const nodes = [
      { id: 'node1', x: 200, y: 200 },
      { id: 'node2', x: 0, y: 100 },
      { id: 'node3', x: 400, y: 200 },
    ];*/

    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#E9E3FF');

    const numNodes = parseInt(selectedValue, 10);

    const nodes = Array.from({ length: numNodes }, (_, i) => ({
      id: `node${i + 1}`,
      x: Math.random() * width, // Random x-coordinate within the width of the SVG
      y: Math.random() * height, // Random y-coordinate within the height of the SVG
      label: `Node ${i + 1}`,
    }));

    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        links.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(1422))
      .force('center', d3.forceCenter(window.innerWidth / 2.22, window.innerHeight / 2))
      .force('x', d3.forceX().strength(0.011))
      .force('y', d3.forceY().strength(0.01))
      .force('collision', d3.forceCollide().radius(68))
      .on('tick', () => {
        updateLinks(); // Call the updateLinks function to update link positions
        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    const drag = d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded);

    function getRandomWidth2() {
      return Math.random() * 1645.9 + 434.1; // Random width between 0.1 and 500
    }

    function getRandomWidth() {
      return Math.random() * getRandomWidth2() + 1; // Random width between 1 and 6
    }

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.1275).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    const newColor = linkColor;
    const link = svg
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path') // Use 'path' instead of 'line'
      .attr('class', 'link')
      .style('stroke', newColor) // Set random stroke color
      .style('stroke-width', () => getRandomWidth()) // Set random stroke width
      .style('filter', 'blur(65px)')
      .style('filter', 'contrast(130%) brightness(220%) saturate(153%)')
      .style('opacity', () => getRandomOpacity()) // Set random opacity
      .attr('marker-end', 'url(#arrowhead)') // Add an arrowhead marker to the end of the link
      .attr('d', (d) => {
        // Use curve commands to create curved lines
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy); // Calculate the diagonal distance between source and target

        // Use 'M' to move to the source point, 'A' to draw an elliptical arc, and 'L' to draw a line to the target point
        const pathData = `
      M ${d.source.x},${d.source.y}
      A ${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}
      L ${d.target.x},${d.target.y}
    `;

        return pathData;
      });

    const updateLinks = () => {
      // Update the link selection

      const updatedLink = svg
        .selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .style('stroke', newColor)
        .style('stroke-width', () => getRandomWidth())

        .style('opacity', 0.02) // Set random opacity
        .attr('marker-end', 'url(#arrowhead)')
        .merge(link); // Merge the new and existing links

      updatedLink.attr('d', (d) => {
        // Use curve commands to create curved lines
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy); // Calculate the diagonal distance between source and target

        // Use 'M' to move to the source point, 'A' to draw an elliptical arc, and 'L' to draw a line to the target point
        const pathData = `
        M ${d.source.x},${d.source.y}
        A ${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}
        L ${d.target.x},${d.target.y}
      `;

        return pathData;
      });

      // Remove any extra links
      updatedLink.exit().remove();
    };

    // Update the angle labels

    function getRandomColor() {
      const letters = '6789ABCDEF'; // Use higher range of letters
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    }

    function getRandomOpacity() {
      return Math.random() * 0.03 + 0.45; // Random opacity between 0.5 and 1
    }

    const node = svg
      .selectAll('.node')
      .data(nodes)
      .call(drag) // Enable dragging on the nodes
      .enter()
      .append('circle') // Create circles instead of groups
      .attr('width', 0) // Set the width of the square
      .attr('height', 0) // Set the height of the square
      .call(drag) // Enable dragging on the nodes
      .attr('class', 'node')
      .style('opacity', () => getRandomOpacity())
      .style('filter', 'blur(48px) contrast(130%) brightness(120%) saturate(153%)')
      .style('fill', () => (activeButton === 'randomColor' ? getRandomColor() : getRandomColor2())) // Set random fill color
      .attr('r', () => Math.random() * 320 + 70); // Set the radius randomly

    const simulationCheckbox = document.getElementById('simulationCheckbox') as HTMLInputElement;

    // Add an event listener to the checkbox
    simulationCheckbox.addEventListener('change', function () {
      if (this.checked) {
        // Checkbox is checked, start or resume the simulation
        simulation.alphaTarget(0.43324).restart();
      } else {
        // Checkbox is unchecked, pause the simulation
        simulation.alphaTarget(0);
      }
    });

    return () => {
      simulation.stop();
    };
  }, [linkColor]);

  const handleDropdownChange = (keys: Set<string>) => {
    setSelected(keys);
    recolorLinks(true);
  };

  const [selected, setSelected] = React.useState<Set<string>>(new Set(['9']));

  const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);

  return (
    <NextUIProvider>
      <div>
        <Grid.Container gap={0.87} justify="flex-start">
          <Grid>
            <Button id="create" disabled={isLoading} auto color="gradient" shadow onClick={onCreate} size="md">
              {isLoading ? <Loading color="currentColor" size="sm" /> : 'Generate'}
            </Button>
          </Grid>

          <Grid>
            {' '}
            <Tooltip
              color="invert"
              shadow
              enterDelay={444}
              placement="bottom"
              content={'New gradient with new colours and proportions'}
            >
              <Button id="recolor2" bordered auto color="secondary" onPress={() => recolorLinks(false)} size="md">
                Recolour
              </Button>{' '}
            </Tooltip>
          </Grid>
          <Grid>
            <Tooltip
              enterDelay={444}
              color="invert"
              shadow
              placement="bottom"
              content={'One colour with different shades.'}
            >
              <Button id="recolor" bordered auto color="secondary" onPress={() => recolorLinks(true)} size="md">
                Single Hue
              </Button>{' '}
            </Tooltip>
          </Grid>
          <Card css={{ mw: '12px', align: "center", pt: "5px", opacity: '0.3' }}>
            <Grid>
                <Progress color="gradient" size="xl" animated={true} value={1} max={1} />{' '}
            </Grid>
          </Card>

          <Grid>
            {' '}
            <Tooltip color="invert" enterDelay={444} placement="bottom" content={'Change proportion of colours '}>
              <Button light id="randomize-zindex" auto  color="secondary" onPress={randomizeZIndex} size="md">
                Swap
              </Button>{' '}
            </Tooltip>
          </Grid>

          <Grid>
            <Tooltip
              enterDelay={944}
              color="invert"
              shadow
              placement="bottom"
              content={'Number of blocks for gradient. The higher the number, the more different shades you will get.'}
            >
              <Dropdown>
                <Dropdown.Button light color="secondary" css={{ tt: 'capitalize' }}>
                  {selectedValue}
                </Dropdown.Button>
                <Dropdown.Menu
                  variant="shadow"
                  aria-label="Choose the complexity"
                  color="secondary"
                  selectionMode="single"
                  selectedKeys={selected}
                  onSelectionChange={handleDropdownChange}
                >
                  <Dropdown.Item key="6" icon={<CopyDocumentIcon2 size={22} fill="var(--nextui-colors-secondary)" />}>
                    6
                  </Dropdown.Item>
                  <Dropdown.Item key="9" icon={<CopyDocumentIcon2 size={22} fill="var(--nextui-colors-secondary)" />}>
                    9
                  </Dropdown.Item>
                  <Dropdown.Item
                    description="Low Performance!"
                    key="14"
                    icon={<CopyDocumentIcon size={22} fill="var(--nextui-colors-secondary)" />}
                  >
                    14
                  </Dropdown.Item>
                  <Dropdown.Item
                    color="error"
                    description="Low Performance!"
                    key="18"
                    icon={<CopyDocumentIcon size={22} fill="var(--nextui-colors-secondary)" />}
                  >
                    18
                  </Dropdown.Item>
                  <Dropdown.Item
                    color="error"
                    description="Low Performance!"
                    key="26"
                    icon={<CopyDocumentIcon size={22} fill="var(--nextui-colors-secondary)" />}
                  >
                    26
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Tooltip>
          </Grid>
          <Grid xs={0.34}>
            <Tooltip enterDelay={444} color="invert" shadow placement="bottom" content={'Gradient auto animation.'}>
              <input
                type="checkbox"
                id="simulationCheckbox"
                checked={simulationChecked} // Set the checked state of the checkbox
                onChange={(e) => setSimulationChecked(e.target.checked)} // Update the checked state based on user interaction
              />

              <Spacer y={0.1} />
              <label style={{ marginTop: 8, marginLeft: -16 }} htmlFor="simulationCheckbox">
                Dynamic
              </label>
            </Tooltip>
          </Grid>
        </Grid.Container>

        <div id="scaled-element" ref={svgRef}></div>
      </div>
    </NextUIProvider>
  );
}

export default App;
