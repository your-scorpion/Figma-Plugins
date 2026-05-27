const __html__ = __HTML__;
const buttonSvg = __BUTTON_SVG__;

const { widget } = figma;
const { AutoLayout, SVG, useStickable } = widget;

figma.showUI(__html__, { width: 1024, height: 768 });

function resizeUi(width, height) {
  figma.ui.resize(Math.round(width), Math.round(height));
}

function createRectangleFromBase64(base64Image) {
  const base64WithoutPrefix = base64Image.substring(base64Image.indexOf(',') + 1);
  const newRectangle = figma.createRectangle();

  newRectangle.x = 0;
  newRectangle.y = 0;
  newRectangle.resize(1024, 768);

  const imageBytes = figma.base64Decode(base64WithoutPrefix);
  const image = figma.createImage(imageBytes);

  newRectangle.fills = [
    {
      type: 'IMAGE',
      imageHash: image.hash,
      scaleMode: 'FILL',
    },
  ];

  figma.currentPage.appendChild(newRectangle);
  figma.viewport.scrollAndZoomIntoView([newRectangle]);
  figma.currentPage.selection = [newRectangle];

  return base64WithoutPrefix;
}

function registerUiHandlers(resolve) {
  figma.ui.onmessage = (message) => {
    if (message.type === 'create-rectangles') {
      figma.notify('Created!');
      resolve(createRectangleFromBase64(message.base64Image));
      return;
    }

    if (message.type === 'resize-ui') {
      resizeUi(message.width, message.height);
      return;
    }

    if (message.type === 'close') {
      figma.closePlugin();
    }
  };
}

function Widget() {
  useStickable();

  return figma.widget.h(
    AutoLayout,
    {
      direction: 'horizontal',
      horizontalAlignItems: 'center',
      verticalAlignItems: 'center',
      height: 'hug-contents',
      padding: 8,
      hidden: false,
      cornerRadius: 8,
      spacing: 12,
      hoverStyle: {
        opacity: 0.87,
      },
      onClick: async () => {
        await new Promise((resolve) => {
          registerUiHandlers(resolve);
        });
      },
    },
    figma.widget.h(
      AutoLayout,
      null,
      figma.widget.h(SVG, {
        src: buttonSvg,
      }),
    ),
  );
}

widget.register(Widget);