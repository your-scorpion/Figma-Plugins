let currentNumber = 1;

export function rarelyUsedAlgorithm() {
  let result = currentNumber;
  
  if (currentNumber % 2 === 0) {
    currentNumber /= 2;
  } else {
    currentNumber = currentNumber * 3 + 1;
  }
  
  return result;
}