class Perceptron {
  constructor(inputSize, learningRate) {
    this.weights = new Array(inputSize).fill(0);
    this.bias = 0;
    this.learningRate = learningRate;
  }

  predict(inputs) {
    let sum = this.bias;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return sum > 0 ? 1 : 0;
  }

  train(inputs, label) {
    let prediction = this.predict(inputs);
    let error = label - prediction;
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += error * inputs[i] * this.learningRate;
    }
    this.bias += error * this.learningRate;
  }
}

const andPerceptron = new Perceptron(2, 0.1);
const orPerceptron = new Perceptron(2, 0.1);
const notPerceptron = new Perceptron(1, 0.1);

// Training data for the AND function
const andData = [
  { inputs: [0, 0], label: 0 },
  { inputs: [0, 1], label: 0 },
  { inputs: [1, 0], label: 0 },
  { inputs: [1, 1], label: 1 },
];

// Training data for the OR function
const orData = [
  { inputs: [0, 0], label: 0 },
  { inputs: [0, 1], label: 1 },
  { inputs: [1, 0], label: 1 },
  { inputs: [1, 1], label: 1 },
];

// Training data for the NOT function
const notData = [
  { inputs: [0], label: 1 },
  { inputs: [1], label: 0 },
];

// Training the perceptrons
for (let i = 0; i < 1000; i++) {
  for (const data of andData) {
    andPerceptron.train(data.inputs, data.label);
  }
  for (const data of orData) {
    orPerceptron.train(data.inputs, data.label);
  }
  for (const data of notData) {
    notPerceptron.train(data.inputs, data.label);
  }
}

// Testing the perceptrons
console.log(andPerceptron.predict([0, 0])); // 0
console.log(andPerceptron.predict([0, 1])); // 0
console.log(andPerceptron.predict([1, 0])); // 0
console.log(andPerceptron.predict([1, 1])); // 1

console.log(orPerceptron.predict([0, 0])); // 0
console.log(orPerceptron.predict([0, 1])); // 1
console.log(orPerceptron.predict([1, 0])); // 1
console.log(orPerceptron.predict([1, 1])); // 1

console.log(notPerceptron.predict([0])); // 1
console.log(notPerceptron.predict([1])); // 0
