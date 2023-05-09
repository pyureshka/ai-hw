function DCanvas(el) {
  const ctx = el.getContext("2d");
  const pixel = 20;

  let isMouseDown = false;

  canv.width = 500;
  canv.height = 500;

  this.drawLine = function (x1, y1, x2, y2, color = "gray") {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineJoin = "miter";
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // отрисовка ячеек сетки
  this.drawCell = function (x, y, w, h) {
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.lineJoin = "miter";
    ctx.lineWidth = 1;
    ctx.rect(x, y, w, h);
    ctx.fill();
  };

  // очистка холста
  this.clear = function () {
    ctx.clearRect(0, 0, canv.width, canv.height);
  };

  this.drawGrid = function () {
    const w = canv.width;
    const h = canv.height;
    const p = w / pixel;

    const xStep = w / p;
    const yStep = h / p;

    for (let x = 0; x < w; x += xStep) {
      this.drawLine(x, 0, x, h);
    }

    for (let y = 0; y < h; y += yStep) {
      this.drawLine(0, y, w, y);
    }
  };

  this.calculate = function (draw = false) {
    const w = canv.width;
    const h = canv.height;
    const p = w / pixel;

    const xStep = w / p;
    const yStep = h / p;

    const vector = [];
    let _draw = [];

    for (let x = 0; x < w; x += xStep) {
      for (let y = 0; y < h; y += yStep) {
        const data = ctx.getImageData(x, y, xStep, yStep);
        let notEmptyCount = 0;
        for (i = 0; i < data.data.length; i += 10) {
          const isEmpty = data.data[i] === 0;

          if (!isEmpty) {
            notEmptyCount++;
          }
        }

        if (notEmptyCount > 1 && draw) {
          _draw.push([x, y, xStep, yStep]);
        }

        vector.push(notEmptyCount > 1 ? 1 : 0);
      }
    }

    if (draw) {
      this.clear();
      this.drawGrid();

      for (_d in _draw) {
        this.drawCell(_draw[_d][0], _draw[_d][1], _draw[_d][2], _draw[_d][3]);
      }
    }

    return vector;
  };

  el.addEventListener("mousedown", function (e) {
    isMouseDown = true;
    ctx.beginPath();
  });

  el.addEventListener("mouseup", function (e) {
    isMouseDown = false;
  });

  el.addEventListener("mousemove", function (e) {
    if (isMouseDown) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
      ctx.lineWidth = pixel;

      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, pixel / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }
  });
}

let vector = [];
let net = null;
let trainData = [];
const model = tf.sequential();

function updateMsg(val) {
  msg.innerHTML = val;
}

let msg = document.getElementById("msg");

// инициализируем холст
const d = new DCanvas(document.getElementById("canv"));

function onClearCanvas() {
  d.clear();
}

function onData() {
  vector = d.calculate(true);

  // train
  if (confirm("Positive?")) {
    trainData.push({
      input: vector, // одномерный массив размером 625
      output: [1, 0], // класс "positive"
    });

    d.clear();
  } else {
    trainData.push({
      input: vector, // одномерный массив размером 625
      output: [0, 1], // класс "negative"
    });

    d.clear();
  }
}

function onTrain() {
  updateMsg("Тренируем...");

  model.add(
    tf.layers.conv1d({
      inputShape: [625, 1], // длина одномерного входного массива
      filters: 16, // количество фильтров
      kernelSize: 3, // размер ядра свертки
      activation: "relu", // функция активации
    })
  );

  model.add(
    tf.layers.maxPooling1d({
      poolSize: 2, // размер пула
      strides: 2, // шаг перемещения
    })
  );

  model.add(tf.layers.flatten());

  model.add(
    tf.layers.dense({
      units: 64, // количество нейронов в слое
      activation: "relu", // функция активации
    })
  );

  model.add(
    tf.layers.dense({
      units: 2, // количество нейронов в слое
      activation: "softmax", // функция активации
    })
  );

  model.compile({
    loss: "meanSquaredError", // функция потерь
    optimizer: "adam", // оптимизатор
  });

  const trainX = tf.tensor(
    trainData.map((data) => data.input),
    [trainData.length, 625, 1]
  );
  const trainY = tf.tensor(
    trainData.map((data) => data.output, [trainData.length, 2, 1])
  );

  model
    .fit(trainX, trainY, {
      epochs: 5, // количество эпох
    })
    .then(() => {
      updateMsg("Завершено!");
    });
}

function getResult() {
  const testX = tf.tensor(d.calculate(), [1, 625, 1]);
  const prediction = model.predict(testX);
  const result = prediction.dataSync()[0] > 0.5 ? "positive" : "negative";
  updateMsg(result);
}
