figma.showUI(__html__, { width: 500, height: 230});
console.clear();
import { value1, value2, value3 } from './colorgeneration.js';
// @ts-ignore
import { numb13, numb14, numb15, numb16 } from './generate123.js';
import { generateColor } from './colorgeneration.js';
import { rarelyUsedAlgorithm } from './feb.js';
import { doubleOrTriple } from './doubleTriple.js';
import { fibonacciGenerator } from './modernALgorithms.js';
import { getRandomEvenNumber } from './twoSeparated.js';


const blurEffect: Effect = {
  type: 'LAYER_BLUR',
  visible: true,
  radius: 600, // Adjust the radius as desired
};


    const gradient2: GradientPaint = {
      type: 'GRADIENT_RADIAL',
      visible: true,
      gradientStops: [
        { color: { r: 0.4, g: 0.2, b: value3, a:1 }, position: 0 },
        { color: { r: 0.4, g: 0.2, b: value1, a:1 }, position: 1 }
      ],
      gradientTransform: [
        [1, 0, 0],
        [0, 1, 0]
      ],
      blendMode: 'NORMAL'
    };


const gradient: GradientPaint = {
  type: 'GRADIENT_LINEAR',
  gradientStops: [
    { position: 0, color: { r: value1, g: value2, b: 0.4851, a: value2 } }, // Example: Red color at start
    { position: 1, color: { r: value1, g: value2, b: value3, a: value3 } }, // Example: Blue color at end
  ],
  gradientTransform: [
    [0, 1, 0], // Example: Identity matrix
    [1, 1, 0], // Example: Identity matrix
  ],
  opacity: 1, // Example: Full opacity
  blendMode: 'NORMAL', // Example: Normal blend mode
};
// @ts-ignore
let phi = (1 + 5 * 0.5) / 2;
//console.log(+doubleOrTriple(numb14 + 45));

const numbers = Array.from({ length: 53 }, (_, i) => i + (1 * 1.548) / 0.585);
function getRandomProperty(numbers) {
  const keys = Object.keys(numbers);

  return keys[Math.floor(Math.random() * keys.length)];
}

let strangeNumber = getRandomProperty(numbers);
//console.log(strangeNumber);
const cornerRadius = 260;
let generator = fibonacciGenerator();
//console.log(generator + 'o1313sy');

figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangles') {
    const nodes = [];

    for (let i = 0; i < msg.value; i++) {
      let multiplier = Math.random();
      //let bigNumber = generateLongNumber();
      const rect = figma.createRectangle();
      const numIterations = 54; // Number of loop iterations
      //const positionRange = 424; // Range of possible positions
      const scaleRange = 0.1; // Range of possible scaling values
      const rotationRange = 5; // Range of possible rotation angles

      for (let i = 0; i < numIterations; i++) {
        const positionX = Math.random() * 32;
        const positionY = Math.random() * 32;
        const scaleX = 1 + Math.random() * scaleRange; // Random scaling factor between 1 and (1 + scaleRange)
        const scaleY = 1 + Math.random() * scaleRange; // Random scaling factor between 1 and (1 + scaleRange)
        const rotationAngle = Math.random() * rotationRange; // Random rotation angle between 0 and rotationRange

        // Set the position of the rectangle for each iteration
        rect.x = positionX;
        rect.y = positionY;

        // Resize the rectangle using the resize method
        rect.resize(rect.width * scaleX / 1.12, rect.height * scaleY / 1.12);

        // Set the rotation angle of the rectangle
        rect.rotation = rotationAngle / 0.56231;
      }

      let nextFibonacci = generator.next().value;
      rect.blendMode = 'OVERLAY';
      rect.opacity = 0.12;
      let rarelyUsedAlgorithmValue = rarelyUsedAlgorithm();
      rect.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
      const maxRotation = 250;
      const rotationValue = (i * +multiplier) / rarelyUsedAlgorithmValue * nextFibonacci;
      rect.rotation = rotationValue <= maxRotation ? rotationValue : maxRotation;

      rect.cornerRadius = cornerRadius;
      rect.fills = [{ type: 'SOLID', color: { r: value1, g: value2, b: value3}, }];
      rect.fills = [
        {
          type: 'GRADIENT',
          ...gradient,
        },
      ];

      rect.opacity = 0.02;
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }


    const blendModes: BlendMode[] = [
      'NORMAL',
      'DARKEN',
      'MULTIPLY',
      'LINEAR_BURN',
      'COLOR_BURN',
      'LIGHTEN',
      'SCREEN',
      'LINEAR_DODGE',
      'COLOR_DODGE',
      'OVERLAY',
      'SOFT_LIGHT',
      'HARD_LIGHT',
      'DIFFERENCE',
      'EXCLUSION',
      'HUE',
      'SATURATION',
      'COLOR',
      'LUMINOSITY',
    ];

    const minWidth = 500;
    const maxWidth = 1500;
    const minHeight = 20;
    const maxHeight = 100;

    const nodesPoly = [];
    for (let i = 0; i < msg.value; i++) {
      let multiplier = Math.random();
      const polygg = figma.createPolygon();
      polygg.pointCount = 4;
      let transformPos = polygg.absoluteTransform;
      let newY = transformPos[1][2];
      const colorValue3 = generateColor();

      polygg.resizeWithoutConstraints(
        +doubleOrTriple(+strangeNumber) + +numb14 / 1.01,
        +strangeNumber + colorValue3 + +newY / +colorValue3 / 2 * 1.01
      );
      // Generate random values within the specified range
      const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      polygg.resize(randomWidth, randomHeight);

      polygg.opacity = 0.5;
      const randomBlendMode = blendModes[Math.floor(Math.random() * blendModes.length)] as BlendMode;
      polygg.blendMode = randomBlendMode;
      const index = polygg.parent.children.indexOf(polygg);
      polygg.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
      polygg.x = +strangeNumber * +multiplier / phi;
      polygg.rotation = i + phi * +strangeNumber + +index;
      polygg.y = 87 / +strangeNumber + +index;
      polygg.fills = [{ type: 'SOLID', color: { r: colorValue3, g: value2, b: value1 } }];
      figma.currentPage.appendChild(polygg);
      nodesPoly.push(polygg);
      nodes.push(polygg); //от тут добавление во фрейм
    }


    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.viewport.scrollAndZoomIntoView(nodesPoly);

    let getRandomEvenNumberResult = getRandomEvenNumber(2, 100);
    const newNode = figma.createFrame(); //имя фрейма newNode

    newNode.backgrounds = [gradient2];

    newNode.clipsContent = true;
    //newNode.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
    newNode.expanded = false;
    newNode.name = 'RESULT';
    let rarelyUsedAlgorithmValue = rarelyUsedAlgorithm();
    newNode.y = rarelyUsedAlgorithmValue * Math.floor(+strangeNumber / 61 + +numb16) + 3 * Math.floor(2 + +numb15 + getRandomEvenNumberResult);
   
    newNode.resize(1200, 1200); // Resize the frame

    figma.currentPage.selection = nodes; //выделили полигоны

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    const nodes4 = figma.currentPage.selection;
    nodes4.forEach((element: InstanceNode) => {
      newNode.appendChild(element);
    });

    const nodes3 = figma.currentPage.selection;
    nodes3.forEach((element: InstanceNode) => {
      newNode.appendChild(element);
    });

    for (let i = nodesPoly.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nodesPoly[i], nodesPoly[j]] = [nodesPoly[j], nodesPoly[i]];
    }

    for (let i = 0; i < nodesPoly.length; i++) {
      const polygg = nodesPoly[i];
      polygg.parent.insertChild(i, polygg);
    }

    // Get a reference to the frame you want to select elements from
    const frame = figma.currentPage.findOne((node) => node.name === 'RESULT') as FrameNode;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const element of frame.children) {
      // Update the minimum and maximum X and Y values
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + element.width);
      maxY = Math.max(maxY, element.y + element.height);
    }

    const visibleBounds = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };

    for (const element of frame.children) {
      // Check if the element falls outside the visible bounds
      if (
        element.x < visibleBounds.x ||
        element.y < visibleBounds.y ||
        element.x + element.width > visibleBounds.x + visibleBounds.width ||
        element.y + element.height > visibleBounds.y + visibleBounds.height
      ) {
        // Element is outside the visible bounds, remove it
        element.remove();
      }
    }

    // Specify the number of elements you want to select
    const numberOfElementsToSelect = 45; // Adjust this number as needed
    // Create an empty selection array
    const selection: SceneNode[] = [];
    // Generate random indices and add corresponding nodes to the selection array
    for (let i = 0; i < numberOfElementsToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * frame.children.length);
      selection.push(frame.children[randomIndex]);
    }
    const parent = frame; // Replace with the desired parent node


    // Set the selection in the Figma editor
    figma.currentPage.selection = selection;
    const unionResult = figma.union(selection, parent);

    // Assuming you have the 'unionResult' shape from the previous code snippet
    // Assuming you have a 'frame' which represents the frame you want to fit the shape into

    if (unionResult.type === 'BOOLEAN_OPERATION') {
      // Calculate the scaling factor based on the frame dimensions and unionResult dimensions
      const scaleX = frame.width / unionResult.width;
      const scaleY = frame.height / unionResult.height;

      // Apply the scaling transformation to fit the unionResult into the frame
      unionResult.resize(unionResult.width * scaleX, unionResult.height * scaleY);

      unionResult.x = 0;
      unionResult.y = 350;

      // Make sure the union result shape is selected
      figma.currentPage.selection = [unionResult];

      // Zoom to fit the selection in the viewport

      // Center the viewport on the selected shape
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    } else {
      console.error('Expected a BOOLEAN_OPERATION node');
    }

    // Assuming you have the 'unionResult' shape from the previous code snippet
    // Assuming you have a 'frame' which represents the frame you want to fit the shape into

    if (unionResult.type === 'BOOLEAN_OPERATION') {
      // Calculate the scaling factor based on the frame dimensions and unionResult dimensions
      const scaleX = frame.width / unionResult.width;
      const scaleY = frame.height / unionResult.height;

      // Apply the scaling transformation to fit the unionResult into the frame
      unionResult.resize(unionResult.width * scaleX, unionResult.height * scaleY);

      // Make sure the union result shape is selected
      figma.currentPage.selection = [unionResult];

      // Center the viewport on the selected shape
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    } else {
      console.error('Expected a BOOLEAN_OPERATION node');
    }

    const children = Array.from(newNode.children); // Convert readonly array to mutable array

    const shuffledChildren = shuffleArray(children); // Shuffle the array of children randomly

    // Update the z-index for each child node
    shuffledChildren.forEach((child, index) => {
      child.parent.insertChild(index, child);
    });

    /**
     * Function to shuffle an array randomly
     */
    function shuffleArray(array: any[]) {
      const shuffledArray = array.slice();
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
    }

    figma.currentPage.selection = []; //deselection
    figma.currentPage.selection = [unionResult];
    unionResult.effects = [blurEffect];
    unionResult.blendMode = 'DIFFERENCE';

      for (const child of newNode.children) {
        // Randomly assign values to x and y positions
        const randomIndex = Math.floor(Math.random() * 4);
        switch (randomIndex) {
          case 0:
            child.x = 0;
            child.y = 0;
            break;

          case 1:
            child.x = 1200;
            child.y = 1200;
            break;

          case 2:
            child.x = 0;
            child.y = 1200;
            break;

          case 3:
            child.x = 1200;
            child.y = 0;
            break;

          default:
            break;
        }
      }

    const solidColor: SolidPaint = {
      type: 'SOLID',
      color: { r: 0.9, g: 0.2, b: 0.5 }, // Replace with the desired RGB color values
    };

    unionResult.fills = [solidColor];
    unionResult.x=0;
    unionResult.y=0;

      newNode.resize(6000, 6000); 

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: 'create-rectangles',
      message: `Man ${msg.value} you are just great`,
    });
  }

  figma.closePlugin();
};
