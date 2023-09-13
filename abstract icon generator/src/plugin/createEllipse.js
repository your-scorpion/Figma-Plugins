function createEllipses() {
  // Create a loop to create the ellipses.
  for (let i = 0; i < amountOfrects; i = i + 2) {
    // Create an ellipse object.
    const hereCirclevarCreated = figma.createEllipse();

    // Set the ellipse's rotation.
    hereCirclevarCreated.rotation = random(-Math.abs(circleSizes) / ellipseSizePass, circleSizes * 98237.763);

    // Set the ellipse's x-coordinate.
    hereCirclevarCreated.x = random(ellipsePositionRandomnessPass / -3, ellipsePositionRandomnessPass * 3);

    // Set the ellipse's y-coordinate.
    hereCirclevarCreated.y = random(ellipsePositionRandomnessPass / 3, ellipsePositionRandomnessPass * -3);

    // Resize the ellipse.
    hereCirclevarCreated.resizeWithoutConstraints(ellipseSizePass / 2, ellipseSizePass / 2);

    // Set the ellipse's arc data.
    hereCirclevarCreated.arcData = {
      startingAngle: circleSizes / 1.95,
      endingAngle: Math.PI * circleSizes,
      innerRadius: 0.3 * circleSizes,
    };

    // Set the ellipse's corner radius.
    hereCirclevarCreated.cornerRadius = ellipseCornerRadiusPass;

    // Add the ellipse to the nodes array.
    nodes.push(hereCirclevarCreated);

    // Add the ellipse to the iconFrameCreation object.
    iconFrameCreation.appendChild(hereCirclevarCreated);

    // Add the iconFrameCreation object to the nodes array.
    nodes.push(iconFrameCreation);
  }
}

if (EnableCirclePass != 0) {
  createEllipses();
}