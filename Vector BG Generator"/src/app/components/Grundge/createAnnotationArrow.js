// createAnnotationArrow.ts

export async function createAnnotationArrow() {
  const node = figma.createVector();
  node.x = getRandomNumber(-360, 350);
  node.maskType = "VECTOR";
  node.y = getRandomNumber(-360, 350);
  node.resize(101.82337951660156, 0);
  node.rotation = getRandomNumber(-360, 350);
  node.setVectorNetworkAsync({
    regions: [],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 0,
        y: 0,
        // strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 101.82337951660156,
        y: 0,
        strokeCap: "ARROW_EQUILATERAL",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  });
  node.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: {
        r: 0.4257006836,
        g: 0.5960784554481506,
        b: 0.15294118225574493,
      },
      boundVariables: {},
    },
  ];
  return node;
}
