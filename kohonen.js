const brain = require("brain.js");
const mnist = require("mnist");

// создание сети встречного распространения
const net = new brain.CounterPropagation({
  inputSize: 784, // размер входного слоя (28x28 пикселей)
  outputSize: 10, // количество классов (цифр от 0 до 9)
});

// загрузка обучающих данных MNIST
const set = mnist.set(60000, 10000);

// обучение сети на данных MNIST
net.train(set.training, {
  learningRate: 0.1, // скорость обучения
  errorThresh: 0.005, // порог ошибки
  log: true, // выводить логи в консоль
});

// тестирование сети на тестовых данных MNIST
const accuracy = net.test(set.test);
console.log(`Accuracy: ${accuracy}%`);

// создание однослойного перцептрона
const perceptron = new brain.NeuralNetwork({
  inputSize: 784, // размер входного слоя (28x28 пикселей)
  outputSize: 10, // количество классов (цифр от 0 до 9)
});

// обучение перцептрона на данных MNIST
perceptron.train(set.training, {
  learningRate: 0.1, // скорость обучения
  errorThresh: 0.005, // порог ошибки
  log: true, // выводить логи в консоль
});

// тестирование перцептрона на тестовых данных MNIST
const accuracy2 = perceptron.test(set.test);
console.log(`Accuracy 2: ${accuracy2}%`);
