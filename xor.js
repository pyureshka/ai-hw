class MultiLayerPerceptron {
  constructor(inputSize, outputSize, hiddenSizes, activationFunction) {
    this.weights = [];
    this.biases = [];
    this.layers = [inputSize, ...hiddenSizes, outputSize];

    // Initialize weights and biases
    for (let i = 1; i < this.layers.length; i++) {
      const inputLayerSize = this.layers[i - 1];
      const outputLayerSize = this.layers[i];

      const weights = [];
      const biases = [];
      for (let j = 0; j < outputLayerSize; j++) {
        const neuronWeights = [];
        for (let k = 0; k < inputLayerSize; k++) {
          neuronWeights.push(Math.random() - 0.5);
        }
        weights.push(neuronWeights);
        biases.push(Math.random() - 0.5);
      }
      this.weights.push(weights);
      this.biases.push(biases);
    }

    this.activationFunction =
      activationFunction || MultiLayerPerceptron.sigmoidActivationFunction;
  }

  static sigmoidActivationFunction(x) {
    return 1 / (1 + Math.exp(-x));
  }

  train(examples, learningRate, epochs) {
    for (let i = 0; i < epochs; i++) {
      for (let j = 0; j < examples.length; j++) {
        const input = examples[j][0];
        const target = examples[j][1];

        const output = this.forwardPropagation(input);
        const error = this.backwardPropagation(output, target);
        this.updateWeights(input, learningRate, error);
      }
    }
  }

  forwardPropagation(input) {
    let output = input;
    for (let i = 0; i < this.layers.length - 1; i++) {
      const weights = this.weights[i];
      const biases = this.biases[i];
      const activationFunction = this.activationFunction;

      output = weights.map((neuronWeights) => {
        const neuronOutput = neuronWeights.reduce((sum, weight, index) => {
          return sum + weight * output[index];
        }, 0);
        return activationFunction(
          neuronOutput + biases[weights.indexOf(neuronWeights)]
        );
      });
    }
    return output;
  }

  backwardPropagation(output, target) {
    const error = [];
    for (let i = 0; i < output.length; i++) {
      error.push(output[i] - target[i]);
    }

    for (let i = this.layers.length - 2; i >= 0; i--) {
      const weights = this.weights[i];
      const nextWeights =
        i < this.layers.length - 2 ? this.weights[i + 1] : null;
      const biases = this.biases[i];
      const nextBiases = i < this.layers.length - 2 ? this.biases[i + 1] : null;
      const activationFunction = this.activationFunction;

      const newError = [];
      for (let j = 0; j < weights[0].length; j++) {
        let neuronError = 0;
        for (let k = 0; k < weights.length; k++) {
          const weight = weights[k][j];
          const nextNeuronError = nextWeights
            ? error[k] * nextWeights[k][j]
            : error[k];
          neuronError += weight * nextNeuronError;
        }
        newError.push(neuronError);
      }
      error.splice(0, error.length, ...newError);

      for (let j = 0; j < weights.length; j++) {
        for (let k = 0; k < weights[0].length; k++) {
          const weight = weights[j][k];
          const delta = error[j] * output[k] * (1 - output[k]);
          const weightDelta = delta * learningRate;
          const biasDelta = delta;

          weights[j][k] -= weightDelta;
          biases[j] -= biasDelta;
        }
      }
    }
    return error;
  }

  updateWeights(input, learningRate, error) {
    let output = input;
    for (let i = 0; i < this.layers.length - 1; i++) {
      const weights = this.weights[i];
      const biases = this.biases[i];
      const activationFunction = this.activationFunction;

      const newOutput = weights.map((neuronWeights) => {
        const neuronOutput = neuronWeights.reduce((sum, weight, index) => {
          return sum + weight * output[index];
        }, 0);
        return activationFunction(
          neuronOutput + biases[weights.indexOf(neuronWeights)]
        );
      });
      output = newOutput;
    }

    for (let i = this.layers.length - 2; i >= 0; i--) {
      const weights = this.weights[i];
      const biases = this.biases[i];
      const activationFunction = this.activationFunction;

      for (let j = 0; j < weights.length; j++) {
        for (let k = 0; k < weights[0].length; k++) {
          const weight = weights[j][k];
          const delta = error[j] * output[k] * (1 - output[k]);
          const weightDelta = delta * learningRate;
          const biasDelta = delta;

          weights[j][k] -= weightDelta;
          biases[j] -= biasDelta;
        }
      }
    }
  }

  predict(input) {
    return this.forwardPropagation(input);
  }
}

const examples = [
  [[0, 0], [0]],
  [[0, 1], [1]],
  [[1, 0], [1]],
  [[1, 1], [0]],
];

const mlp = new MultiLayerPerceptron(2, 1, [3]);

const learningRate = 0.1;
const epochs = 10000;
for (let i = 0; i < epochs; i++) {
  for (let example of examples) {
    const input = example[0];
    const target = example[1];
    const output = mlp.forwardPropagation(input);
    const error = mlp.backwardPropagation(output, target);
    mlp.updateWeights(input, learningRate, error);
  }
}

// Тестируем на обучающих примерах
for (let example of examples) {
  const input = example[0];
  const target = example[1];
  const output = mlp.predict(input);
  console.log(`Input: ${input}, Target: ${target}, Output: ${output}`);
}
