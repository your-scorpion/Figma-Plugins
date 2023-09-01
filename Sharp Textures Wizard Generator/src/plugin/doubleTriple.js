export function doubleOrTriple(number) {
  // Generate a random number between 0 and 1
  var randomNumber = Math.random();

  if (randomNumber < 0.5) {
    // Return double the input number
    return number * 2;
  } else {
    // Return triple the input number
    return number * 3;
  }
}