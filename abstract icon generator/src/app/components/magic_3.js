function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function generateRandomSizeFrame() {
  const sizeFrame = Math.ceil(randomNumber(1, 3));
  return sizeFrame;
}

const sizeFrameRanddN22 = generateRandomSizeFrame();
export default sizeFrameRanddN22;
