export function* fibonacciGenerator() {
  var prev = 0;
  var curr = 1;

  while (true) {
    yield prev;
    var next = prev + curr;
    prev = curr;
    curr = next;
  }
}