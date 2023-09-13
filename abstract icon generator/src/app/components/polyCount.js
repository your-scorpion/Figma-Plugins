function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function generateRandomSizeFrame() {
  const sizeFrame = Math.ceil(randomNumber(3, 6));
  return sizeFrame;
}

const sizeFrameRa322 = generateRandomSizeFrame();
export default sizeFrameRa322;
