 function generateNumber123() {
  const num = Math.floor(Math.random() * 3);
  return String(num);
}


const numbers = [];

for (let i = 0; i < 4; i++) {
  numbers.push(generateNumber123());
}

let index1 = Math.floor(Math.random() * numbers.length);
let index2 = Math.floor(Math.random() * numbers.length);
let index3 = Math.floor(Math.random() * numbers.length);
let index4 = Math.floor(Math.random() * numbers.length);


export let [numb13, numb14, numb15, numb16] = [numbers[index1], numbers[index2], numbers[index3], numbers[index4]];