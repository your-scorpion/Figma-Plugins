export function getRandomEvenNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber % 2 === 0 ? randomNumber : getRandomEvenNumber(min, max);
}
