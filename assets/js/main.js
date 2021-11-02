const ingridents = document.querySelectorAll(".ingrident");
const burgerArea = document.querySelector("#burger-container");
const orderArea = document.querySelector(".order-item");
const ready = document.querySelector("#ready");
const coins = document.querySelector(".coins");
const pointsElement = document.querySelector("#points");
const deleteButton = document.querySelector("#delete");
const totalPoints = document.querySelector("#total-points");
const outdoor = document.querySelector(".outdoor");

const musicPlayer = new Audio("./assets/media/sfx/music.mp3");
const effectsPlayer = new Audio();

let draggingElement;
let points = 0;

let order = [];
let makingOrder = ["breadBottom"];

let soundEffects = {
  small: "./assets/media/sfx/small.mp3",
  other: "./assets/media/sfx/other.mp3",
  fail: "./assets/media/sfx/fail.mp3",
};

let burgerItems = {
  tomato: "./assets/media/tomato.svg",
  potato: "./assets/media/potato.svg",
  pickle: "./assets/media/pickle.svg",
  meat: "./assets/media/meat.svg",
  cheddar: "./assets/media/cheddar.svg",
  breadTop: "./assets/media/bread-top.svg",
  breadBottom: "./assets/media/bread-bottom.svg",
};

let safeBurgerItems = {
  tomato: burgerItems.tomato,
  cheddar: burgerItems.cheddar,
  meat: burgerItems.meat,
  pickle: burgerItems.pickle,
  potato: burgerItems.potato,
  ketchup: "ketcuk",
  maynez: "maynez",
};

let customers = {
  ayka: "./assets/media/customer.png",
  tosu: "./assets/media/customer2.png",
  rembo: "./assets/media/customer3.png",
  rte: "./assets/media/customer4.png",
  deli: "./assets/media/customer5.png",
  deli2: "./assets/media/customer6.png", // :D
};

let customerTexts = [
  `Salam məlöykü qadan alem\nMağa ordan bidene burgir ver.`,
  "Ölüm Ölüm.\nnevemçün burgir ver maa.",
  "Salam. Bu dünya niyə var?",
  "Aşağı yeri var burgirlerin?",
  "Burgir ver ama mayonezi bol olmasın.",
  "Getir bidene burgir.",
  "Salam.",
  ":)",
];

musicPlayer.play();

musicPlayer.addEventListener("ended", () => {
  musicPlayer.currentTime = 0;
  musicPlayer.play();
});

ingridents.forEach((ingrident) => {
  ingrident.addEventListener("dragstart", function (e) {
    dragStart.call(this, e);
  });

  ingrident.addEventListener("dragend", function (e) {
    dragEnd.call(this, e);
  });
});

burgerArea.addEventListener("dragover", function (e) {
  dragOver.call(this, e);
});

burgerArea.addEventListener("drop", function (e) {
  drop.call(this, e);
});

ready.addEventListener("click", function () {
  readyOrder();
});

deleteButton.addEventListener("click", function () {
  cancelCurrentMakingOrder();
});

function animateCoins(numCount = order.length) {
  if (order.length <= 5) {
    effectsPlayer.src = soundEffects.small;
  } else {
    effectsPlayer.src = soundEffects.other;
  }

  effectsPlayer.play();

  pointsElement.textContent = numCount * 10;

  [...Array(numCount)].forEach(() => {
    const coin = $("div", "", ["coin"]);
    coin.innerHTML = "🪙";
    coins.append(coin);
  });

  new mojs.Html({
    el: pointsElement,
    x: {
      0: "rand(-200, 200)",
    },
    y: {
      0: "rand(-50, 50)",
    },
    angleZ: {
      0: "rand(-30, 30)",
    },
    opacity: {
      1: 0,
    },
    duration: 1000,
  }).play();

  [...document.querySelectorAll(".coin")].forEach((coin) => {
    new mojs.Html({
      el: coin,
      y: {
        0: "rand(0, 200)",
      },
      x: {
        0: "rand(-200, 200)",
      },
      angleZ: {
        0: 360,
      },
      angleX: {
        0: 360,
      },
      opacity: {
        1: 0,
      },
      duration: "rand(1000, 1500)",
      onComplete: () => {
        document.querySelector(".coin").remove();
      },
    }).play();
  });
}

function byeCustomer(callback) {
  const customer = document.querySelector(".customer");
  const text = customer.querySelector(".customer-text");

  gsap.to(text, {
    opacity: 0,
    duration: 0.1,
  });

  customer.classList.add("bye");
  setTimeout(() => {
    customer.remove();
    callback();
  }, 2500);
}

function makeCustomer(callback) {
  const randomImg =
    Object.values(customers)[
      Math.floor(Math.random() * Object.values(customers).length)
    ];

  const customer = $("div", "", ["customer"], {
    top: "100%",
    opacity: 0,
  });
  const customerTextContainer = $("div", "", ["customer-text"]);
  const customerText = $("pre", "", []);
  const customerImage = $(
    "img",
    "",
    ["customer-image"],
    {},
    {
      src: randomImg,
    }
  );

  customerText.innerText =
    customerTexts[Math.floor(Math.random() * customerTexts.length)];

  customerTextContainer.appendChild(customerText);
  customer.appendChild(customerTextContainer);
  customer.appendChild(customerImage);

  outdoor.appendChild(customer);

  gsap
    .to(customer, {
      opacity: 1,
      top: "-20px",
    })
    .then(() => callback());
}

function cancelCurrentMakingOrder() {
  if (makingOrder.length != 1) {
    effectsPlayer.src = soundEffects.fail;
    effectsPlayer.play();

    points -= makingOrder.length * 10;
    totalPoints.textContent = points;

    [...burgerArea.children].slice(1).forEach((item) => {
      new mojs.Html({
        el: item,
        x: { 0: -100 },
        opacity: { 1: 0 },
        duration: 400,
        onComplete: function () {
          this.el.remove();
          makingOrder = ["breadBottom"];
          renderBurger();
        },
      }).play();
    });
  }
}

function readyOrder() {
  if (checkOrder()) {
    points += order.length * 10;
    totalPoints.textContent = points;
    animateCoins();
    clearOrder();

    byeCustomer(() => {
      makeCustomer();
      generateOrder();
    });

    makingOrder = ["breadBottom"];
    renderBurger();
  } else {
    console.log("failed order");
  }
}

function clearOrder() {
  orderArea.innerHTML = "";
}

function checkOrder() {
  let result = true;
  if (order.length == makingOrder.length) {
    order.forEach((orderItem, index) => {
      if (orderItem != makingOrder[index]) {
        result = false;
      }
    });
    return result;
  } else {
    return false;
  }
}

function dragStart(e) {
  draggingElement = this;
}

function dragEnd(e) {
  e.preventDefault();
  draggingElement = null;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  if (!makingOrder.includes("bread-top")) {
    makingOrder.push(draggingElement.dataset.type);
  }
  renderBurger();
}

function renderBurger() {
  burgerArea.innerHTML = "";

  makingOrder.forEach((part) => {
    if (part != "ketchup" && part != "maynez") {
      const newPart = $(
        "img",
        "",
        ["ingrident"],
        {},
        {
          draggable: "false",
          "data-type": part,
          src: burgerItems[part],
        }
      );
      burgerArea.append(newPart);
    } else {
      const text = $(
        "span",
        "",
        [`${part == "ketchup" ? "ketcuk" : part}-text`],
        {},
        {}
      );
      text.innerText = part.toUpperCase();

      burgerArea.append(text);
    }
  });
}

function $(tagName, id = "", className = [], styleObj = {}, attributeObj = {}) {
  let element = document.createElement(`${tagName}`);
  element.id = id;
  element.classList.add(...className);

  for (const [key, value] of Object.entries(styleObj)) {
    element.style[key] = value;
  }

  for (const [key, value] of Object.entries(attributeObj)) {
    element.setAttribute(key, value);
  }

  return element;
}

function generateOrder() {
  order = [];
  const orderName = $("span", "", ["order-name"]);
  orderName.innerText = getRandomOrderName();
  orderArea.innerHTML = "";

  const burgerTop = $(
    "img",
    "",
    ["ingrident"],
    {},
    {
      draggable: "false",
      "data-type": "breadTop",
      src: burgerItems.breadTop,
    }
  );

  const burgerBottom = $(
    "img",
    "",
    ["ingrident"],
    {},
    {
      draggable: "false",
      "data-type": "breadBottom",
      src: burgerItems.breadBottom,
    }
  );

  order.push("breadBottom");

  orderArea.append(burgerBottom);

  let loopCount = Math.floor(
    Math.random() * Object.keys(safeBurgerItems).length
  );
  console.log(loopCount, "loop");

  [...Array(loopCount == 0 ? ++loopCount : loopCount)].forEach(() => {
    const randomIngrident =
      Object.keys(safeBurgerItems)[
        Math.floor(Math.random() * Object.keys(safeBurgerItems).length)
      ];
    let element;

    if (randomIngrident == "ketchup" || randomIngrident == "maynez") {
      element = $("span", "", [`${randomIngrident == "ketchup" ? "ketcuk" : randomIngrident}-text`]);
      element.innerText = randomIngrident.toUpperCase();
    } else {
      element = $(
        "img",
        "",
        [],
        {},
        {
          src: safeBurgerItems[randomIngrident],
        }
      );
    }

    order.push(randomIngrident);
    orderArea.append(element);
  });

  order.push("breadTop");
  orderArea.append(burgerTop);
  orderArea.append(orderName);

  console.log(order);
}

function getRandomOrderName() {
  const names = [
    "Yemax",
    "Burgir Wooper",
    "Tosu Burger",
    "Zengilanli Burger",
    "Burger Murger",
    "Nenemin Burgeri",
    "Triple Tosu",
  ];

  return names[Math.floor(Math.random() * names.length)];
}

makeCustomer(generateOrder);
