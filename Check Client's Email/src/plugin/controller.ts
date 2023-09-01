// Initialize the Figma UI with specified dimensions
figma.showUI(__html__, { width: 340, height: 480 });

// Clear the Figma console
console.clear();

// Define the message event handler
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'create-rectangles') {
      const nodes = [];

      for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
      }

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);

      // Respond to the UI with a success message
      figma.ui.postMessage({
        type: 'create-rectangles',
        message: `Created ${msg.count} Rectangles`,
      });
    }
  } catch (error) {
    // Handle and log any errors that may occur during execution
    console.error('Error in Figma plugin:', error);

    // Respond to the UI with an error message
    figma.ui.postMessage({
      type: 'error',
      message: 'An error occurred while creating rectangles',
    });
  } finally {
    // Close the Figma plugin to release resources
    figma.closePlugin();
  }
};