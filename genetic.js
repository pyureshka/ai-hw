// Задаем константы и настройки алгоритма
const POPULATION_SIZE = 100; // размер популяции
const ELITE_RATIO = 0.1; // доля элитных особей
const MUTATION_RATE = 0.1; // вероятность мутации гена

// Определяем функцию f(x,y)
function f(x, y) {
  return 1 / (1 + x * x + y * y);
}

// Определяем функцию вычисления приспособленности особи
function fitness(x, y) {
  return f(x, y);
}

// Определяем функцию создания начальной популяции
function createPopulation(size) {
  const population = [];
  for (let i = 0; i < size; i++) {
    population.push({
      x: Math.random() * 10 - 5,
      y: Math.random() * 10 - 5,
    });
  }
  return population;
}

// Определяем функцию выбора родителей
function selectParent(population) {
  const fitnesses = population.map((individual) =>
    fitness(individual.x, individual.y)
  );
  const sumFitness = fitnesses.reduce((acc, val) => acc + val, 0);
  const probabilities = fitnesses.map((fit) => fit / sumFitness);
  const random = Math.random();
  let i = 0;
  let sum = probabilities[i];
  while (sum < random) {
    i++;
    sum += probabilities[i];
  }
  return population[i];
}

// Определяем функцию скрещивания двух особей
function crossover(parent1, parent2) {
  return {
    x: (parent1.x + parent2.x) / 2,
    y: (parent1.y + parent2.y) / 2,
  };
}

// Определяем функцию мутации особи
function mutate(individual) {
  if (Math.random() < MUTATION_RATE) {
    return {
      x: individual.x + (Math.random() * 2 - 1),
      y: individual.y + (Math.random() * 2 - 1),
    };
  }
  return individual;
}

// Определяем функцию отбора элитных особей
function selectElite(population) {
  const eliteSize = Math.round(POPULATION_SIZE * ELITE_RATIO);
  population.sort((a, b) => fitness(b.x, b.y) - fitness(a.x, a.y));
  return population.slice(0, eliteSize);
}

// Определяем функцию генетического алгоритма
function geneticAlgorithm() {
  // Создаем начальную популяцию
  let population = createPopulation(POPULATION_SIZE);

  for (let i = 0; i < 100; i++) {
    // Выбираем элитных особей
    const elite = selectElite(population);

    // Выбираем родителей
    const parents = [];
    for (let j = 0; j < POPULATION_SIZE - elite.length; j++) {
      const parent1 = selectParent(population);
      const parent2 = selectParent(population);
      parents.push({ parent1, parent2 });
    }

    // Скрещиваем родителей
    const offspring = [];
    for (let j = 0; j < POPULATION_SIZE - elite.length; j++) {
      const { parent1, parent2 } = parents[j];
      offspring.push(crossover(parent1, parent2));
    }

    // Мутируем потомство
    const mutatedOffspring = offspring.map(mutate);

    // Объединяем элитных особей и потомство
    population = elite.concat(mutatedOffspring);
  }

  // Находим лучшую особь
  const bestIndividual = population.reduce(
    (acc, individual) =>
      fitness(individual.x, individual.y) > fitness(acc.x, acc.y)
        ? individual
        : acc,
    population[0]
  );

  console.log(
    `x: ${bestIndividual.x}, y: ${bestIndividual.y}, f(x,y): ${f(
      bestIndividual.x,
      bestIndividual.y
    )}`
  );
}

geneticAlgorithm();

// Определяем функцию выбора родителей с использованием метода рулетки
function selectParent(population) {
  const fitnesses = population.map((individual) =>
    fitness(individual.x, individual.y)
  );
  const maxFitness = Math.max(...fitnesses);
  const scaledFitnesses = fitnesses.map((fit) => fit / maxFitness);
  const cumulativeProbabilities = scaledFitnesses.reduce(
    (acc, val, i) => acc.concat(i == 0 ? val : val + acc[i - 1]),
    []
  );
  const random = Math.random();
  let i = 0;
  let sum = cumulativeProbabilities[i];
  while (sum < random) {
    i++;
    sum = cumulativeProbabilities[i];
  }
  return population[i];
}

geneticAlgorithm();
