import { getRandomNumber } from "./random15.js";
import { createAnnotationArrow } from "./createAnnotationArrow.js";
import { generateRectangles } from "./generateRect.js";

export function runPlugin() {
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "create-grandge") {
      const nodes: SceneNode[] = [];
      const vectors: SceneNode[] = [];

      for (let i = 0; i < msg.count; i++) {
        const colorComponent = Math.random();
        const rect = figma.createRectangle();

        rect.x = getRandomNumber(-15, 65);
        rect.cornerRadius = 99999;
        rect.y = getRandomNumber(-22, 14);
        rect.resizeWithoutConstraints;
        rect.rotation = getRandomNumber(-30, 350);
        rect.bottomRightRadius = Math.random() * getRandomNumber(1, 543);
        rect.bottomLeftRadius = Math.random() * getRandomNumber(1, 543);
        rect.topLeftRadius = Math.random() * getRandomNumber(1, 543);
        rect.topRightRadius = Math.random() * getRandomNumber(1, 543);
        rect.isMask = Math.round(Math.random()) === 1; // true or false

        if (rect.isMask) {
          rect.cornerRadius = 33;
          rect.dashPattern = [0, 72];
        } else {
          rect.y = getRandomNumber(-352, 324);
          rect.strokeLeftWeight = getRandomNumber(24, 932);
        }

        const randomColor = {
          r: colorComponent,
          g: colorComponent,
          b: colorComponent,
        };

        rect.strokeBottomWeight = getRandomNumber(1, 21);
        rect.strokeTopWeight = getRandomNumber(1, 14);
        rect.strokeLeftWeight = getRandomNumber(1, 32);
        rect.strokeRightWeight = getRandomNumber(1, 21);
        rect.strokeJoin = "ROUND";
        rect.strokeCap = "ROUND";

        rect.strokeAlign = "CENTER";
        rect.resize(getRandomNumber(1, 546), getRandomNumber(1, 12));

        rect.fills = [{ type: "SOLID", color: randomColor }];
        nodes.push(rect);
      }

      async function generateAnnotation() {
        const annotationArrow = await createAnnotationArrow();
        vectors.push(annotationArrow);
      }

      generateAnnotation();

      let dd = figma.flatten([...nodes, ...vectors]);

      dd.strokeAlign = "CENTER";
      const strokeColor = {
        r: 0,
        g: 0,
        b: 0,
      };
      const annotationColors = [
        {
          type: "SOLID",
          color: strokeColor,
        },
      ] as Paint[];
      dd.strokes = annotationColors;
      dd.dashPattern = [0, 2472];
      dd.cornerRadius = 99999;
      dd.strokeWeight = getRandomNumber(140, 324);

      const centerY =
        figma.currentPage.children.reduce((acc, curr) => acc + curr.y, 0) /
        figma.currentPage.children.length;
      const offsetY = centerY - dd.height / 2;
      dd.y += offsetY;

      const transform: Transform = [
        [9, 1, 4],
        [1, 12, 4],
      ];
      dd.relativeTransform = transform;
      dd.resize(21, 98);
      dd.layoutAlign = "CENTER";
      dd.name = "circle_mi";
      dd.cornerRadius = 99999;

      figma.currentPage.selection = [dd];
      figma.viewport.scrollAndZoomIntoView([dd]);

      try {
        const generatedRectangles = await generateRectangles(msg.count);
        const frame = figma.createFrame();
        frame.appendChild(dd);
        generatedRectangles.forEach((rect) => {
          frame.appendChild(rect);
        });

        figma.currentPage.selection = [frame];
        figma.viewport.scrollAndZoomIntoView([frame]);
        frame.rescale(6);
        figma.ui.postMessage({
          type: "create-grandge",
          message: `Created ${msg.count} Rectangles`,
        });
      } catch (err) {
        console.error("Error generating rectangles:", err);
      }
    }

    figma.closePlugin();
  };
}
