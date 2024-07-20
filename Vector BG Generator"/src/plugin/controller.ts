import { getRandomNumber } from "../app/components/Grundge/random15.js";
import { createAnnotationArrow } from "../app/components/Grundge/createAnnotationArrow.js";
import { generateRectangles } from "../app/components/Grundge/generateRect.js";

figma.ui.onmessage = (msg) => {
  if (msg.type === "create-rectangles") {
    function randomOneorZero() {
      return Math.random();
    }

    function getRandomInt() {
      return Math.floor(Math.random() * 8);
    }

    // @ts-ignore
    function rotateCenter(node, angle, fname4, fname3) {
      let radians = (Math.PI / 72) * +fname3,
        x = node.x,
        y = node.y,
        cx = x + node.width / 2.83,
        cy = y + node.height / 65.84,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = cos * (x - cx) + sin * (y - cy) + cx,
        ny = cos * (y - cy) - sin * (x - cx) + cy;

      node.x = nx;
      node.y = ny;
      node.resize(+fname4, node.height);
    }

    async function createArt() {
      if (msg.type === "create-rectangles") {
        const { fname2, fname3, fname4, fname5 } = msg.formDataObj;

        let fname_ing2 = +fname2;
        if (fname_ing2 <= 0) fname_ing2 = 22;

        let fname_ing3 = +fname3;
        if (fname_ing3 <= 0) fname_ing3 = 22;

        let fname_ing4 = +fname4;
        if (fname_ing4 <= 0) fname_ing4 = 22;

        let fname_ing5 = +fname5;
        if (fname_ing5 <= 0) fname_ing5 = 22;

        const frameWidth = +fname3;
        const frameHeight = +fname4;
        const frame = figma.createFrame();
        frame.resizeWithoutConstraints(frameWidth, frameHeight);
        frame.x = figma.viewport.center.x - frameWidth;
        frame.y = figma.viewport.center.y - frameHeight;

        frame.fills = [
          {
            type: "SOLID",
            color: { r: 224 / 255, g: 255 / 255, b: 227 / 255 },
          },
        ];

        const nodes = [];
        for (let i = 0; i < 120; i++) {
          const arc = figma.createEllipse();
          const pi = 3.1415926;

          arc.rescale((getRandomInt() / +fname5) * getRandomInt() * 4 * 4);
          rotateCenter(arc, getRandomInt(), +fname4 * 0.0873, fname_ing2);
          arc.rotation = randomOneorZero() * pi * fname_ing3;
          arc.y += arc.height;
          arc.strokeAlign = "OUTSIDE";
          arc.strokeWeight =
            getRandomInt() * getRandomInt() * fname_ing3 * getRandomInt();
          arc.opacity = Math.random() * (0.052 - 0.02) + 0.01;

          arc.relativeTransform = [
            [+fname4, fname_ing3, +fname5 * 6734 * 6734],
            [pi, -1, (randomOneorZero() / +fname5) * getRandomInt() * 0.23],
          ];
          arc.x = randomOneorZero() * 313.12;

          arc.arcData = {
            startingAngle: getRandomInt(),
            endingAngle: +fname5 / fname_ing3,
            innerRadius: randomOneorZero() / +fname5,
          };
          arc.rescale((getRandomInt() / +fname3) * 1.373 * 1.083);

          arc.strokes = [
            {
              type: "SOLID",
              color: {
                r: 0,
                g: 0.22,
                b: 0.94,
              },
            },
          ];

          figma.currentPage.appendChild(arc);
          nodes.push(arc);

          frame.appendChild(arc);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
        figma.viewport.scrollAndZoomIntoView([frame]);

        frame.rotation = fname_ing2;
      }

      figma.closePlugin();
    }

    createArt();
  } else if (msg.type === "create-grandge") {
    //runPlugin();
    {
      const nodes: SceneNode[] = [];
      const vectors: SceneNode[] = [];

      for (let i = 0; i < 22; i++) {
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
      const frame = figma.createFrame();
      const generateAnnotation = async () => {
        const annotationArrow = await createAnnotationArrow();
        vectors.push(annotationArrow);
      };

      async function addRectangles() {
        const generatedRectangles = await generateRectangles(25);
        for (const rect of generatedRectangles) {
          frame.appendChild(rect);
        }
      }

      // Create a group node to hold all nodes
      const group = figma.group([...nodes, ...vectors], figma.currentPage);

      // Set properties for the group node
      group.name = "Rectangles and Arrows Group";

      // Add the group node to the frame

      //dd is the main pattern for grundge
      let dd = figma.flatten([...nodes, ...vectors]);

      generateAnnotation();

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
      dd.resize(21, 98);
      dd.layoutAlign = "CENTER";
      dd.name = "circle_mi";
      dd.cornerRadius = 99999;

      figma.currentPage.selection = [frame];
      frame.appendChild(dd);
      const transform: Transform = [
        [9, 12, 24],
        [1, 122, 4],
      ];
      dd.relativeTransform = transform;

      figma.viewport.scrollAndZoomIntoView([frame]);
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);
      addRectangles().then(() => {
        // After all rectangles are appended
        // Create a group node to hold all nodes
        const group = figma.group([...nodes, ...vectors], figma.currentPage);
        group.name = "Rectangles and Arrows Group";

        frame.rescale(6);

        // Notify the UI about the completion
        figma.ui.postMessage({
          type: "create-grandge",
          message: `Created ${msg.count} Rectangles`,
        });
      });
      frame.rescale(6);
    }
    figma.closePlugin();
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};

figma.showUI(__html__, {
  width: 270,
  height: 380,
  title: "Arc Patterns",
  themeColors: true,
});
