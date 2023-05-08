class Cognitron {
  constructor(inputShape, outputShape) {
    this.inputShape = inputShape;
    this.outputShape = outputShape;
    this.weights = Array(inputShape[0] * inputShape[1] * outputShape).fill(0);
  }

  forward(input) {
    this.input = input.flat();
    this.netInput = this.weights.reduce((acc, weight, index) => {
      return acc + weight * this.input[index];
    }, 0);
    this.output = this.netInput >= 0 ? 1 : 0;
    return this.output;
  }

  train(inputs, labels, epochs = 10, learningRate = 0.1) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const label = labels[i];
        const output = this.forward(input);
        const error = label - output;
        for (let j = 0; j < this.weights.length; j++) {
          this.weights[j] += learningRate * this.input[j] * error;
        }
      }
    }
  }
}

// создаем объект Cogitron с размерностью входного и выходного слоев 5x5 и 2 соответственно
const cogitron = new Cogitron([5, 5], 2);

// задаем обучающие примеры и соответствующие метки
const inputs = [
  [
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
];

const labels = [
  [1, 0],
  [0, 1],
];

// обучаем сеть
cogitron.train(inputs, labels, 100);

// тестируем сеть на новых образах
const testInputs = [
  [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],

  [
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 0, 1],
    [0, 0, 1, 1, 0],
  ],
];

for (const input of testInputs) {
  const output = cogitron.forward(input.flat());
  console.log(output);
}
