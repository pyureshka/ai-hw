class Perceptron {
  constructor(numInputs) {
    this.weights = new Array(numInputs + 1); // +1 для bias
    for (var i = 0; i < this.weights.length; i++) {
      this.weights[i] = Math.random() * 2 - 1; // случайные значения весов
    }
  }

  predict(inputs) {
    var sum = 0;
    for (var i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    sum += this.weights[inputs.length]; // bias
    return sum >= 0 ? 1 : 0; // бинарный выход
  }
}
function trainPerceptronGenetic(
  inputs,
  targets,
  populationSize,
  tournamentSize,
  mutationRate,
  targetFitness,
  maxGenerations
) {
  var numInputs = inputs[0].length;
  var population = [];

  // Создаем начальную популяцию
  for (var i = 0; i < populationSize; i++) {
    var chromosome = {
      weights: new Array(numInputs + 1),
    };
    for (var j = 0; j < chromosome.weights.length; j++) {
      chromosome.weights[j] = Math.random() * 2 - 1; // случайные значения весов
    }
    population.push(chromosome);
  }

  // Функция приспособленности для оценки качества хромосомы
  function fitnessFunction(chromosome) {
    var perceptron = new Perceptron(numInputs);
    perceptron.weights = chromosome.weights;
    var numCorrect = 0;
    for (var i = 0; i < inputs.length; i++) {
      var prediction = perceptron.predict(inputs[i]);
      if (prediction === targets[i]) {
        numCorrect++;
      }
    }
    return numCorrect / inputs.length;
  }

  // Генетические операторы
  function crossover(parent1, parent2) {
    var child = {
      weights: [],
    };
    for (var i = 0; i < parent1.weights.length; i++) {
      child.weights.push(
        Math.random() < 0.5 ? parent1.weights[i] : parent2.weights[i]
      );
    }
    return child;
  }

  function mutate(chromosome) {
    for (var i = 0; i < chromosome.weights.length; i++) {
      if (Math.random() < mutationRate) {
        chromosome.weights[i] += Math.random() * 2 - 1; // случайное изменение веса
      }
    }
  }

  // Цикл эволюции популяции
  var generation = 0;
  var bestFitness = 0;
  var bestChromosome = null;

  while (generation < maxGenerations && bestFitness < targetFitness) {
    // Выбор родителей для скрещивания
    var parentPool = [];
    for (var i = 0; i < tournamentSize; i++) {
      var index = Math.floor(Math.random() * population.length);
      parentPool.push(population[index]);
    }
    parentPool.sort((a, b) => fitnessFunction(b) - fitnessFunction(a)); // сортировка по убыванию приспособленности
    // Скрещивание и мутация
    var children = [];
    for (var i = 0; i < populationSize; i++) {
      var parent1 = parentPool[Math.floor(Math.random() * tournamentSize)];
      var parent2 = parentPool[Math.floor(Math.random() * tournamentSize)];
      var child = crossover(parent1, parent2);
      mutate(child);
      children.push(child);
    }

    // Замена популяции на потомков
    population = children;

    // Оценка качества популяции
    for (var i = 0; i < population.length; i++) {
      var fitness = fitnessFunction(population[i]);
      if (fitness > bestFitness) {
        bestFitness = fitness;
        bestChromosome = population[i];
      }
    }

    console.log(`Generation ${generation}: best fitness = ${bestFitness}`);
    generation++;
  }
  // Возвращаем лучшую хромосому
  var perceptron = new Perceptron(numInputs);
  perceptron.weights = bestChromosome.weights;
  return perceptron;
}

// var iris = {
//   inputs: [
//     [5.1, 3.5, 1.4, 0.2],
//     [4.9, 3.0, 1.4, 0.2],
//     [4.7, 3.2, 1.3, 0.2],
//   ],
//   targets: [0, 0, 0],
// };

// var perceptron = trainPerceptronGenetic(
//   iris.inputs,
//   iris.targets,
//   100,
//   10,
//   0.1,
//   0.95,
//   1000
// );
