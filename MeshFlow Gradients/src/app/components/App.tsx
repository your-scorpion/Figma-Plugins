import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NextUIProvider } from '@nextui-org/react';
import { Button, Loading } from '@nextui-org/react';
import { Grid } from '@nextui-org/react';
import { Dropdown } from '@nextui-org/react';
import { CopyDocumentIcon } from './CopyDocumentIcon';
import { CopyDocumentIcon2 } from './CopyDocumentIcon33';
import { Tooltip, Progress, Card } from '@nextui-org/react';

type MeshNode = d3.SimulationNodeDatum & {
  id: string;
  label: string;
  x: number;
  y: number;
};

type MeshLink = d3.SimulationLinkDatum<MeshNode> & {
  id: string;
  source: string | MeshNode;
  target: string | MeshNode;
};

type NodeStyle = {
  id: string;
  radius: number;
  opacity: number;
  fill: string;
  order: number;
};

type LinkStyle = {
  id: string;
  width: number;
  opacity: number;
  stroke: string;
};

type MeshScene = {
  width: number;
  height: number;
  nodes: MeshNode[];
  links: MeshLink[];
  nodeStyles: Map<string, NodeStyle>;
  linkStyles: Map<string, LinkStyle>;
  drawOrder: string[];
};

type MeshSettings = {
  linkColor: string;
  customColor: string;
  activeButton: string;
  selectedBlurValue: string;
  selectedSizeValue: string;
  selectedDepthValue: string;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const [linkColor, setLinkColor] = useState('#065372'); // State variable to keep track of the link color
  const [simulationChecked, setSimulationChecked] = useState(false); // State variable to track checkbox checked state
  const [isLoading, setIsLoading] = useState(false); // State variable to track the loading state
  const [activeButton, setActiveButton] = useState('randomColor'); // Default value can be 'randomColor'
  const [customColor, setCustomColor] = useState('#000000');
  const [regenerationTrigger, setRegenerationTrigger] = useState(0);
  const simulationRef = useRef<any>(null);
  const sceneRef = useRef<MeshScene | null>(null);
  const dragStateRef = useRef<{ nodeId: string | null; pointerId: number | null }>({ nodeId: null, pointerId: null });
  const settingsRef = useRef<MeshSettings>({
    linkColor: '#065372',
    customColor: '#000000',
    activeButton: 'randomColor',
    selectedBlurValue: 'High',
    selectedSizeValue: 'X-Large',
    selectedDepthValue: 'Original',
  });
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
  const colorModeLabel = React.useMemo(() => {
    if (activeButton === 'randomColor2') return 'Single Hue';
    if (activeButton === 'gradient') return 'Gradient';
    if (activeButton === 'customColor') return 'Custom';
    return 'Random';
  }, [activeButton]);

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

  const handleColorModeChange = (keys: Set<string>) => {
    const keysSet = keys instanceof Set ? keys : new Set(Array.isArray(keys) ? keys : []);
    const mode = Array.from(keysSet)[0];

    if (mode === 'randomColor') {
      recolorLinks(false);
      return;
    }

    if (mode === 'randomColor2') {
      recolorLinks(true);
      return;
    }

    if (mode === 'gradient') {
      setGradientMode();
      return;
    }

    if (mode === 'customColor') {
      setActiveButton('customColor');
      setLinkColor(customColor);
      setSimulationChecked(false);
      colorInputRef.current?.click();
    }
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

  const onCreate = () => {
    setIsLoading(true);

    const count = 1;
    captureGraph()
      .then(function (captureResult: any) {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'create-rectangles',
              count,
              capturedDataURLData: captureResult.dataURL,
              width: captureResult.width,
              height: captureResult.height,
            },
          },
          '*'
        );

        setIsLoading(false);
      })
      .catch(function (error) {
        console.error('An error occurred during graph capture:', error);
        setIsLoading(false);
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

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }

    return canvas.getContext('2d');
  };

  const updateCanvasSize = (width: number, height: number) => {
    const canvas = canvasRef.current;
    const context = getCanvasContext();
    if (!canvas || !context) {
      return null;
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const pixelWidth = Math.floor(width * devicePixelRatio);
    const pixelHeight = Math.floor(height * devicePixelRatio);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    return context;
  };

  const resolveLinkNode = (endpoint: string | MeshNode, nodesById: Map<string, MeshNode>) => {
    if (typeof endpoint === 'string') {
      return nodesById.get(endpoint) || null;
    }

    return endpoint;
  };

  const drawScene = () => {
    const scene = sceneRef.current;
    const settings = settingsRef.current;
    if (!scene) {
      return;
    }

    const context = updateCanvasSize(scene.width, scene.height);
    if (!context) {
      return;
    }

    const blurValues = getBlurValues(settings.selectedBlurValue);
    const nodesById = new Map(scene.nodes.map((node) => [node.id, node]));

    context.clearRect(0, 0, scene.width, scene.height);
    context.fillStyle = '#E9E3FF';
    context.fillRect(0, 0, scene.width, scene.height);

    context.save();
    context.filter = `${blurValues.link} contrast(130%) brightness(220%) saturate(153%)`;
    scene.links.forEach((link) => {
      const sourceNode = resolveLinkNode(link.source, nodesById);
      const targetNode = resolveLinkNode(link.target, nodesById);
      const style = scene.linkStyles.get(link.id);
      if (!sourceNode || !targetNode || !style) {
        return;
      }

      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const distance = Math.hypot(dx, dy) || 1;
      const midpointX = (sourceNode.x + targetNode.x) / 2;
      const midpointY = (sourceNode.y + targetNode.y) / 2;
      const normalX = -dy / distance;
      const normalY = dx / distance;
      const curveOffset = Math.min(120, distance * 0.2);

      context.beginPath();
      context.moveTo(sourceNode.x, sourceNode.y);
      context.quadraticCurveTo(
        midpointX + normalX * curveOffset,
        midpointY + normalY * curveOffset,
        targetNode.x,
        targetNode.y
      );
      context.globalAlpha = style.opacity;
      context.lineWidth = style.width;
      context.strokeStyle = style.stroke;
      context.stroke();
    });
    context.restore();

    context.save();
    context.filter = `${blurValues.node} contrast(130%) brightness(120%) saturate(153%)`;
    const orderedIds = scene.drawOrder.length ? scene.drawOrder : scene.nodes.map((node) => node.id);
    orderedIds.forEach((nodeId) => {
      const node = nodesById.get(nodeId);
      const style = scene.nodeStyles.get(nodeId);
      if (!node || !style) {
        return;
      }

      context.beginPath();
      context.arc(node.x, node.y, style.radius, 0, Math.PI * 2);
      context.globalAlpha = style.opacity;
      context.fillStyle = style.fill;
      context.fill();
    });
    context.restore();
    context.globalAlpha = 1;
  };

  const syncNodeColors = () => {
    const scene = sceneRef.current;
    const settings = settingsRef.current;
    if (!scene) {
      return;
    }

    const xs = scene.nodes.map((node) => node.x || 0);
    const minX = xs.length ? Math.min(...xs) : 0;
    const maxX = xs.length ? Math.max(...xs) : 1;
    const rangeX = maxX - minX || 1;
    const { start, end } = getGradientPair(settings.linkColor);
    const gradientInterpolator = d3.interpolateHsl(start, end);

    scene.nodes.forEach((node) => {
      const style = scene.nodeStyles.get(node.id);
      if (!style) {
        return;
      }

      if (settings.activeButton === 'customColor') {
        style.fill = getShadeOfColor(settings.customColor);
        return;
      }

      if (settings.activeButton === 'gradient') {
        const t = ((node.x || 0) - minX) / rangeX;
        style.fill = gradientInterpolator(t);
        return;
      }

      style.fill = settings.activeButton === 'randomColor' ? getRandomColor() : getRandomColor2();
    });

    scene.links.forEach((link) => {
      const style = scene.linkStyles.get(link.id);
      if (style) {
        style.stroke = settings.linkColor;
      }
    });
  };

  const randomizeZIndex = () => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    scene.drawOrder = [...scene.drawOrder].sort(() => Math.random() - 0.5);
    drawScene();
  };

  const applyDepthMode = (mode: string) => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    if (mode === 'random') {
      randomizeZIndex();
      return;
    }

    const orderedNodes = [...scene.nodes];
    if (mode === 'original') {
      orderedNodes.sort((leftNode, rightNode) => {
        const leftStyle = scene.nodeStyles.get(leftNode.id);
        const rightStyle = scene.nodeStyles.get(rightNode.id);
        return (leftStyle?.order || 0) - (rightStyle?.order || 0);
      });
    } else if (mode === 'large-front') {
      orderedNodes.sort((leftNode, rightNode) => {
        const leftStyle = scene.nodeStyles.get(leftNode.id);
        const rightStyle = scene.nodeStyles.get(rightNode.id);
        return (leftStyle?.radius || 0) - (rightStyle?.radius || 0);
      });
    } else if (mode === 'small-front') {
      orderedNodes.sort((leftNode, rightNode) => {
        const leftStyle = scene.nodeStyles.get(leftNode.id);
        const rightStyle = scene.nodeStyles.get(rightNode.id);
        return (rightStyle?.radius || 0) - (leftStyle?.radius || 0);
      });
    }

    scene.drawOrder = orderedNodes.map((node) => node.id);
    drawScene();
  };

  const captureGraph = () => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const scene = sceneRef.current;
      if (!canvas) {
        reject(new Error('Canvas element not found'));
        return;
      }
      if (!scene) {
        reject(new Error('Scene is not ready'));
        return;
      }

      const exportCanvas = document.createElement('canvas');
      const exportScale = 2;
      exportCanvas.width = Math.max(1, Math.floor(scene.width * exportScale));
      exportCanvas.height = Math.max(1, Math.floor(scene.height * exportScale));
      const context = exportCanvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas context not available'));
        return;
      }

      context.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
      const dataURL = exportCanvas.toDataURL('image/png');
      resolve({
        dataURL,
        width: scene.width,
        height: scene.height,
      });
    });
  };

  const buildSparseLinks = (nodes: MeshNode[]) => {
    const links: MeshLink[] = [];
    if (nodes.length < 2) {
      return links;
    }

    const linkIds = new Set<string>();
    const delaunay = d3.Delaunay.from(nodes, (node) => node.x, (node) => node.y);
    const neighborLimit = nodes.length >= 18 ? 3 : 2;

    const addLink = (sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) {
        return;
      }

      const [leftIndex, rightIndex] = sourceIndex < targetIndex
        ? [sourceIndex, targetIndex]
        : [targetIndex, sourceIndex];
      const linkId = `${nodes[leftIndex].id}:${nodes[rightIndex].id}`;
      if (linkIds.has(linkId)) {
        return;
      }

      linkIds.add(linkId);
      links.push({
        id: linkId,
        source: nodes[leftIndex].id,
        target: nodes[rightIndex].id,
      });
    };

    nodes.forEach((_node, index) => {
      addLink(index, (index + 1) % nodes.length);
      const neighbors = (Array.from(delaunay.neighbors(index)) as number[])
        .sort((leftIndex, rightIndex) => {
          const leftNode = nodes[leftIndex];
          const rightNode = nodes[rightIndex];
          const centerNode = nodes[index];
          const leftDistance = Math.hypot(centerNode.x - leftNode.x, centerNode.y - leftNode.y);
          const rightDistance = Math.hypot(centerNode.x - rightNode.x, centerNode.y - rightNode.y);
          return leftDistance - rightDistance;
        })
        .slice(0, neighborLimit);

      neighbors.forEach((neighborIndex) => {
        addLink(index, neighborIndex);
      });
    });

    return links;
  };

  useEffect(() => {
    settingsRef.current = {
      linkColor,
      customColor,
      activeButton,
      selectedBlurValue,
      selectedSizeValue,
      selectedDepthValue,
    };
  }, [linkColor, customColor, activeButton, selectedBlurValue, selectedSizeValue, selectedDepthValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const numNodes = parseInt(selectedValue, 10);
    const nodes: MeshNode[] = Array.from({ length: numNodes }, (_, index) => ({
      id: `node${index + 1}`,
      x: Math.random() * width,
      y: Math.random() * height,
      label: `Node ${index + 1}`,
    }));

    const links = buildSparseLinks(nodes);

    const nodeStyles = new Map<string, NodeStyle>(
      nodes.map((node, index) => [
        node.id,
        {
          id: node.id,
          radius: getNodeRadius(selectedSizeValue),
          opacity: getRandomOpacity(),
          fill: linkColor,
          order: index,
        },
      ])
    );

    const linkStyles = new Map<string, LinkStyle>(
      links.map((link) => [
        link.id,
        {
          id: link.id,
          width: getRandomWidth(),
          opacity: getRandomOpacity(),
          stroke: linkColor,
        },
      ])
    );

    sceneRef.current = {
      width,
      height,
      nodes,
      links,
      nodeStyles,
      linkStyles,
      drawOrder: nodes.map((node) => node.id),
    };

    syncNodeColors();
    applyDepthMode(Array.from(selectedDepth)[0] || 'original');

    const getTarget = (index: number, currentWidth: number, currentHeight: number) => {
      const locations = [
        { x: currentWidth * 0.2, y: currentHeight * 0.2 },
        { x: currentWidth * 0.5, y: currentHeight * 0.2 },
        { x: currentWidth * 0.8, y: currentHeight * 0.2 },
        { x: currentWidth * 0.2, y: currentHeight * 0.5 },
        { x: currentWidth * 0.5, y: currentHeight * 0.5 },
        { x: currentWidth * 0.8, y: currentHeight * 0.5 },
        { x: currentWidth * 0.2, y: currentHeight * 0.8 },
        { x: currentWidth * 0.5, y: currentHeight * 0.8 },
        { x: currentWidth * 0.8, y: currentHeight * 0.8 },
      ];
      return locations[index % 9];
    };

    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const simulation = d3
      .forceSimulation(nodes)
      .alphaDecay(0.015)
      .velocityDecay(0.45)
      .force(
        'link',
        d3.forceLink<MeshNode, MeshLink>(links)
          .id((node) => node.id)
          .distance(170)
          .strength(0.18)
      )
      .force(
        'charge',
        d3.forceManyBody<MeshNode>()
          .strength(-28)
          .distanceMax(600)
      )
      .force('x', d3.forceX<MeshNode>((_, index) => getTarget(index, width, height).x).strength(0.03))
      .force('y', d3.forceY<MeshNode>((_, index) => getTarget(index, width, height).y).strength(0.03))
      .force(
        'collision',
        d3.forceCollide<MeshNode>().radius((node) => (nodeStyles.get(node.id)?.radius || 72) * 0.62).strength(0.7).iterations(2)
      )
      .on('tick', () => {
        drawScene();
      });

    simulationRef.current = simulation;

    const getPointerPosition = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const findNodeAtPoint = (x: number, y: number) => {
      const scene = sceneRef.current;
      if (!scene) {
        return null;
      }

      const nodeMap = new Map(scene.nodes.map((node) => [node.id, node]));
      const hitOrder = [...scene.drawOrder].reverse();
      for (const nodeId of hitOrder) {
        const node = nodeMap.get(nodeId);
        const style = scene.nodeStyles.get(nodeId);
        if (!node || !style) {
          continue;
        }

        if (Math.hypot(x - node.x, y - node.y) <= style.radius) {
          return node;
        }
      }

      return null;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const pointer = getPointerPosition(event);
      const node = findNodeAtPoint(pointer.x, pointer.y);
      if (!node) {
        return;
      }

      dragStateRef.current = { nodeId: node.id, pointerId: event.pointerId };
      node.fx = pointer.x;
      node.fy = pointer.y;
      canvas.setPointerCapture(event.pointerId);
      simulation.alphaTarget(0.3).restart();
      setSimulationChecked(false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const { nodeId, pointerId } = dragStateRef.current;
      if (!nodeId || pointerId !== event.pointerId) {
        return;
      }

      const scene = sceneRef.current;
      if (!scene) {
        return;
      }

      const node = scene.nodes.find((entry) => entry.id === nodeId);
      if (!node) {
        return;
      }

      const pointer = getPointerPosition(event);
      node.fx = pointer.x;
      node.fy = pointer.y;
      drawScene();
    };

    const releasePointer = (event: PointerEvent) => {
      const { nodeId, pointerId } = dragStateRef.current;
      if (!nodeId || pointerId !== event.pointerId) {
        return;
      }

      const scene = sceneRef.current;
      const node = scene?.nodes.find((entry) => entry.id === nodeId);
      if (node) {
        node.fx = null;
        node.fy = null;
      }

      dragStateRef.current = { nodeId: null, pointerId: null };
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      simulation.alphaTarget(0);
    };

    canvas.style.cursor = 'all-scroll';
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', releasePointer);
    canvas.addEventListener('pointerleave', releasePointer);

    if (simulationChecked) {
      simulation.alphaTarget(0.43324).restart();
    } else {
      simulation.alphaTarget(0);
    }

    drawScene();

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', releasePointer);
      canvas.removeEventListener('pointerleave', releasePointer);
      simulation.stop();
    };
  }, [selectedValue, regenerationTrigger]);

  useEffect(() => {
    settingsRef.current = {
      ...settingsRef.current,
      linkColor,
      activeButton,
      customColor,
    };
    syncNodeColors();
    drawScene();
  }, [linkColor, activeButton, customColor]);

  useEffect(() => {
    settingsRef.current = {
      ...settingsRef.current,
      selectedBlurValue,
    };
    drawScene();
  }, [selectedBlurValue]);

  useEffect(() => {
    settingsRef.current = {
      ...settingsRef.current,
      selectedSizeValue,
    };

    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    scene.nodes.forEach((node) => {
      const style = scene.nodeStyles.get(node.id);
      if (style) {
        style.radius = getNodeRadius(selectedSizeValue);
      }
    });

    if (simulationRef.current) {
      simulationRef.current.force(
        'collision',
        d3.forceCollide<MeshNode>().radius((node) => (scene.nodeStyles.get(node.id)?.radius || 72) * 0.62).strength(0.7).iterations(2)
      );
      simulationRef.current.alpha(0.3).restart();
    }

    applyDepthMode(Array.from(selectedDepth)[0] || 'original');
  }, [selectedSizeValue, selectedDepth]);

  const handleDropdownChange = (keys: Set<string>) => {
    const keysSet = keys instanceof Set ? keys : new Set(Array.isArray(keys) ? keys : []);
    setSelected(keysSet);
    recolorLinks(true);
  };

  const handleSizeChange = (keys: Set<string>) => {
    const keysSet = keys instanceof Set ? keys : new Set(Array.isArray(keys) ? keys : []);
    setSelectedSize(keysSet);
  };

  const handleBlurChange = (keys: Set<string>) => {
    const keysSet = keys instanceof Set ? keys : new Set(Array.isArray(keys) ? keys : []);
    setSelectedBlur(keysSet);
  };

  const handleDepthChange = (keys: Set<string>) => {
    const keysSet = keys instanceof Set ? keys : new Set(Array.isArray(keys) ? keys : []);
    setSelectedDepth(keysSet);
    const mode = Array.from(keysSet)[0];
    if (mode) {
      settingsRef.current = {
        ...settingsRef.current,
        selectedDepthValue: String(mode),
      };
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
                      onSelectionChange={handleSizeChange as any}
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 6px',
                  borderRadius: 999,
                  border: '1px solid rgba(148, 163, 184, 0.28)',
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.06)',
                }}
              >
                <Tooltip
                  enterDelay={444}
                  color="invert"
                  shadow
                  placement="bottom"
                  content={'Switch between random, single-hue, gradient and custom colour modes.'}
                >
                  <Dropdown>
                    <Dropdown.Button light color="secondary" size="xs" css={{ tt: 'capitalize', minWidth: '112px' }}>
                      {colorModeLabel}
                    </Dropdown.Button>
                    <Dropdown.Menu
                      variant="shadow"
                      aria-label="Choose the colour mode"
                      color="secondary"
                      selectionMode="single"
                      selectedKeys={new Set([activeButton])}
                      onSelectionChange={handleColorModeChange as any}
                    >
                      <Dropdown.Item key="randomColor">Random</Dropdown.Item>
                      <Dropdown.Item key="randomColor2">Single Hue</Dropdown.Item>
                      <Dropdown.Item key="gradient">Gradient</Dropdown.Item>
                      <Dropdown.Item key="customColor">Custom</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Tooltip>

                <Tooltip
                  enterDelay={444}
                  color="invert"
                  shadow
                  placement="bottom"
                  content={activeButton === 'customColor' ? 'Custom colour is active.' : 'Pick a custom colour and switch to Custom mode.'}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: customColor,
                      border: activeButton === 'customColor' ? '2px solid #4338ca' : '2px solid #ffffff',
                      boxShadow: activeButton === 'customColor'
                        ? '0 0 0 3px rgba(67, 56, 202, 0.16), 0 2px 8px rgba(0,0,0,0.12)'
                        : '0 2px 8px rgba(0,0,0,0.12)',
                      cursor: 'pointer',
                      transform: 'translateZ(0)',
                      transition: 'transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.16s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      setActiveButton('customColor');
                      setLinkColor(customColor);
                      setSimulationChecked(false);
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
                      onSelectionChange={handleDepthChange as any}
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
                      onSelectionChange={handleDropdownChange as any}
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
                      onSelectionChange={handleBlurChange as any}
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

        <canvas id="scaled-element" ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

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
