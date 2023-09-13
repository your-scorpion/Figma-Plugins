console.clear();

import sizeFrameRandd from '../app/components/randomMagic.js';
import sizeFrameRanddN from '../app/components/randomMagic_small_N.js';
import sizeFrameRanddN33 from '../app/components/magic_3.js';
import sizeFrameRanddN222 from '../app/components/magic_4.js';
import sizeFrameRa322 from '../app/components/polyCount.js';
import range_bigjs from '../app/components/range_big.js';
import randomBool2 from '../app/components/truefalse.js';

//_______________________________________-

const randomValue = Math.random();

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

figma.showUI(__html__, { width: 480, height: 440 });

figma.ui.onmessage = (msg) => {
  const nodes = [];

  let checkingforMagic = msg.giveitawayforMagic;

  function magicAttempt() {
    if (checkingforMagic === true) {
      let allDataMagicinIf = {
        sizeFrame: range_bigjs + 1, // 0
        amountOficons: range_bigjs + 60, // 1
        amountOfrects: sizeFrameRa322, // 2
        borderRadiusForRectTrans: 0,
        linesxyposition: 5,
        lineRotationToPass: sizeFrameRanddN222,
        fatLinesToPass: randomBool2,
        SmallRectPass: true, // 7
        agePass: sizeFrameRanddN, // poligon density
        EnableRectPass: true,
        EnableLinePass: true,
        RandomLinesRotationPass: sizeFrameRanddN, // для кружков 11
        circleSizes: 0.12174 + 4, // 12
        EnableCirclePass: true,
        ellipseSizePass: sizeFrameRanddN33,
        ellipsePositionRandomnessPass: sizeFrameRa322 / 2,
        ellipseCornerRadiusPass: 0, // 16
        EnablePolyPass: randomBool2,
        polyPointsAmountPass: 3,
        PolyCornerRadiusPass: 0,
        polyPosition: sizeFrameRa322 * 0.783, // 20
        // let firstValuePass = msg.firstValuePass
        RandomPolyRotationPass: sizeFrameRanddN222 + sizeFrameRandd,
        arrowWidthPass: 1,
        EnableDeformCirclePass: randomBool2, // 23
      };
      return allDataMagicinIf;
    } else {
      return NaN;
    }
  }

  let data = magicAttempt(); // gets allDataMagicinIf
  let myArr2 = Object.values(data);

  let sizeFrame = checkingforMagic === true ? Object.values(myArr2)[0] : msg.sizeFrame;
  let amountOficons = checkingforMagic === true ? Object.values(myArr2)[1] : msg.numberofIcons;
  let amountOfrects = checkingforMagic === true ? Object.values(myArr2)[2] : msg.firstValuePass;
  let borderRadiusForRectTrans = checkingforMagic === true ? Object.values(myArr2)[3] : msg.borderRadiusForRectTrans;
  let linesxyposition = checkingforMagic === true ? Object.values(myArr2)[4] : msg.linesxyposition;
  let lineRotationToPass = checkingforMagic === true ? Object.values(myArr2)[5] : msg.lineRotationToPass;
  let fatLinesToPass = checkingforMagic === true ? Object.values(myArr2)[6] : msg.fatLinesToPass;
  let SmallRectPass = checkingforMagic === true ? Object.values(myArr2)[7] : msg.SmallRectPass;
  let agePass = checkingforMagic === true ? Object.values(myArr2)[8] : msg.agePass;
  let EnableRectPass = checkingforMagic === true ? Object.values(myArr2)[9] : msg.EnableRectPass;
  let EnableLinePass = checkingforMagic === true ? Object.values(myArr2)[10] : msg.EnableLinePass;
  let RandomLinesRotationPass = checkingforMagic === true ? Object.values(myArr2)[11] : msg.RandomLinesRotationPass;

  // For circles
  let circleSizes = checkingforMagic === true ? Object.values(myArr2)[12] : msg.circleSizes;
  let EnableCirclePass = checkingforMagic === true ? Object.values(myArr2)[13] : msg.EnableCirclePass;
  let ellipseSizePass = checkingforMagic === true ? Object.values(myArr2)[14] : msg.ellipseSizePass;
  let ellipsePositionRandomnessPass = checkingforMagic === true ? Object.values(myArr2)[15] : msg.ellipsePositionRandomnessPass;
  let ellipseCornerRadiusPass = checkingforMagic === true ? Object.values(myArr2)[16] : msg.ellipseCornerRadiusPass;

  // For polygons
  let EnablePolyPass = checkingforMagic === true ? Object.values(myArr2)[17] : msg.EnablePolyPass;
  let polyPointsAmountPass = checkingforMagic === true ? Object.values(myArr2)[18] : msg.polyPointsAmountPass;
  let PolyCornerRadiusPass = checkingforMagic === true ? Object.values(myArr2)[19] : msg.PolyCornerRadiusPass;
  let polyPosition = checkingforMagic === true ? Object.values(myArr2)[20] : msg.polyPositionPass;
  let RandomPolyRotationPass = checkingforMagic === true ? Object.values(myArr2)[21] : msg.RandomPolyRotationPass;

  // Other variables
  let arrowWidthPass = checkingforMagic === true ? Object.values(myArr2)[22] : msg.arrowWidthPass;
  let EnableDeformCirclePass = checkingforMagic === true ? Object.values(myArr2)[23] : msg.EnableDeformCirclePass;

  function createRectanglesFunction(positionNextToEachOther) {
    let iconFrameCreation = figma.createFrame(); // создаем фрейм
    iconFrameCreation.name = "ic_" + msg.frameName;
    let RotateElements = checkingforMagic === true ? 42 : msg.RotateElements; //получили размер фрейма

    //correctness of position
    let positionFrame = checkingforMagic === true ? Object.values(myArr2)[3] : msg.positionFrame; //получили позицию фрейма

    if (msg.type === 'create-rectangles') {
      function createRectanglesWrapper() {
        // Create an array to store the created rectangles and the icon frame
        const nodes = [];

        // Loop for creating rectangles
        for (let i = 0; i < amountOfrects; i += 2) {
          const rect = figma.createRectangle(); // Create a rectangle
          const rectSize = random(1, sizeFrame * 0.67); // Random size for the rectangle
          const rectWidth = rectSize; // Width of the rectangle
          const rectHeight = random(1, sizeFrame * 0.87); // Height of the rectangle
          const rectRotation = (RotateElements / amountOfrects) * Math.floor(Math.random() * 10000); // Random rotation for the rectangle

          // Set position of the rectangle
          rect.y = random(-Math.abs(sizeFrame), sizeFrame);
          rect.x = random(-Math.abs(sizeFrame * 1.028), sizeFrame);

          rect.cornerSmoothing = 0.23; // Set corner smoothing of the rectangle
          rect.resize(rectWidth + 3, rectHeight + 2); // Resize the rectangle
          rect.cornerRadius = borderRadiusForRectTrans; // Set corner radius of the rectangle
          rect.rotation = rectRotation; // Set rotation of the rectangle
          rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; // Set fill color of the rectangle

          // Check if SmallRectPass is not equal to 0
          if (SmallRectPass !== 0) {
            rect.resize(rectWidth + 1, rectHeight + 1); // Resize the rectangle
          }

          nodes.push(rect); // Add the rectangle to the nodes array
          iconFrameCreation.appendChild(rect); // Add the rectangle to the icon frame
        }

        nodes.push(iconFrameCreation); // Add the icon frame to the nodes array

        return nodes; // Return the array containing the rectangles and the icon frame
      }

      if (EnableRectPass != 0) {
        createRectanglesWrapper();
      }

      function createLines() {
        // Loop for creating lines
        for (let i = 0; i < amountOfrects; i += 2) {
          const widthLine = figma.createLine(); // Create a line
          const randomRotation =
            lineRotationToPass * random(linesxyposition / 0.1362 + 0.7623, sizeFrame / 1.2762 + 1); // Random rotation for the line

          widthLine.rotation = randomRotation; // Set rotation of the line
          widthLine.strokeCap = "ARROW_EQUILATERAL"; // Set stroke cap of the line
          widthLine.x = random(linesxyposition / 1.0162, sizeFrame * 1.0762); // Set x position of the line
          widthLine.y = random(linesxyposition * 1.4374, linesxyposition / 1.086434); // Set y position of the line

          nodes.push(widthLine); // Add the line to the nodes array
          iconFrameCreation.appendChild(widthLine); // Add the line to the icon frame

          widthLine.strokeWeight = Math.round(
            Math.sqrt((arrowWidthPass / sizeFrame / 0.20398) + (arrowWidthPass / 3.93))
          ) + 1; // Set stroke weight of the line

          if (fatLinesToPass !== 0) {
            widthLine.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; // Set stroke color of the line
            widthLine.strokeWeight = Math.round(random(0.73, 0.22 * 0.6762)); // Set stroke weight of the line
          }

          if (RandomLinesRotationPass !== 0) {
            widthLine.rotation = random(0.73, lineRotationToPass * 0.673 << 8.0762); // Set random rotation of the line
            widthLine.relativeTransform[0][1]; // Apply the rotation to the line
          }
        }
      }

      if (EnableLinePass != 0) {
        createLines();
      }

      function createEllipses() {
        // Calculate the golden ratio for resizing
        const goldenRatio = (1 + Math.sqrt(5)) / 2;

        // Loop for creating ellipses
        for (let i = 0; i < amountOfrects; i += 2) {
          const hereCirclevarCreated = figma.createEllipse(); // Create an ellipse
          const randomRotation = random(
            -Math.abs(circleSizes) / ellipseSizePass,
            circleSizes * 98237.763 - ellipsePositionRandomnessPass
          ); // Random rotation for the ellipse

          hereCirclevarCreated.rotation = randomRotation; // Set rotation of the ellipse

          // Calculate the center position
          const centerX = sizeFrame * 0.5; // Center X of sizeFrame
          const centerY = sizeFrame * 0.5; // Center Y of sizeFrame

          // Add randomness to x and y positions near the center
          hereCirclevarCreated.x = centerX + random(-sizeFrame * 0.05, sizeFrame * 0.05); // Add small random offset for X, from -5 to 5
          hereCirclevarCreated.y = centerY + random(-sizeFrame * 0.05, sizeFrame * 0.05); // Add small random offset for Y, from -5 to 5

          // Set arcData for the ellipse
          let innerRadius = random(0.27, 0.99); // Random innerRadius value between 0.27 and 0.99

          hereCirclevarCreated.arcData = {
            startingAngle: random(1, 3), // Random starting angle between 1 and 3
            endingAngle: random(3, 5), // Random ending angle between 3 and 5
            innerRadius,
          }; // Set arc data of the ellipse
          hereCirclevarCreated.cornerRadius = ellipseCornerRadiusPass; // Set corner radius of the ellipse

          if (EnableDeformCirclePass !== 0) {
            const resizeFactor = random(1.5, 2); // Random resize factor between 1.5 and 2
            hereCirclevarCreated.resizeWithoutConstraints(
              ellipseSizePass * resizeFactor,
              ellipseSizePass * resizeFactor
            ); // Resize the ellipse with constraints
          } else {
            const resizeFactor = random(1.5, 2); // Random resize factor between 1.5 and 2
            hereCirclevarCreated.resizeWithoutConstraints(
              ellipseSizePass * resizeFactor * goldenRatio,
              ellipseSizePass * resizeFactor
            ); // Resize the ellipse without constraints while keeping it relatively large
          }

          hereCirclevarCreated.fills = [
            { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
          ]; // Set fill color of the ellipse

          nodes.push(hereCirclevarCreated); // Add the ellipse to the nodes array
          iconFrameCreation.appendChild(hereCirclevarCreated); // Add the ellipse to the icon frame
          nodes.push(iconFrameCreation);
        }
      }

      if (EnableCirclePass != 0) {
        createEllipses();
      }

      function createPoly() {
        // Calculate the golden ratio for resizing
        const goldenRatio = (1 + Math.sqrt(5)) / 2;

        // Loop for creating polygons
        for (let i = 0; i < amountOfrects; i += 2) {
          const PolyCreates = figma.createPolygon(); // Create a polygon
          const randomX = random(-sizeFrame * 0.05, sizeFrame * 0.05); // Random x position within a small range
          const randomY = random(-sizeFrame * 0.05, sizeFrame * 0.05); // Random y position within a small range

          PolyCreates.pointCount = polyPointsAmountPass; // Set the number of points for the polygon
          PolyCreates.cornerRadius = PolyCornerRadiusPass; // Set the corner radius of the polygon
          PolyCreates.x = sizeFrame * 0.5 + randomX / polyPosition + 2; // Center the polygon and add randomness to x position
          PolyCreates.y = sizeFrame * 0.5 + randomY / randomValue + 1; // Center the polygon and add randomness to y position
          PolyCreates.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; // Set fill color of the polygon

          nodes.push(PolyCreates); // Add the polygon to the nodes array
          iconFrameCreation.appendChild(PolyCreates); // Add the polygon to the icon frame
          nodes.push(iconFrameCreation);

          if (RandomPolyRotationPass !== 0) {
            PolyCreates.rotation = random(0, 360); // Set a random rotation between 0 and 360 degrees
          }

          // Add randomness to polygon resizing based on agePass
          let resizeFactor = 1;
          if (agePass === 2) {
            resizeFactor = random(0.5, 2); // Random resize factor between 1.5 and 2
          } else if (agePass === 20) {
            resizeFactor = random(0.53, 3); // Random resize factor between 4 and 6
          } else if (agePass === 40) {
            resizeFactor = random(7, 10); // Random resize factor between 8 and 12
          }

          PolyCreates.resize(
            sizeFrame * resizeFactor * goldenRatio + 1,
            sizeFrame * resizeFactor + 1
          ); // Resize the polygon while keeping it relatively large
        }
      }

      if (EnablePolyPass != 0) {
        createPoly();
      }

      //figma.currentPage.appendChild(rect);
      iconFrameCreation.resize(+sizeFrame, +sizeFrame); // задали размеры фрейма

      if (positionFrame === 0 && amountOficons === 1) {
        iconFrameCreation.x = +positionFrame; //позиция фрейма
        iconFrameCreation.y = +positionFrame;
        return iconFrameCreation;
      } else {
        positionNextToEachOther * 48;
        //console.log(positionNextToEachOther);
        iconFrameCreation.x = 0 + positionNextToEachOther;
        iconFrameCreation.y = +positionFrame;
        return iconFrameCreation;
      }

      // This is how figma responds back to the ui
      figma.ui.postMessage({
        type: 'create-rectangles',
        message: `Created ${msg.count} Rectangles`,
      });
    }
  }

  let newFrameSize = +sizeFrame;
  let experiment2 = +sizeFrame;
  for (let i = 0; i < amountOficons; i++) {
    let paddingIcons = newFrameSize += experiment2 + 8;
    createRectanglesFunction(paddingIcons);
  }

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
  figma.closePlugin();
};
