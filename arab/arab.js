// Импорт необходимых библиотек
const tf = require("@tensorflow/tfjs-node");
const { loadMNIST } = require("mnist-png-node");

// Загрузка данных MNIST
const [xTrain, yTrain, xTest, yTest] = await loadMNIST();

// Создание модели
const model = tf.sequential();
model.add(tf.layers.flatten({ inputShape: [10, 10] }));
model.add(tf.layers.dense({ units: 10, activation: "softmax" }));

// Компиляция модели
model.compile({
  optimizer: "adam",
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

// Обучение модели
const batchSize = 128;
const epochs = 10;
const history = await model.fit(xTrain, yTrain, {
  batchSize,
  epochs,
  validationData: [xTest, yTest],
});

console.log("Обучение завершено.");

// Функция для преобразования изображения в вектор
function imageToVector(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  const tensor = tf.node.decodeImage(buffer);
  const resized = tf.image.resizeBilinear(tensor, [10, 10]);
  const normalized = resized.div(tf.scalar(255));
  const reshaped = normalized.reshape([1, 10, 10, 1]);
  return reshaped;
}

// Распознавание цифры на изображении
const imagePath = "./5.png";
const imageTensor = imageToVector(imagePath);
const prediction = history.predict(imageTensor);
const predictionArray = prediction.dataSync();
const predictedLabel = predictionArray.indexOf(Math.max(...predictionArray));

console.log(`Распознана цифра: ${predictedLabel}`);
