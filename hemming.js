function hammingDistance(x, y) {
  /*
  Функция расстояния Хемминга между двумя бинарными векторами
  */
  if (x.length !== y.length) {
    throw new Error("Длины векторов не совпадают");
  }
  let distance = 0;
  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) {
      distance++;
    }
  }
  return distance;
}

class HammingNetwork {
  constructor(num_neurons, num_bits) {
    /*
    Конструктор сети.
    num_neurons - количество нейронов в сети.
    num_bits - количество бит во входном векторе.
    */
    this.num_neurons = num_neurons;
    this.num_bits = num_bits;
    this.weights = new Array(num_neurons);
    for (let i = 0; i < num_neurons; i++) {
      this.weights[i] = new Array(num_bits).fill(0);
    }
  }

  train(patterns) {
    /*
    Метод обучения сети на наборе образов.
    patterns - список бинарных векторов, на которых будет обучаться сеть.
    */
    if (patterns.length > this.num_neurons) {
      throw new Error("Количество образов больше, чем количество нейронов");
    }
    for (let i = 0; i < patterns.length; i++) {
      this.weights[i] = patterns[i];
    }
  }

  recognize(pattern) {
    /*
    Метод распознавания образа.
    pattern - бинарный вектор, который нужно распознать.
    */
    let distances = [];
    for (let i = 0; i < this.num_neurons; i++) {
      distances.push(hammingDistance(pattern, this.weights[i]));
    }
    console.log(`Расстояния: ${distances}`); // Добавленный вывод
    let minDistance = Math.min(...distances);
    if (distances.indexOf(minDistance) !== distances.lastIndexOf(minDistance)) {
      return null;
    }
    return distances.indexOf(minDistance);
  }
}

let network = new HammingNetwork(4, 4);

// Обучаем сеть на некоторых образах
let patterns = [
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 1, 1, 0],
  [1, 0, 0, 1],
];

network.train(patterns);
let newPattern = [1, 0, 1, 0];
let recognizedNeuron = network.recognize(newPattern);

if (recognizedNeuron !== null) {
  console.log(`Образ распознан как нейрон ${recognizedNeuron}`);
} else {
  console.log("Образ не распознан");
}
