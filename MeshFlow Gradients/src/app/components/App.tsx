import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
const html2canvas = require('html2canvas');
import { NextUIProvider } from '@nextui-org/react';
import { Button, Loading } from '@nextui-org/react';
import { Grid } from '@nextui-org/react';
import { Dropdown } from '@nextui-org/react';
import { CopyDocumentIcon } from './CopyDocumentIcon';
import { CopyDocumentIcon2 } from './CopyDocumentIcon33';
import { Tooltip, Progress, Card } from '@nextui-org/react';

function App() {
  const [capturedDataURL, setCapturedDataURL] = useState(null); // State variable to store the captured data URL
  const svgRef = useRef(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const [linkColor, setLinkColor] = useState('#065372'); // State variable to keep track of the link color
  const [simulationChecked, setSimulationChecked] = useState(false); // State variable to track checkbox checked state
  const [isLoading, setIsLoading] = useState(false); // State variable to track the loading state
  const [activeButton, setActiveButton] = useState('randomColor'); // Default value can be 'randomColor'
  const [customColor, setCustomColor] = useState('#000000');
  const [regenerationTrigger, setRegenerationTrigger] = useState(0);
  const simulationRef = useRef<any>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set(['9']));
  const [selectedSize, setSelectedSize] = React.useState<Set<string>>(new Set(['X-Large']));
  const [selectedBlur, setSelectedBlur] = React.useState<Set<string>>(new Set(['High']));
  const [selectedDepth, setSelectedDepth] = React.useState<Set<string>>(new Set(['original']));
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [contextSubmenu, setContextSubmenu] = useState<{ type: 'size' | 'blocks' | 'blur' | 'depth'; x: number; y: number } | null>(null);

  const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);
  const selectedSizeValue = React.useMemo(() => Array.from(selectedSize).join(', ').replaceAll('_', ' '), [selectedSize]);
  const selectedBlurValue = React.useMemo(() => Array.from(selectedBlur).join(', ').replaceAll('_', ' '), [selectedBlur]);
  const selectedDepthValue = React.useMemo(() => {
    const key = Array.from(selectedDepth)[0];
    if (key === 'large-front') return 'Big front';
    if (key === 'small-front') return 'Small front';
    if (key === 'random') return 'Random';
    return 'Original';
  }, [selectedDepth]);

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

  function getShadeOfColor(baseColor: string) {
    const c = d3.hsl(baseColor);
    c.l = Math.random() * 0.4 + 0.3; // Random lightness between 0.3 and 0.7
    return c.toString();
  }

  const getGradientPair = (baseColor: string) => {
    const c = d3.hsl(baseColor);
    const start = d3.hsl(c.h, c.s, Math.min(0.9, c.l + 0.15));
    const end = d3.hsl((c.h + 60) % 360, c.s, Math.max(0.3, c.l - 0.1));
    return { start, end };
  };

  function getRandomOpacity() {
    return Math.random() * 0.03 + 0.45; // Random opacity between 0.5 and 1
  }

  function getRandomWidth2() {
    return Math.random() * 1645.9 + 434.1; // Random width between 0.1 and 500
  }

  function getRandomWidth() {
    return Math.random() * getRandomWidth2() + 1; // Random width between 1 and 6
  }

  const recolorLinks = (trfk) => {
    const newColor = trfk ? getRandomColor2() : getRandomColor();
    setActiveButton(trfk ? 'randomColor2' : 'randomColor');
    setLinkColor(newColor);
    setRegenerationTrigger(prev => prev + 1);
    setSimulationChecked(false);
  };

  const setGradientMode = () => {
    setActiveButton('gradient');
    setSimulationChecked(false);
  };

  const randomFromArray = (options: string[]) =>
    options[Math.floor(Math.random() * options.length)];

  const randomizeAll = () => {
    const sizeOptions = ['Small', 'Medium', 'Large', 'X-Large', 'Huge'];
    const blockOptions = ['6', '9', '14', '18', '26'];
    const blurOptions = ['Low', 'Medium', 'High', 'Ultra'];
    const depthOptions = ['original', 'large-front', 'small-front', 'random'];

    const randomSize = randomFromArray(sizeOptions);
    setSelectedSize(new Set([randomSize]));

    const randomBlocks = randomFromArray(blockOptions);
    setSelected(new Set([randomBlocks]));

    const randomBlur = randomFromArray(blurOptions);
    setSelectedBlur(new Set([randomBlur]));

    const randomDepth = randomFromArray(depthOptions);
    setSelectedDepth(new Set([randomDepth]));
    applyDepthMode(randomDepth);

    const useSingleHue = Math.random() < 0.5;
    recolorLinks(useSingleHue);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setActiveButton('customColor');
    setLinkColor(color);
    setSimulationChecked(false);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextSubmenu(null);
  };

  const closeContextMenu = () => {
    if (contextMenuPosition || contextSubmenu) {
      setContextMenuPosition(null);
      setContextSubmenu(null);
    }
  };

  const openSubmenu = (type, x: number, y: number) => {
    setContextSubmenu({
      type,
      x,
      y,
    });
  };

  const handleContextAction = (action: string) => {
    if (action === 'generate') {
      onCreate();
    } else if (action === 'recolour') {
      recolorLinks(false);
    } else if (action === 'singleHue') {
      recolorLinks(true);
    } else if (action === 'sizeSmall') {
      setSelectedSize(new Set(['Small']));
    } else if (action === 'sizeMedium') {
      setSelectedSize(new Set(['Medium']));
    } else if (action === 'sizeLarge') {
      setSelectedSize(new Set(['Large']));
    } else if (action === 'sizeXLarge') {
      setSelectedSize(new Set(['X-Large']));
    } else if (action === 'sizeHuge') {
      setSelectedSize(new Set(['Huge']));
    } else if (action === 'blocks6') {
      setSelected(new Set(['6']));
    } else if (action === 'blocks9') {
      setSelected(new Set(['9']));
    } else if (action === 'blocks14') {
      setSelected(new Set(['14']));
    } else if (action === 'blocks18') {
      setSelected(new Set(['18']));
    } else if (action === 'blocks26') {
      setSelected(new Set(['26']));
    } else if (action === 'blurLow') {
      setSelectedBlur(new Set(['Low']));
    } else if (action === 'blurMedium') {
      setSelectedBlur(new Set(['Medium']));
    } else if (action === 'blurHigh') {
      setSelectedBlur(new Set(['High']));
    } else if (action === 'blurUltra') {
      setSelectedBlur(new Set(['Ultra']));
    } else if (action === 'pickColor') {
      if (colorInputRef.current) {
        colorInputRef.current.click();
      }
    } else if (action === 'gradient') {
      setGradientMode();
    } else if (action === 'depthOriginal') {
      setSelectedDepth(new Set(['original']));
      applyDepthMode('original');
    } else if (action === 'depthLargeFront') {
      setSelectedDepth(new Set(['large-front']));
      applyDepthMode('large-front');
    } else if (action === 'depthSmallFront') {
      setSelectedDepth(new Set(['small-front']));
      applyDepthMode('small-front');
    } else if (action === 'depthRandom') {
      setSelectedDepth(new Set(['random']));
      applyDepthMode('random');
    }
    setContextMenuPosition(null);
    setContextSubmenu(null);
  };

  const handleMainMenuAction = (key: React.Key) => {
    const k = String(key);
    if (!contextMenuPosition) {
      handleContextAction(k);
      return;
    }
    if (k === 'size-root') {
      openSubmenu('size', contextMenuPosition.x + 190, contextMenuPosition.y + 80);
      return;
    }
    if (k === 'blocks-root') {
      openSubmenu('blocks', contextMenuPosition.x + 190, contextMenuPosition.y + 120);
      return;
    }
    if (k === 'blur-root') {
      openSubmenu('blur', contextMenuPosition.x + 190, contextMenuPosition.y + 160);
      return;
    }
    if (k === 'depth-root') {
      openSubmenu('depth', contextMenuPosition.x + 190, contextMenuPosition.y + 200);
      return;
    }
    handleContextAction(k);
  };

  let capturedDataURLData = capturedDataURL;
  console.log(typeof capturedDataURLData);

  //let base64value = _base64ToUint8Array(base64Data);

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
                width: img.width, // Use captured image width
                height: img.height, // Use captured image height
              },
            },
            '*'
          );
        };
        img.onerror = function (error) {
          console.error('Failed to load captured image:', error);
          setIsLoading(false);
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

      const rect = svgElement.getBoundingClientRect();
      html2canvas(svgElement, {
        width: rect.width,
        height: rect.height,
        scrollX: 0,
        scrollY: 0,
        x: rect.left,
        y: rect.top,
        backgroundColor: null
      })
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
    const nodesSelection = svg.selectAll('.node');
    // @ts-ignore d3 selections have .nodes() at runtime
    const nodeArray: Element[] = nodesSelection.nodes ? nodesSelection.nodes() : Array.from(nodesSelection as any);
    if (!nodeArray || nodeArray.length === 0) {
      return;
    }
    nodeArray.sort(() => Math.random() - 0.5);
    nodeArray.forEach((node) => {
      d3.select(node).raise();
    });
  };

  const applyDepthMode = (mode: string) => {
    const svg = d3.select(svgRef.current);
    const nodesSelection = svg.selectAll('.node');
    // @ts-ignore d3 selections have .nodes() at runtime
    const nodeArray: Element[] = nodesSelection.nodes ? nodesSelection.nodes() : Array.from(nodesSelection as any);
    if (!nodeArray || nodeArray.length === 0) {
      return;
    }

    if (mode === 'random') {
      randomizeZIndex();
      return;
    }

    const sorted = [...nodeArray];

    if (mode === 'original') {
      sorted.sort((a, b) => {
        const aOrder = parseInt(a.getAttribute('data-order') || '0', 10);
        const bOrder = parseInt(b.getAttribute('data-order') || '0', 10);
        return aOrder - bOrder;
      });
    } else if (mode === 'large-front') {
      sorted.sort((a, b) => {
        const ra = parseFloat(a.getAttribute('r') || '0');
        const rb = parseFloat(b.getAttribute('r') || '0');
        return ra - rb; // small first, big last (top)
      });
    } else if (mode === 'small-front') {
      sorted.sort((a, b) => {
        const ra = parseFloat(a.getAttribute('r') || '0');
        const rb = parseFloat(b.getAttribute('r') || '0');
        return rb - ra; // big first, small last (top)
      });
    }

    sorted.forEach((node) => {
      d3.select(node).raise();
    });
  };

  const getNodeRadius = (sizeValue: string) => {
    switch (sizeValue) {
      case 'Small':
        return Math.random() * 80 + 20;
      case 'Medium':
        return Math.random() * 100 + 50;
      case 'Large':
        return Math.random() * 150 + 100;
      case 'X-Large':
        return Math.random() * 180 + 120;
      case 'Huge':
        return Math.random() * 220 + 150;
      default:
        return Math.random() * 260 + 90;
    }
  };

  const getBlurValues = (blurValue: string) => {
    switch (blurValue) {
      case 'Low':
        return { node: 'blur(24px)', link: 'blur(32px)' };
      case 'Medium':
        return { node: 'blur(48px)', link: 'blur(65px)' };
      case 'High':
        return { node: 'blur(72px)', link: 'blur(96px)' };
      case 'Ultra':
        return { node: 'blur(96px)', link: 'blur(128px)' };
      default:
        return { node: 'blur(48px)', link: 'blur(65px)' };
    }
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    d3.select(svgRef.current).selectAll('*').remove();

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

    const getTarget = (i, w, h) => {
      const locations = [
        { x: w * 0.2, y: h * 0.2 }, // Top-Left
        { x: w * 0.5, y: h * 0.2 }, // Top-Center
        { x: w * 0.8, y: h * 0.2 }, // Top-Right
        { x: w * 0.2, y: h * 0.5 }, // Left-Center
        { x: w * 0.5, y: h * 0.5 }, // Center
        { x: w * 0.8, y: h * 0.5 }, // Right-Center
        { x: w * 0.2, y: h * 0.8 }, // Bottom-Left
        { x: w * 0.5, y: h * 0.8 }, // Bottom-Center
        { x: w * 0.8, y: h * 0.8 }, // Bottom-Right
      ];
      return locations[i % 9];
    };

    const simulation = d3
      .forceSimulation(nodes)

      // 🔥 Smooth motion control
      .alphaDecay(0.015)          // slower cooling = smoother animation
      .velocityDecay(0.45)        // more inertia, less jitter

      // 🔗 Links feel elastic, not stiff
      .force(
        'link',
        d3.forceLink(links)
          .id(d => d.id)
          .distance(120)
          .strength(0.08)
      )

      // 🫧 Gentle repulsion instead of explosive charge
      .force(
        'charge',
        d3.forceManyBody()
          .strength(-20) // Negative value for repulsion, but small to allow floating
          .distanceMax(600)
      )

      // 🌊 Distribute nodes to 4 corners and center
      .force('x', d3.forceX((_, i) => getTarget(i, window.innerWidth, window.innerHeight).x).strength(0.03))
      .force('y', d3.forceY((_, i) => getTarget(i, window.innerWidth, window.innerHeight).y).strength(0.03))

      // 🧱 Soft collision bubble
      .force(
        'collision',
        d3.forceCollide()
          .radius(72)
          .strength(0.7)
          .iterations(2)
      )

      .on('tick', () => {
        updateLinks();
        node.attr('transform', d => `translate(${d.x}, ${d.y})`);
      });

    simulationRef.current = simulation;
    if (simulationChecked) {
       simulation.alphaTarget(0.43324).restart();
    } else {
       simulation.alphaTarget(0);
    }

    const drag = d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded);

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
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
      .style('filter', `${getBlurValues(selectedBlurValue).link} contrast(130%) brightness(220%) saturate(153%)`)
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
        .style('filter', `${getBlurValues(selectedBlurValue).link} contrast(130%) brightness(220%) saturate(153%)`)
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

    const xs = nodes.map((n) => n.x || 0);
    const minX = xs.length ? Math.min(...xs) : 0;
    const maxX = xs.length ? Math.max(...xs) : 1;
    const rangeX = maxX - minX || 1;
    const { start, end } = getGradientPair(linkColor);
    const gradientInterpolator = d3.interpolateHsl(start, end);

    const node = svg
      .selectAll('.node')
      .data(nodes)
      .call(drag)
      .enter()
      .append('circle')
      .attr('width', 0)
      .attr('height', 0)
      .call(drag)
      .attr('class', 'node')
      .attr('data-order', (_, i) => i)
      .style('opacity', () => getRandomOpacity())
      .style('filter', `${getBlurValues(selectedBlurValue).node} contrast(130%) brightness(120%) saturate(153%)`)
      .style('fill', (d: any) => {
        if (activeButton === 'customColor') {
          return getShadeOfColor(linkColor);
        }
        if (activeButton === 'gradient') {
          const t = ((d.x || 0) - minX) / rangeX;
          return gradientInterpolator(t);
        }
        return (activeButton === 'randomColor' ? getRandomColor() : getRandomColor2());
      })
      .attr('r', () => getNodeRadius(selectedSizeValue));

    return () => {
      simulation.stop();
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [selectedValue, regenerationTrigger]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    
    // Update links color
    svg.selectAll('.link')
      .style('stroke', linkColor);

    // Update nodes color
    const nodesSelection = svg.selectAll('.node');
    const xs: number[] = [];
    nodesSelection.each((d: any) => {
      xs.push(d.x || 0);
    });
    const minX = xs.length ? Math.min(...xs) : 0;
    const maxX = xs.length ? Math.max(...xs) : 1;
    const rangeX = maxX - minX || 1;
    const { start, end } = getGradientPair(linkColor);
    const gradientInterpolator = d3.interpolateHsl(start, end);
    nodesSelection
      .style('fill', (d: any) => {
        if (activeButton === 'customColor') {
          return getShadeOfColor(customColor);
        }
        if (activeButton === 'gradient') {
          const t = ((d.x || 0) - minX) / rangeX;
          return gradientInterpolator(t);
        }
        return (activeButton === 'randomColor' ? getRandomColor() : getRandomColor2());
      });
  }, [linkColor, activeButton, customColor]);

  useEffect(() => {
    // No simulation restart logic for blur changes as it doesn't affect physics
  }, [simulationChecked]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    
    const blurValues = getBlurValues(selectedBlurValue);
    
    // Update links blur
    svg.selectAll('.link')
      .style('filter', `${blurValues.link} contrast(130%) brightness(220%) saturate(153%)`);

    // Update nodes blur
    svg.selectAll('.node')
      .style('filter', `${blurValues.node} contrast(130%) brightness(120%) saturate(153%)`);
      
  }, [selectedBlurValue]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    
    // Smoothly transition node sizes
    svg.selectAll('.node')
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('r', () => getNodeRadius(selectedSizeValue));
      
    // Update simulation collision force to reflect new sizes
    if (simulationRef.current) {
      simulationRef.current.force(
        'collision',
        d3.forceCollide()
          .radius(72) // We might want to adjust this based on size too, but keeping it simple for now or dynamic
          .strength(0.7)
          .iterations(2)
      );
      simulationRef.current.alpha(0.3).restart();
    }
  }, [selectedSizeValue]);

  const handleDropdownChange = (keys: Set<string>) => {
    setSelected(keys);
    recolorLinks(true);
  };

  const handleSizeChange = (keys: Set<string>) => {
    setSelectedSize(keys);
    // Removed recolorLinks(true) to avoid triggering regeneration
  };

  const handleBlurChange = (keys: Set<string>) => {
    setSelectedBlur(keys);
  };

  const handleDepthChange = (keys: Set<string>) => {
    setSelectedDepth(keys);
    const mode = Array.from(keys)[0];
    if (mode) {
      applyDepthMode(String(mode));
    }
  };

  return (
    <NextUIProvider>
      <div
        style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
        onContextMenu={handleContextMenu}
        onClick={closeContextMenu}
      >
        <Grid.Container
          gap={0.6}
          justify="flex-start"
          alignItems="center"
          css={{
            position: 'relative',
            zIndex: 10,
            background: '#ffffff',
            padding: '6px 8px',
            width: '123%',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          }}
        >
          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}> </span>
              <Button
                id="create"
                disabled={isLoading}
                auto
                color="gradient"
                shadow={false}
                onClick={onCreate}
                size="xs"
              >
                {isLoading ? <Loading color="currentColor" size="xs" /> : 'Generate'}
              </Button>
            </div>
          </Grid>

          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}> </span>
              <Tooltip
                color="invert"
                shadow
                enterDelay={444}
                placement="bottom"
                content={'New gradient with new colours and proportions'}
              >
                <Button id="recolor2" bordered auto color="secondary" onPress={() => recolorLinks(false)} size="xs">
                  Recolour
                </Button>{' '}
              </Tooltip>
            </div>
          </Grid>
          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>Size</span>
              <Tooltip
                enterDelay={944}
                color="invert"
                shadow
                placement="bottom"
                content={'Size of the gradient blocks.'}
              >
                <Dropdown>
                  <Dropdown.Button light color="secondary" size="xs" css={{ tt: 'capitalize' }}>
                    {selectedSizeValue}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    variant="shadow"
                    aria-label="Choose the size"
                    color="secondary"
                    selectionMode="single"
                    selectedKeys={selectedSize}
                    onSelectionChange={handleSizeChange}
                  >
                    <Dropdown.Item key="Small">Small</Dropdown.Item>
                    <Dropdown.Item key="Medium">Medium</Dropdown.Item>
                    <Dropdown.Item key="Large">Large</Dropdown.Item>
                    <Dropdown.Item key="X-Large">X-Large</Dropdown.Item>
                    <Dropdown.Item key="Huge">Huge</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Tooltip>
            </div>
          </Grid>
          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>Colour mode</span>
              <Tooltip
                enterDelay={444}
                color="invert"
                shadow
                placement="bottom"
                content={'One colour with different shades.'}
              >
                <Button id="recolor" bordered auto color="secondary" onPress={() => recolorLinks(true)} size="xs">
                  Single Hue
                </Button>{' '}
              </Tooltip>
            </div>
          </Grid>
          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>Randomize</span>
              <Tooltip
                enterDelay={444}
                color="invert"
                shadow
                placement="bottom"
                content={'Randomize colour, size, blocks, depth and blur.'}
              >
                <Button light auto color="secondary" onPress={randomizeAll} size="xs">
                  Randomize
                </Button>{' '}
              </Tooltip>
            </div>
          </Grid>
          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>Colour</span>
              <Tooltip
                enterDelay={444}
                color="invert"
                shadow
                placement="bottom"
                content={'Pick a custom color'}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: customColor,
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    transform: 'translateZ(0)',
                    transition: 'transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.16s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      padding: 0,
                      margin: 0,
                    }}
                  />
                </div>
              </Tooltip>
            </div>
          </Grid>
          <Card css={{ mw: '10px', align: 'center', pt: '3px', opacity: '0.3', bs: 'none', bg: 'transparent' }}>
            <Grid>
              <Progress
                color="gradient"
                size="xs"
                animated={true}
                value={1}
                max={1}
                css={{ transform: 'rotate(90deg)', width: '16px' }}
              />{' '}
            </Grid>
          </Card>

          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>Depth</span>
              <Tooltip
                color="invert"
                enterDelay={444}
                placement="bottom"
                content={'Control which nodes appear in front or behind.'}
              >
                <Dropdown>
                  <Dropdown.Button light color="secondary" size="xs" css={{ tt: 'capitalize' }}>
                    {selectedDepthValue}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    variant="shadow"
                    aria-label="Choose depth mode"
                    color="secondary"
                    selectionMode="single"
                    selectedKeys={selectedDepth}
                    onSelectionChange={handleDepthChange}
                  >
                    <Dropdown.Item key="original">Original</Dropdown.Item>
                    <Dropdown.Item key="large-front">Big front</Dropdown.Item>
                    <Dropdown.Item key="small-front">Small front</Dropdown.Item>
                    <Dropdown.Item key="random">Random</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Tooltip>
            </div>
          </Grid>

          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>Blocks</span>
              <Tooltip
                enterDelay={944}
                color="invert"
                shadow
                placement="bottom"
                content={'Number of blocks for gradient. The higher the number, the more different shades you will get.'}
              >
                <Dropdown>
                  <Dropdown.Button light color="secondary" size="xs" css={{ tt: 'capitalize' }}>
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
                    <Dropdown.Item key="6" icon={<CopyDocumentIcon2 size={18} fill="var(--nextui-colors-secondary)" />}>
                      6
                    </Dropdown.Item>
                    <Dropdown.Item key="9" icon={<CopyDocumentIcon2 size={18} fill="var(--nextui-colors-secondary)" />}>
                      9
                    </Dropdown.Item>
                    <Dropdown.Item
                      description="Low Performance!"
                      key="14"
                      icon={<CopyDocumentIcon size={18} fill="var(--nextui-colors-secondary)" />}
                    >
                      14
                    </Dropdown.Item>
                    <Dropdown.Item
                      color="error"
                      description="Low Performance!"
                      key="18"
                      icon={<CopyDocumentIcon size={18} fill="var(--nextui-colors-secondary)" />}
                    >
                      18
                    </Dropdown.Item>
                    <Dropdown.Item
                      color="error"
                      description="Low Performance!"
                      key="26"
                      icon={<CopyDocumentIcon size={18} fill="var(--nextui-colors-secondary)" />}
                    >
                      26
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Tooltip>
            </div>
          </Grid>
          <Grid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>Blur</span>
              <Tooltip
                enterDelay={944}
                color="invert"
                shadow
                placement="bottom"
                content={'Adjust the blur intensity.'}
              >
                <Dropdown>
                  <Dropdown.Button light color="secondary" size="xs" css={{ tt: 'capitalize' }}>
                    {selectedBlurValue}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    variant="shadow"
                    aria-label="Choose the blur level"
                    color="secondary"
                    selectionMode="single"
                    selectedKeys={selectedBlur}
                    onSelectionChange={handleBlurChange}
                  >
                    <Dropdown.Item key="Low">Low</Dropdown.Item>
                    <Dropdown.Item key="Medium">Medium</Dropdown.Item>
                    <Dropdown.Item key="High">High</Dropdown.Item>
                    <Dropdown.Item key="Ultra">Ultra</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Tooltip>
            </div>
          </Grid>
        </Grid.Container>

        <div id="scaled-element" ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></div>

        {contextMenuPosition && (
          <Card
            isHoverable
            css={{
              position: 'fixed',
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              background: '#ffffff',
              borderRadius: 6,
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
              zIndex: 30,
              width: 190,
              border: '1px solid rgba(148, 163, 184, 0.5)',
              py: 2,
              px: 1,
            }}
          >
            <Grid.Container direction="column" gap={0.3}>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('generate')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Generate
                </Button>
              </Grid>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('recolour')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Recolour
                </Button>
              </Grid>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('singleHue')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Single Hue
                </Button>
              </Grid>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('pickColor')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Pick custom color…
                </Button>
              </Grid>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('depth-root')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Depth ▸
                </Button>
              </Grid>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('size-root')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Size ▸
                </Button>
              </Grid>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('blocks-root')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Blocks ▸
                </Button>
              </Grid>
              <Grid>
                <Button
                  light
                  auto
                  size="xs"
                  color="secondary"
                  onPress={() => handleMainMenuAction('blur-root')}
                  css={{
                    justifyContent: 'flex-start',
                    w: '100%',
                    h: '24px',
                    py: 0,
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#f1f5f9' },
                  }}
                >
                  Blur ▸
                </Button>
              </Grid>
            </Grid.Container>
          </Card>
        )}

        {contextSubmenu && (
          <Card
            isHoverable
            css={{
              position: 'fixed',
              top: contextSubmenu.y,
              left: contextSubmenu.x,
              background: '#ffffff',
              borderRadius: 6,
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
              zIndex: 31,
              width: 170,
              border: '1px solid rgba(148, 163, 184, 0.5)',
              py: 2,
              px: 1,
            }}
          >
            {contextSubmenu.type === 'size' && (
              <Grid.Container direction="column" gap={0.3}>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('sizeSmall')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Small
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('sizeMedium')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Medium
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('sizeLarge')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Large
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('sizeXLarge')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    X-Large
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('sizeHuge')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Huge
                  </Button>
                </Grid>
              </Grid.Container>
            )}
            {contextSubmenu.type === 'blocks' && (
              <Grid.Container direction="column" gap={0.3}>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blocks6')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    6 blocks
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blocks9')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    9 blocks
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blocks14')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    14 blocks
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blocks18')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    18 blocks
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blocks26')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    26 blocks
                  </Button>
                </Grid>
              </Grid.Container>
            )}
            {contextSubmenu.type === 'blur' && (
              <Grid.Container direction="column" gap={0.3}>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blurLow')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Blur: Low
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blurMedium')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Blur: Medium
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blurHigh')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Blur: High
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('blurUltra')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Blur: Ultra
                  </Button>
                </Grid>
              </Grid.Container>
            )}
            {contextSubmenu.type === 'depth' && (
              <Grid.Container direction="column" gap={0.3}>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('depthOriginal')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Original
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('depthLargeFront')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Big front
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('depthSmallFront')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Small front
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    light
                    auto
                    size="xs"
                    color="secondary"
                    onPress={() => handleContextAction('depthRandom')}
                    css={{
                      justifyContent: 'flex-start',
                      w: '100%',
                      h: '24px',
                      py: 0,
                      fontSize: '12px',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    Random
                  </Button>
                </Grid>
              </Grid.Container>
            )}
          </Card>
        )}
      </div>
    </NextUIProvider>
  );
}

export default App;
