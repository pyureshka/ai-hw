function f(x, y) {
  return 1 / (1 + x ** 2 + y ** 2);
}

function simulatedAnnealing(
  f,
  x,
  y,
  T = 1,
  T_min = 0.00001,
  alpha = 0.9,
  iterations = 1000
) {
  let best_x = x;
  let best_y = y;
  let best_score = f(x, y);

  while (T > T_min) {
    for (let i = 0; i < iterations; i++) {
      let delta_x = (Math.random() - 0.5) * T;
      let delta_y = (Math.random() - 0.5) * T;
      let neighbor_x = x + delta_x;
      let neighbor_y = y + delta_y;
      let neighbor_score = f(neighbor_x, neighbor_y);
      let acceptance_prob = Math.exp((neighbor_score - best_score) / T);

      if (neighbor_score > best_score || Math.random() < acceptance_prob) {
        best_x = neighbor_x;
        best_y = neighbor_y;
        best_score = neighbor_score;
      }
    }
    T *= alpha;
  }

  return [best_x, best_y, best_score];
}

let [x, y, score] = simulatedAnnealing(f, 0, 0);
console.log(`Best x: ${x}`);
console.log(`Best y: ${y}`);
console.log(`Best score: ${score}`);
