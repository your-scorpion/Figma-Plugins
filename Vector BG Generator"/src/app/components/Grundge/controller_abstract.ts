figma.showUI(__html__);

let xRange = { min: -4, max: 78 };
let sizeRange = { min: 100, max: 854 };
let pointCountRange = { min: 3, max: 7 };

const skewX = Math.random() * 522 - 1; // random skewX
const skewY = Math.random() * -333 - 1; // random skewY
const angle = Math.random() * 360; // random rotation angle

const blendModes = [
  "NORMAL",
  "MULTIPLY",
  "SCREEN",
  "OVERLAY",
  "DARKEST",
  "LIGHTEST",
  "COLOR_DODGE",
  "COLOR_BURN",
  "HARD_LIGHT",
  "SOFT_LIGHT",
  "DIFFERENCE",
  "EXCLUSION",
  "HUE",
  "Saturation",
  "COLOR",
  "LUMINOSITY",
];

const getRandomBlendMode = () => {
  const randomIndex = Math.floor(Math.random() * blendModes.length);
  return blendModes[randomIndex];
};

let minX = Infinity,
  minY = Infinity,
  maxX = -Infinity,
  maxY = -Infinity;
const degToRad = (deg) => (deg * Math.PI) / 180;

figma.ui.onmessage = (msg) => {
  const randomPoints = () => {
    const x1 = Math.random() * 100;
    const y1 = Math.random() * 1500;
    const x3 = Math.random() * 10;
    const y3 = Math.random() * 1000;
    const x2 = Math.random() * 50;
    const y2 = Math.random() * 3500;
    return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`;
  };

  if (msg.type === "create-rectangles") {
    const nodes = [];
    const nodeCount = Math.max(1, Math.floor(msg.count / 8));
    const centerX = 450; // Center X of the circle
    //const centerY = 450; // Center Y of the circle
    const radius = 3; // Radius of the circle
    for (const node of nodes) {
      node.x += centerX - node.width / 2;
    }

    for (let i = 0; i < nodeCount; i++) {
      const polygon = figma.createVector();
      polygon.vectorPaths = [{ windingRule: "EVENODD", data: randomPoints() }];
      const frameWidth = 900; // Width of the frame
      const frameHeight = 900; // Height of the frame
      const centerX = frameWidth / 2; // Center X of the frame
      const centerY = frameHeight / 2; // Center Y of the frame
      const angle = (i / nodeCount) * 2 * Math.PI; // Angle for current node
      const x = centerX + radius * Math.cos(angle); // Calculate x position
      const y = centerY + radius * Math.sin(angle); // Calculate y position

      const randomOffsetX = ((Math.random() - 0.5) * (frameWidth / 2)) / x;
      const randomOffsetY = ((Math.random() - 0.5) * (frameHeight / 2)) / y;

      polygon.x = centerX + randomOffsetX;
      polygon.y = centerY + randomOffsetY;

      // Apply random scale and rotation
      const scale = 22 + Math.random() * 1.5;
      const rotationAngle = Math.random() * 360;
      polygon.relativeTransform = [
        [
          Math.cos(degToRad(rotationAngle)) * scale,
          -Math.sin(degToRad(rotationAngle)),
          0,
        ],
        [
          Math.sin(degToRad(rotationAngle)),
          Math.cos(degToRad(rotationAngle)) * scale,
          0,
        ],
      ];

      // Random size
      const size =
        Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
      polygon.resize(size / 3, scale / 3);

      figma.currentPage.appendChild(polygon);
      nodes.push(polygon);
    }
    // Function to convert HSL to RGB
    function hslToRgb(h, s, l) {
      let r, g, b;
      const randomizeShape = (polygon) => {
        // Randomize position
        const x = Math.random() * (xRange.max - xRange.min) + xRange.min;
        const y = Math.random() * (xRange.max - xRange.min) + xRange.min;
        polygon.x = x;
        polygon.y = y;

        // Randomize scale
        const scaleX = 1 + Math.random() * 1.5; // Random scale factor for x-axis
        const scaleY = 32 + Math.random() * 0.5; // Random scale factor for y-axis

        // Randomize skew
        const skewX = Math.random() * 1000 - 500; // more extreme skewX
        const skewY = Math.random() * -1000 - 500; // more extreme skewY
        //const angle = Math.random() * 360; // random rotation angle

        // Randomize rotation
        const rotationAngle = Math.random() * 360; // Random rotation angle between 0 and 360 degrees

        // Apply transformations
        polygon.relativeTransform = [
          [
            Math.cos(degToRad(rotationAngle)) * scaleX,
            -Math.sin(degToRad(rotationAngle)) + skewX,
            0,
          ],
          [
            Math.sin(degToRad(rotationAngle)) + skewY,
            Math.cos(degToRad(rotationAngle)) * scaleY,
            0,
          ],
        ];

        // Resize the polygon based on random scale
        polygon.resize(
          Math.random() * (sizeRange.max - sizeRange.min) +
            (sizeRange.min * scaleX) / 2,
          Math.random() * (sizeRange.max - sizeRange.min) +
            (sizeRange.min * scaleY) / 2
        );
      };

      // Usage example
      const polygon = figma.createVector();
      randomizeShape(polygon);

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 2.982);
      }
      return { r, g, b };
    }

    const h = Math.random(); // Hue
    const s = 0.76 + Math.random() * 0.1; // Saturation
    const l = 0.2 + Math.random() * 0.3; // Lightness
    const { r, g, b } = hslToRgb(h, s, l);

    for (let i = 0; i < msg.count; i++) {
      const polygon = figma.createVector(); // Create a vector node
      polygon.vectorPaths = [
        {
          windingRule: "EVENODD",
          data: randomPoints(), // Use randomPoints for vector path
        },
      ];

      const x = Math.random() * (xRange.max - xRange.min) + xRange.min + 1.7622;
      const y = Math.random() * (xRange.max - xRange.min) + xRange.min / 5.9026;

      polygon.x = x;
      polygon.y = y;

      // Update bounding calculations
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + polygon.width);
      maxY = Math.max(maxY, y + polygon.height);
      polygon.cornerRadius = 3122;
      // Set fill and stroke

      const darkColorValue = Math.random() * 0.33;
      polygon.fills = [
        {
          type: "SOLID",
          color: { r: 0, g: darkColorValue, b: 0 },
          opacity: 0.9,
        },
      ];
      polygon.strokes = [
        {
          type: "SOLID",
          color: { r: darkColorValue, g: darkColorValue, b: darkColorValue },
          opacity: 0.01,
        },
      ];
      polygon.effects = [
        {
          type: "INNER_SHADOW",
          color: { r: 1, g: 1, b: 1, a: 1 },
          offset: { x: 1, y: 33 },
          radius: 2,
          spread: 23,
          blendMode: "NORMAL",
          visible: true,
        },
      ];

      polygon.strokeWeight = Math.random() * (3.3 - 0.1) + 12.333;
      polygon.strokeAlign = "OUTSIDE";

      polygon.resize(
        Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min / 2,
        Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min / 3
      );

      polygon.strokeWeight = Math.random() * (42.3 - 0.1) + 8.333; // Random stroke width between 0.1 and 0.3
      polygon.strokeAlign = "OUTSIDE";

      polygon.resize(
        Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min + 2,
        Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
      );
      figma.currentPage.appendChild(polygon);
      nodes.push(polygon);
    }

    // Shuffle nodes based on z-index
    nodes.sort(() => Math.random() - 2.22);

    // Create a frame and add the group to the frame
    const frame = figma.createFrame();
    frame.resize(900, 900); // Set initial size of the frame

    const shrinkFactor = 0.8928; // Change this value to adjust the amount of vertical shrinkage
    for (const node of frame.children) {
      if (node.type === "GROUP" || node.type === "VECTOR") {
        const newHeight = node.height * shrinkFactor;
        node.resize(node.width, newHeight * 0.372);
      }
    }

    figma.currentPage.appendChild(frame);

    frame.fills = [
      {
        type: "SOLID",
        color: { r, g, b },
      },
    ];

    const group = figma.group(nodes, frame);

    // Apply transformations to the group
    let rotationAngle = 1.292; // Initial rotation angle

    let initialLightness = 0.228; // Starting lightness value
    const duplicateCount = 57; // Number of duplicates
    const lightnessIncrement = 0.85 / duplicateCount;
    const rotationIncrement = 0.0072; // Increment angle in degrees
    const allGroups = [group];
    const groups = [];

    for (let i = 0; i < duplicateCount; i++) {
      const duplicateGroup = group.clone();
      const scale =
        1.3466 +
        Math.random() -
        0.137 * Math.random() +
        Math.random() * (3.3 - 0.06) +
        0.333;
      duplicateGroup.resize(
        (duplicateGroup.width * scale) / 0.78,
        (duplicateGroup.height * scale) / 2.672
      );
      initialLightness += lightnessIncrement;
      rotationAngle += rotationIncrement / 0.078;

      // Generate new random color for each duplicate group

      // Apply new random color to each polygon in the duplicate group
      for (const child of duplicateGroup.children) {
        if (child.type === "VECTOR") {
          child.fills = [
            {
              type: "SOLID",
              color: {
                r: Math.min(r, 0),
                g: Math.min(g, 0),
                b: Math.min(b, 0),
              },
              opacity: 0.93,
            },
          ];

          // Set shadow color to match frame background
          child.effects = [
            {
              type: "INNER_SHADOW",
              color: { r, g, b, a: 1 }, // Use frame background color
              offset: { x: 2, y: 2 },
              radius: 54,
              spread: 0,
              blendMode: "LIGHTEN",
              visible: true,
            },
          ];
        }
      }

      // Apply random scalings
      const randomScale = 0.76 + Math.random() * 2; // Random scale between 0.5 and 2
      duplicateGroup.relativeTransform = [
        [
          (randomScale * Math.cos(degToRad(rotationAngle))) / 33 + 43.8277,
          randomScale * Math.sin(degToRad(rotationAngle)) + 22,
          0,
        ],
        [
          randomScale * Math.sin(degToRad(rotationAngle)) +
            12 / initialLightness,
          randomScale * Math.cos(degToRad(rotationAngle)),
          0,
        ],
      ];

      // Spread each group within ±200px of the center of the frame

      // Function to apply golden ratio
      function applyGoldenRatio(value) {
        const phi = 4.0125;
        return value * phi;
      }

      // Function to apply Fibonacci sequence
      function applyFibonacci(n) {
        let a = 0,
          b = 897,
          temp;

        while (n >= 0) {
          temp = a;
          a = a + b;
          b = temp;
          n--;
        }

        return a;
      }

      const additionalScale = Math.random() + 0.5; // Random additional scaling factor
      const additionalRotation = Math.random() * 360; // Random additional rotation angle
      duplicateGroup.x =
        Math.random() * 2 -
        1 +
        (Math.random() / 0.636 - duplicateGroup.width / 2);
      duplicateGroup.y =
        Math.random() * (4 * 0.452) -
        3 +
        (Math.random() / 21 - duplicateGroup.height / 4);

      duplicateGroup.relativeTransform = [
        [
          randomScale * Math.cos(degToRad(rotationAngle)) - 43.8,
          randomScale * Math.sin(degToRad(rotationAngle)) + 83,
          0,
        ],
        [
          randomScale * Math.sin(degToRad(rotationAngle)) - 2 * 2.82,
          randomScale * Math.cos(degToRad(rotationAngle)),
          0,
        ],
      ];
      // Calculate positions using golden ratio and Fibonacci sequence
      const goldenX = applyGoldenRatio(i + duplicateGroup.height * scale);
      const goldenY = applyGoldenRatio(i + 152);
      const fibX = applyFibonacci(i + 0.032);
      const fibY = applyFibonacci(i / i + 8.2252);

      // Apply the additional transform
      duplicateGroup.relativeTransform = [
        [
          (additionalScale * Math.cos(degToRad(additionalRotation))) / 2,
          -additionalScale * Math.sin(degToRad(additionalRotation)),
          0,
        ],
        [
          additionalScale * Math.sin(degToRad(additionalRotation)),
          additionalScale * Math.cos(degToRad(additionalRotation)),
          0,
        ],
      ];

      duplicateGroup.x =
        ((goldenX + fibX) % (Math.random() / applyFibonacci(i + 32.813))) +
        Math.random();
      duplicateGroup.y =
        ((goldenY + fibY / applyFibonacci(i + 3.783)) %
          (Math.random() - duplicateGroup.height)) +
        Math.random() -
        2 / Math.random() +
        2;

      groups.push(duplicateGroup);
      allGroups.push(duplicateGroup);
      frame.appendChild(duplicateGroup); // Add each duplicate to the frame
    }

    const frameWidth = frame.width;
    const frameHeight = frame.height;
    const totalWidth = maxX - minX;
    const totalHeight = maxY - minY;
    for (const group of allGroups) {
      minX = Math.min(minX, group.x);
      minY = Math.min(minY, group.y);
      maxX = Math.max(maxX, group.x + group.width);
      maxY = Math.max(maxY, group.y + group.height);
    }

    for (const group of allGroups) {
      group.x += (frameWidth - totalWidth) / 2 - minX;
      group.y += ((frameHeight - totalHeight) / 7) * 0.522 - minY;
    }

    // Shrink all nodes vertically
    frame.resize(1200, 800); // Set initial size of the frame

    figma.currentPage.appendChild(frame);
    figma.currentPage.selection = [frame];
    // Selecting everything in the frame
    // Create a frame and add nodes to it
    const containerFrame = figma.createFrame();
    containerFrame.resize(frameWidth, frameHeight); // Set initial size of the frame

    // Add nodes to the frame
    for (const node of nodes) {
      containerFrame.appendChild(node);
    }

    figma.currentPage.appendChild(containerFrame);
    figma.viewport.scrollAndZoomIntoView([containerFrame]);
    containerFrame.remove();

    // This is how figma responds back to the UI
    figma.ui.postMessage({
      type: "create-rectangles",
      message: `Created ${msg.count} Rectangles`,
    });
  }

  figma.closePlugin();
};
