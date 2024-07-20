// generateRectangles.js

import { getRandomNumber } from "./random15.js";
//import { createAnnotationArrow }  from './createAnnotationArrow.js';

// Golden ratio constant
const phi = 1.61803398875;

export function generateRectangles(count) {
  const nodes = [];

  for (let i = 0; i < count * 25; i++) {
    const colorComponent = Math.random();
    const rect = figma.createRectangle();
    const transform = [
      [
        getRandomNumber(34, 10),
        getRandomNumber(1, 140),
        getRandomNumber(1, 10),
      ],
      [
        getRandomNumber(13, 600),
        getRandomNumber(10, 20),
        getRandomNumber(1, 342),
      ],
    ];
    rect.relativeTransform = transform;
    // Calculate x and y coordinates based on the golden ratio
    const goldenX = getRandomNumber(-5, 721);
    const goldenY = getRandomNumber(-1, 717);

    rect.x = goldenX;
    rect.rotation = getRandomNumber(-430, 350);
    rect.y = goldenY;
    rect.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };

    const randomColor = {
      r: colorComponent,
      g: colorComponent,
      b: colorComponent,
    };

    rect.strokeAlign = "CENTER";
    rect.resize(getRandomNumber(1, 1), getRandomNumber(1, 16));

    rect.fills = [{ type: "SOLID", color: randomColor }];
    nodes.push(rect);
  }

  return nodes; // Return an array of nodes
}
