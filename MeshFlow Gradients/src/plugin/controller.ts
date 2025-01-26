figma.showUI(__html__, { width: 640, height: 530 });
//import base64Data from "../app/components/App";
 

figma.ui.onmessage = (msg) => {
  const newDat22a = msg.capturedDataURLData;
  const heightheight = msg.height;
  const widthwidth = msg.width;
  let x = 0;

  if (msg.type === 'create-rectangles') {
    const nodes = [];
    const rectPromises = [];

    for (let i = 0; i < msg.count; i++) {
          function getRandomValue() {
            return Math.random() * 1400 - 700;
          }

      const rect = figma.createRectangle();
      rect.x = getRandomValue(); // Set the initial x position
      rect.y = x;
      rect.resize(widthwidth * 2, heightheight * 2);

      const imagePromise = figma.createImageAsync(newDat22a);

      rectPromises.push(
        imagePromise.then((image) => {
          rect.fills = [
            {
              type: 'IMAGE',
              imageHash: image.hash,
              scaleMode: 'FILL',
            },
          ];

          return rect;
        })
      );

      figma.currentPage.appendChild(rect);
      nodes.push(rect);

      x += rect.width + 32; // Update the x position with width and spacing

      if (i > 0 && i % 2 === 1) {
        x += 640; // Shift by 640 pixels every second rectangle
      }
    }

    Promise.all(rectPromises).then((rects) => {
      rects.forEach((rect) => {
        nodes.push(rect);
      });

      // Select the first rectangle
      figma.currentPage.selection = [nodes[0]];

      // Zoom to the selected rectangle
      const selectedNode = nodes[0];
      const zoomToSelection = async () => {
        await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
        figma.viewport.scrollAndZoomIntoView([selectedNode]);
      };
      zoomToSelection();

      // This is how figma responds back to the UI
      figma.ui.postMessage({
        type: 'create-rectangles',
        message: `Created ${msg.count} Rectangles`,
      });

      //figma.closePlugin();
    });
  }
};
