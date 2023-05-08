// Функция активации Хопфилда
function activation(x) {
  return x >= 0 ? 1 : -1;
}

// Создание данных поврежденных цифр
let damagedDigits = new Array(10);
for (let i = 0; i < 10; i++) {
  let digit = [
    [-1, -1, -1, -1, -1],
    [-1, 1, 1, 1, -1],
    [-1, 1, -1, 1, -1],
    [-1, 1, 1, 1, -1],
    [-1, -1, -1, -1, -1],
  ];
  let indices = new Set();
  while (indices.size < 7) {
    indices.add(Math.floor(Math.random() * 25));
  }
  for (let index of indices) {
    digit[Math.floor(index / 5)][index % 5] = -1;
  }
  damagedDigits[i] = digit;
}

// Создание вектора весов Хопфилда
let weights = new Array(25);
for (let i = 0; i < 25; i++) {
  weights[i] = new Array(25).fill(0);
}
for (let digit of damagedDigits) {
  let flattenedDigit = digit.flat();
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      weights[i][j] += flattenedDigit[i] * flattenedDigit[j];
    }
  }
}
for (let i = 0; i < 25; i++) {
  weights[i][i] = 0;
}

// Итерация по поврежденным цифрам для восстановления
for (let i = 0; i < 10; i++) {
  let flattenedDamagedDigit = damagedDigits[i].flat();
  for (let j = 0; j < 10; j++) {
    // Применение функции активации Хопфилда
    let result = weights.reduce((accumulator, currentValue, index) => {
      return accumulator + currentValue[j] * flattenedDamagedDigit[index];
    }, 0);
    result = activation(result);
    // Преобразование результата к матричному виду
    let resultMatrix = new Array(5);
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      resultMatrix[rowIndex] = result.slice(rowIndex * 5, (rowIndex + 1) * 5);
    }
    // Вывод результата
    console.log(`Recovered digit ${i}:`);
    console.log(resultMatrix);
    console.log();
  }
}
