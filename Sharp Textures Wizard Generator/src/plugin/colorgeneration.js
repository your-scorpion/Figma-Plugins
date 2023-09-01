let ohArray2 = [];
for (let i = 0; i < 100; i++) {
  let randomValue = 0.27 + Math.random() * 0.74;
  ohArray2.push(randomValue);
}

export function generateColor() {
  return Math.random() * 0.18 + 0.15; // generates a random value between 0.01 and 0.98
}

export function generateLongNumber() {
  return Math.random() * 0.08 + 0.19; // generates a random value between 0.01 and 0.98
}


let newDataohArray2 = ohArray2.slice(1,2);
let newDataohArray2AsNumber = Number(newDataohArray2);
//console.log(newDataohArray2AsNumber);

let index1 = Math.floor(Math.random() * ohArray2.length);
let index2 = Math.floor(Math.random() * ohArray2.length);
let index3 = Math.floor(Math.random() * ohArray2.length);


// Use array destructuring to assign the values to variables
export let [value1, value2, value3] = [ohArray2[index1], ohArray2[index2], ohArray2[index3]];

