"use strict";

//= utils/variable.js
//= utils/utils.js
//= data/pizza.data.js

//= components/headerListDecor.js
//= components/switchHero.js
//= components/promoVideo.js
//= components/footer.js

//Utils
const utilsFormat = formatUtils();
const utilsStorage = storageUtils();
const utilsDOM = domUtils();
const utilsRender = renderUtils();
const utilsData = dataUtils();
const utilsPizza = pizzaUtils();
const utilsCart = cartUtils();

// DATA
const ingredients = getIngredients();
const flatIngredients = Object.values(ingredients).flat();
const pizzaProducts = utilsData.normalizePizzaIngredients(
  getPizzaData(),
  flatIngredients
);
const flatPizzaProducts = Object.values(pizzaProducts).flat();
// KEY = SIZE PIZZA
const INGR_PRICE_COEFF = {
  22: 1,
  28: 1.27,
  33: 1.5,
};

const KEY = {
  NO_INGREDIENTS: "no-custom-ingredients",
  SEPARATOR: "_",
};

// DOM


// sections page
const $menuPizza = document.getElementById("menuPizza");
// const $modalMenu = document.getElementById('#overlay-menu');


// ДЛЯ РАБОТЫ ЛОГИКИ ОТКРЫТИЯ/ЗАКРЫТИЯ POP UP КАСТОМИЗАЦИИ ПИЦЦЫ,
// ИСПОЛЬЗУЕМ НАТИВНЫЙ  html тег dialog
const $menuOverlay = document.getElementById("overlay-menu");



const $heroPizza = document.getElementById("hero");
const $eventsPizza = document.getElementById("events");
const $aboutPizza = document.getElementById("about");
const $footer = document.getElementById("footer");




// elements

//$activeCustomizeTrigger Хранит ссылку на кнопку, открывшую панель кастомизации пиццы. 
// Используется для управления атрибутом aria-expanded.
let $activeCustomizeTrigger = null;

const $btnCloseCustomPanel = document.getElementById("custom-panel-close");
const $videoMenu = document.getElementById("video-promo");
const $cartBtn = document.getElementById("cartBtn");
const $countCart = document.querySelector(".cart-btn__count");
const $tabsContainer = document.getElementById("tabs");
const $tabsButtons = document.querySelectorAll(".menu__tab-btn button");
const $topContainerCards = document.getElementById("top-cards");
const $bottomContainerCards = document.getElementById("bottom-cards");
const $staticTopContainerCards = document.getElementById("top-static-cards");
const $staticBottomContainerCards = document.getElementById(
  "bottom-static-cards"
);
const $allStaticCards = document.querySelectorAll(
  "#top-static-cards .pizza-card, #bottom-static-cards .pizza-card"
);
const $ingredientsPanel = document.getElementById("panel-ingredients");
const $pizzaInfoPanel = document.getElementById("panel-info-pizza");

// state
const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : {};
let popUpPizzaData = {};


// контейнер для добавленных ингредиентов.ВСЕГДА ОЧИЩАТЬ ПРИ ЗАКРЫТИИ ПАНЕЛИ КАСТОМИЗАЦИИ ПИЦЦЫ
let addedIngredients = [];

// logic cart icon count
utilsCart.updateCartItemCount({
  targetElement: $countCart,
  quantity: utilsCart.getQuantity({ cart, propertyQuantity: "pizzaQuantity" }),
  activeClass: "cart-btn__count--active",
});

// header list decor
initHeaderListUi([$menuPizza, $heroPizza, $eventsPizza, $aboutPizza, $footer]);

// hero switch
initSwitchHero($menuPizza);

// video menu
initVideoPromo($videoMenu, $videoMenu);

// footer
initFooter($footer);

//  tabs ----------------------------------------------------------------------
$tabsContainer.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const category = button.getAttribute("data-category");

  $tabsButtons.forEach((tab) => {
    tab.classList.remove("btn--accent");
    const li = tab.closest("li");
    if (li) {
      li.classList.remove("menu__tab-btn--active");
    }
  });

  button.classList.add("btn--accent");
  const li = button.closest("li");

  if (li) {
    li.classList.add("menu__tab-btn--active");
  }

  if (category === "all") {
    utilsDOM.addClassToAll({
      className: "d-none",
      arrElements: [$topContainerCards, $bottomContainerCards],
    });
    utilsDOM.removeClassFromAll({
      className: "d-none",
      arrElements: [$staticTopContainerCards, $staticBottomContainerCards],
    });

    $allStaticCards.forEach((card) => {
      utilsPizza.resetPizzaCard({
        pizzaCardElem: card,
        sizeValue: 22,
        pizzaQuantity: 1,
        callbackFormat: utilsFormat.formatPrice,
      });

      utilsPizza.updateBtn({
        parentElement: card,
        pizzaQuantity: 1,
      });
    });
    return;
  }

  utilsDOM.removeClassFromAll({
    className: "d-none",
    arrElements: [$topContainerCards, $bottomContainerCards],
  });
  utilsDOM.addClassToAll({
    className: "d-none",
    arrElements: [$staticTopContainerCards, $staticBottomContainerCards],
  });

  utilsDOM.clearContainer($topContainerCards);
  utilsDOM.clearContainer($bottomContainerCards);

  let cardsTopData;
  let cardsBottomData;

  cardsTopData = pizzaProducts[category].slice(0, 4);
  cardsBottomData = pizzaProducts[category].slice(4);

  if (cardsTopData.length) {
    const arrCards = utilsRender.renderAllCards(
      cardsTopData,
      utilsFormat.formatPrice
    );
    $topContainerCards.innerHTML = `${arrCards.join("")}`;
  }

  if (cardsBottomData.length) {
    const arrCards = utilsRender.renderAllCards(
      cardsBottomData,
      utilsFormat.formatPrice
    );
    $bottomContainerCards.innerHTML = `${arrCards.join("")}`;
  }
});

// -----------------------------------------------------------------------------

// handle pop up panel custom pizza
$menuOverlay.addEventListener("click", (e) => {
  // logic close pop up
  if (
    !e.target.closest(".menu__panel") ||
    e.target.closest("#custom-panel-close")
  ) {
    $menuOverlay.close();
    return;
  }

  const sizePizza = popUpPizzaData.pizzaData.size;
  const idPizza = popUpPizzaData.pizzaData.customPizza.id;

  // logic increment decrement  pizza in the pop up
  if (e.target.closest(".panel-pizza__btn-quantity")) {
    if (e.target.classList.contains("increment-quantity")) {
      ++popUpPizzaData.pizzaData.customQuantity;
    } else {
      --popUpPizzaData.pizzaData.customQuantity;
    }

    if (
      popUpPizzaData.pizzaData.customQuantity >= MAX_PIZZA - 1 ||
      popUpPizzaData.pizzaData.customQuantity <= 2
    ) {
      // update btn quantity in the card pizza
      utilsPizza.updateBtn({
        parentElement: popUpPizzaData.cardElement,
        pizzaQuantity: popUpPizzaData.pizzaData.customQuantity,
      });
      // update btn quantity in the pop up pizza
      utilsPizza.updateBtn({
        parentElement: $pizzaInfoPanel,
        pizzaQuantity: popUpPizzaData.pizzaData.customQuantity,
      });
    }

    // set total number pizza in the panel pop up
    utilsPizza.setPizzaQuantity({
      parentElement: $pizzaInfoPanel,
      quantity: popUpPizzaData.pizzaData.customQuantity,
      selector: ".quantity",
    });
    // set total number pizza in the card
    utilsPizza.setPizzaQuantity({
      parentElement: popUpPizzaData.cardElement,
      quantity: popUpPizzaData.pizzaData.customQuantity,
      selector: ".quantity",
    });

    // calculation logic pricePerPizza and totalPrice
    const pricePerPizza =
      popUpPizzaData.pizzaData.customPizza.price[popUpPizzaData.pizzaData.size];
    const totalPrice = utilsFormat.formatPrice(
      popUpPizzaData.pizzaData.customQuantity * pricePerPizza
    );

    // set total price pizza in the panel pop up
    utilsPizza.setPricePizza({
      parentElement: $pizzaInfoPanel,
      price: totalPrice,
      selector: ".total-price",
    });

    // set total price pizza in the card pizza
    utilsPizza.setPricePizza({
      parentElement: popUpPizzaData.cardElement,
      price: totalPrice,
      selector: ".total-price",
    });

    return;
  }

  // logic add ingredient in the pop up
  const btnIngredient = e.target.closest(".panel-ingredients__value");

  if (btnIngredient) {
    const $customPanelIngredients =
      document.getElementById("custom-ingredients");

    const idIngredient = +btnIngredient.getAttribute("data-id");
    const ingredient = flatIngredients.find(
      (ingredient) => ingredient.id === idIngredient
    );
    const nameIngredient = ingredient.name;
    // Цена ингредиентов в зависимости от размера пиццы, рассчитывается через коэффициент 
    const priceIngredient = ingredient.price * INGR_PRICE_COEFF[sizePizza];

    // ui - выбор ингредиента 
    btnIngredient.classList.toggle("panel-ingredients__value--add");
    // проверяем добавлен ли ингредиент 
    const ingredientIsSelected = btnIngredient.classList.contains(
      "panel-ingredients__value--add"
    );
    btnIngredient.setAttribute("aria-checked", ingredientIsSelected);

    if (ingredientIsSelected) {
      popUpPizzaData.pizzaData.customPizza.price[sizePizza] =
        popUpPizzaData.pizzaData.customPizza.price[sizePizza] + priceIngredient;

      popUpPizzaData.pizzaData.customPizza.ingredients = [
        ...popUpPizzaData.pizzaData.customPizza.ingredients,
        nameIngredient,
      ];

      addedIngredients.push(
        flatIngredients.find((ingredient) => ingredient.id === idIngredient)
      );
    } else {
      popUpPizzaData.pizzaData.customPizza.price[sizePizza] =
        popUpPizzaData.pizzaData.customPizza.price[sizePizza] - priceIngredient;

      const indexDel = addedIngredients.findIndex(
        (ingredient) => ingredient.id === idIngredient
      );

      if (indexDel !== -1) {
        addedIngredients.splice(indexDel, 1);
      }
    }

    // рендер добавленных ингредиентов, аргумент  "-"  рендерится если ингредиентов доп. нет !
    $customPanelIngredients.innerHTML = utilsRender.renderTextIngredients(
      addedIngredients.map((ingredient) => ingredient.name),
      "-"
    );

    const pricePerPizza = utilsFormat.formatPrice(
      popUpPizzaData.pizzaData.customPizza.price[popUpPizzaData.pizzaData.size]
    );

    // set total price pizza in the panel pop up
    const totalPrice = utilsFormat.formatPrice(
      popUpPizzaData.pizzaData.customQuantity * pricePerPizza
    );

    // set total price pizza in the pop up
    utilsPizza.setPricePizza({
      parentElement: $pizzaInfoPanel,
      price: totalPrice,
      selector: ".total-price",
    });

    // set  price per custom pizza in the pop up
    utilsPizza.setPricePizza({
      parentElement: $pizzaInfoPanel,
      price: pricePerPizza,
      selector: ".custom-price-one",
    });

    // set  price per custom pizza in the card
    utilsPizza.setPricePizza({
      parentElement: popUpPizzaData.cardElement,
      price: totalPrice,
      selector: ".total-price",
    });
    return;
  }


  const btnOrderNow = e.target.closest(".menu__panel-btn");

  if (btnOrderNow) {
    const keyIngredients =
      addedIngredients
        .map((ingredient) => ingredient.id)
        .sort((a, b) => a - b)
        .join("-") || KEY.NO_INGREDIENTS;

    addToCart({
      cart,
      idPizza,
      sizePizza,
      keyIngredients,
      pizzaQuantity: popUpPizzaData.pizzaData.customQuantity,
      pricePerPizza: popUpPizzaData.pizzaData.customPizza.price[sizePizza],
      namePizza: popUpPizzaData.pizzaData.customPizza.namePizza,
      image: popUpPizzaData.pizzaData.customPizza.image,
      separator: KEY.SEPARATOR,
      addedIngredients,
    });
    utilsStorage.saveCart(cart);
    alert("Pizza added to cart");
   

    utilsCart.updateCartItemCount({
      targetElement: $countCart,
      quantity: utilsCart.getQuantity({
        cart,
        propertyQuantity: "pizzaQuantity",
      }),
      activeClass: "cart-btn__count--active",
    });
    $menuOverlay.close();
  }
});

$menuOverlay.addEventListener("keydown", (e) => {
  
  if (e.key === "Enter" || e.key === " ") {
    const btnIngredient = e.target.closest(".panel-ingredients__value");
    
    if (btnIngredient) {
      e.preventDefault(); // Чтобы страница не скроллилась при нажатии на пробел

      // имитируем клик
      btnIngredient.click();

    }
  }
});

$menuOverlay.addEventListener('close',(e)=> {
  console.log('CLOSE POP UP');
  cleanupPizzaPopup({
    pizzaCardElem: popUpPizzaData.cardElement,
    sizeValue: popUpPizzaData.pizzaData.size,
    pizzaQuantity: popUpPizzaData.pizzaData.defaultQuantity,
    callbackFormat: utilsFormat.formatPrice,
  });
  popUpPizzaData = {};
})



function cleanupPizzaPopup({
  pizzaCardElem,
  sizeValue = 22,
  pizzaQuantity = 1,
  callbackFormat,
}) {
  // $menuOverlay.classList.remove("menu__overlay--active");
  console.log('cleanupPizzaPopup');
  utilsDOM.unlockScroll();
  utilsDOM.clearContainer($pizzaInfoPanel);
  utilsDOM.clearContainer($ingredientsPanel);
  addedIngredients = [];

  // initial prev state card pizza
  utilsPizza.resetPizzaCard({
    pizzaCardElem,
    sizeValue,
    pizzaQuantity,
    callbackFormat,
  });

  // update btn quantity in the card pizza
  utilsPizza.updateBtn({
    parentElement: pizzaCardElem,
    pizzaQuantity,
  });

  // remove active state card ingredients
  // метод не нужен, так как рендер карточек ингредиентов при каждом открытии pop up доп. кастомизации пиццы
  // utilsDOM.removeClassFromAll({
  //   selector: ".panel-ingredients__value--add",
  //   className: "panel-ingredients__value--add",
  // });

  // AREA
  $activeCustomizeTrigger.setAttribute('aria-expanded', false);
  console.log($activeCustomizeTrigger);
  // $activeCustomizeTrigger.focus();   
  $activeCustomizeTrigger = null;   
}









// HANDLE CUSTOM PIZZA IN THE CARD ------------------------------------------
$menuPizza.addEventListener("click", (e) => {
  if (!e.target.closest(".pizza-card__customize-btn")) return;

  // get dom elements
  const $pizzaCard = e.target.closest(".pizza-card");
  const $form = $pizzaCard.querySelector(".pizza-card__form");
  // AREA
  $activeCustomizeTrigger = e.target.closest(".pizza-card__customize-btn");

  if (!$pizzaCard || !$form) return;


  // get state data
  const idPizza = utilsPizza.getPizzaId($pizzaCard);
  const sizePizza = utilsPizza.getPizzaSize($form);
  const pizzaQuantity = utilsPizza.getPizzaQuantity($pizzaCard);
  const pizza = flatPizzaProducts.find((pizza) => pizza.id === idPizza);

  // clone data
  const clonePizza = utilsData.deepClone(pizza);

  // set data for panel customs ingredients
  popUpPizzaData = {
    pizzaData: {
      defaultPizza: pizza,
      customPizza: clonePizza,
      size: sizePizza,
      customQuantity: pizzaQuantity,
      defaultQuantity: pizzaQuantity,
    },
    cardElement: $pizzaCard,
  };

  // set elements cards ingredients in the obj
  const ingredientsHTML = {};
  ingredientsHTML.meats = utilsRender.renderCardsIngredients(
    ingredients.meats,
    INGR_PRICE_COEFF[sizePizza]
  );
  ingredientsHTML.cheeses = utilsRender.renderCardsIngredients(
    ingredients.cheeses,
    INGR_PRICE_COEFF[sizePizza]
  );
  ingredientsHTML.seafood = utilsRender.renderCardsIngredients(
    ingredients.seafood,
    INGR_PRICE_COEFF[sizePizza]
  );

  // render elements for the customs ingredients
  utilsRender.renderPanelAddIngredients(ingredientsHTML, $ingredientsPanel);
  utilsRender.renderPanelInfoPizza({
    pizzaData: pizza,
    sizePizza,
    pizzaQuantity,
    container: $pizzaInfoPanel,
    callbackFormat: utilsFormat.formatPrice,
  });
  // set style btn Quantity, for the customs ingredients pop up panel (on/off)
  utilsPizza.updateBtn({
    parentElement: $pizzaInfoPanel,
    pizzaQuantity: popUpPizzaData.pizzaData.customQuantity,
  });

  // $menuOverlay.classList.add("menu__overlay--active");
  utilsDOM.lockScroll();

  // Area
  $activeCustomizeTrigger.setAttribute('aria-expanded', true);
  // $btnCloseCustomPanel.focus();
  $menuOverlay .showModal(); 
});
// HANDLE CLICK ORDER NOW IN THE  CARD---------------------------------------
$menuPizza.addEventListener("click", (e) => {
  if (!e.target.closest(".pizza-card__order")) return;

  const $pizzaCard = e.target.closest(".pizza-card");
  const $form = $pizzaCard.querySelector(".pizza-card__form");
  if (!$pizzaCard || !$form) return;

  const idPizza = utilsPizza.getPizzaId($pizzaCard);
  const pizzaData = flatPizzaProducts.find((pizza) => idPizza === pizza.id);
  const namePizza = pizzaData.namePizza;
  const pizzaQuantity = utilsPizza.getPizzaQuantity($pizzaCard);
  const sizePizza = utilsPizza.getPizzaSize($form);
  const pricePerPizza = pizzaData.price[sizePizza];


  addToCart({
    cart,
    idPizza,
    sizePizza,
    keyIngredients: KEY.NO_INGREDIENTS,
    pizzaQuantity,
    pricePerPizza,
    namePizza,
    image: pizzaData.image,
    separator: KEY.SEPARATOR,
  });

  utilsCart.updateCartItemCount({
    targetElement: $countCart,
    quantity: utilsCart.getQuantity({
      cart,
      propertyQuantity: "pizzaQuantity",
    }),
    activeClass: "cart-btn__count--active",
  });
  utilsPizza.resetPizzaCard({
    pizzaCardElem: $pizzaCard,
    sizeValue: 22,
    pizzaQuantity: 1,
    callbackFormat: utilsFormat.formatPrice,
  });
  utilsStorage.saveCart(cart);

  alert("Pizza added to cart");

});
// HANDLE CHANGE QUANTITY BTN PIZZA IN THE CARD ----------------------------
$menuPizza.addEventListener("click", (e) => {
  if (!e.target.closest(".pizza-card__quantity-btn")) return;

  const $pizzaCard = e.target.closest(".pizza-card");
  const $form = $pizzaCard.querySelector(".pizza-card__form");

  if (!$pizzaCard || !$form) return;

  let pizzaQuantity = utilsPizza.getPizzaQuantity($pizzaCard);
  const pricePerPizza = utilsPizza.getPricePerPizza($form);

  if (e.target.closest(".increment-quantity")) {
    ++pizzaQuantity;
  } else if (e.target.closest(".decrement-quantity")) {
    --pizzaQuantity;
  }

  if (pizzaQuantity >= MAX_PIZZA - 1 || pizzaQuantity <= 2) {
    utilsPizza.updateBtn({
      parentElement: $pizzaCard,
      pizzaQuantity,
    });
  }

  const totalPrice = utilsFormat.formatPrice(pizzaQuantity * pricePerPizza);
  utilsPizza.setPricePizza({
    parentElement: $pizzaCard,
    price: totalPrice,
    selector: ".total-price",
  });
  utilsPizza.setPizzaQuantity({
    parentElement: $pizzaCard,
    quantity: pizzaQuantity,
    selector: ".quantity",
  });
});
// HANDLE CHANGE SIZE PIZZA IN THE CARD ------------------------------
$menuPizza.addEventListener("change", (e) => {
  if (!e.target.closest(".pizza-card__size-radio")) return;

  const $pizzaCard = e.target.closest(".pizza-card");
  const $form = $pizzaCard.querySelector(".pizza-card__form");

  if (!$pizzaCard || !$form) return;

  const pizzaQuantity = utilsPizza.getPizzaQuantity($pizzaCard);
  const pricePerPizza = utilsPizza.getPricePerPizza($form);

  const totalPrice = utilsFormat.formatPrice(pizzaQuantity * pricePerPizza);

  utilsPizza.setPricePizza({
    parentElement: $pizzaCard,
    price: totalPrice,
    selector: ".total-price",
  });
});

function addToCart({
  cart,
  idPizza,
  sizePizza,
  keyIngredients,
  pizzaQuantity,
  pricePerPizza,
  namePizza,
  image = "",
  addedIngredients = [],
  separator = "_",
}) {
  if (cart[idPizza + separator + sizePizza + separator + keyIngredients]) {
    console.log("уже есть пицца-карточка");
    cart[
      idPizza + separator + sizePizza + separator + keyIngredients
    ].pizzaQuantity += pizzaQuantity;
    cart[
      idPizza + separator + sizePizza + separator + keyIngredients
    ].totalPrice =
      cart[idPizza + separator + sizePizza + separator + keyIngredients]
        .pizzaQuantity * pricePerPizza;
  } else {
    console.log("новая пицца карточка");
    cart[idPizza + separator + sizePizza + separator + keyIngredients] = {
      namePizza: namePizza,
      image,
      pizzaQuantity,
      sizePizza,
      totalPrice: pizzaQuantity * pricePerPizza,
      pricePerPizza,
      addedIngredients,
    };
  }
}

// ------------------------------------------------------------

// cards event hide text

const $eventsTexts = document.querySelectorAll(".event__text");
const $eventsTitles = document.querySelectorAll(".event__title");

utilsDOM.hiddenText($eventsTitles[5], 25);

// HEADER STYLE SCROLL
const $header = document.querySelector(".header");

window.addEventListener(
  "scroll",
  (e) => {
    if (window.scrollY > 60) {
      $header.classList.add("header--active");
    } else {
      $header.classList.remove("header--active");
    }
  },
  { passive: true }
);

// CART PANEL

// "2_22_no-custom-ingredients": {
//     "namePizza": "Argentina",
//     "image": "argentina-pizza",
//     "pizzaQuantity": 1,
//     "sizePizza": 22,
//     "totalPrice": 13,
//     "pricePerPizza": 13,
//     "addedIngredients": []
// }

const $aside = document.getElementById("modal-aside");
const $asideTitle = document.getElementById("aside-title")
const $containerItems = document.getElementById("items-cart");
const $totalItemsPrice = document.getElementById("total-items-price");
const $formOrder = document.getElementById("form-order");
const $inputTel = $formOrder.user_tel;
const $btnFooterCart = document.getElementById("btn-footer-cart");

const renderCartPanel = () => {
  const arrCartData = Object.entries(cart);

  if (!arrCartData.length) {
    renderEmptyCart();
  } else {
    renderCartWithItems(arrCartData);
  }
};

const renderEmptyCart = () => {
  $containerItems.innerHTML = `
    <div class="empty-cart">
      <p>🛒 Cart is empty</p>
      <p>Fill the form and we'll call you back</p>
      <p>Or add pizzas to order</p>
    </div>
  `;
  setCartPanelTexts("Get a call", "Request a call");
};

const renderCartWithItems = (arrCartData) => {
  $containerItems.innerHTML = arrCartData
    .map((item) => utilsRender.renderCartItem(item))
    .join("");
  setCartPanelTexts("Order details", "Order with call");
};

const setCartPanelTexts = (title, buttonText) => {
  $asideTitle.textContent = title;
  $btnFooterCart.textContent = buttonText;
};

$cartBtn.addEventListener("click", (e) => {
  $aside.classList.add("aside--active");
  utilsDOM.lockScroll();
  renderCartPanel();
  $totalItemsPrice.textContent = `${utilsCart
    .sumCartItemsPrice({ cart })
    .toFixed(2)} $`;
});

$aside.addEventListener("click", async (e) => {
  console.log("aside click");

  if (!e.target.closest(".aside__panel") || e.target.closest("#aside-close")) {
    $aside.classList.remove("aside--active");
    utilsDOM.unlockScroll();
  }

  if (e.target.closest(".cart-item__btn")) {
    const $cartItem = e.target.closest(".cart-item");
    const idCartItem = $cartItem.getAttribute("data-id");

    const isDeleteBtn = e.target.classList.contains("cart-item__remove");
    if (isDeleteBtn) {
      delete cart[idCartItem];
      utilsStorage.saveCart(cart);
      renderCartPanel();
      $totalItemsPrice.textContent = `${utilsCart
        .sumCartItemsPrice({ cart })
        .toFixed(2)} $`;

      utilsCart.updateCartItemCount({
        targetElement: $countCart,
        quantity: utilsCart.getQuantity({
          cart,
          propertyQuantity: "pizzaQuantity",
        }),
        activeClass: "cart-btn__count--active",
      });
      return;
    }
    const isMinusBtn = e.target.classList.contains("cart-item__btn--minus");
    if (isMinusBtn && cart[idCartItem].pizzaQuantity > 1) {
      --cart[idCartItem].pizzaQuantity;
      utilsCart.calculateItemTotalPrice({ cart, idCartItem });
      utilsStorage.saveCart(cart);
      renderCartPanel();
      $totalItemsPrice.textContent = `${utilsCart
        .sumCartItemsPrice({ cart })
        .toFixed(2)} $`;

      utilsCart.updateCartItemCount({
        targetElement: $countCart,
        quantity: utilsCart.getQuantity({
          cart,
          propertyQuantity: "pizzaQuantity",
        }),
        activeClass: "cart-btn__count--active",
      });

      return;
    }

    const isPlusBtn = e.target.classList.contains("cart-item__btn--plus");
    if (isPlusBtn) {
      ++cart[idCartItem].pizzaQuantity;
      utilsCart.calculateItemTotalPrice({ cart, idCartItem });

      utilsStorage.saveCart(cart);
      renderCartPanel();
      $totalItemsPrice.textContent = `${utilsCart
        .sumCartItemsPrice({ cart })
        .toFixed(2)} $`;

      utilsCart.updateCartItemCount({
        targetElement: $countCart,
        quantity: utilsCart.getQuantity({
          cart,
          propertyQuantity: "pizzaQuantity",
        }),
        activeClass: "cart-btn__count--active",
      });
      return;
    }
  }

  if (e.target.closest("#btn-footer-cart")) {
    console.log(e.target);

    if (!$inputTel.checkValidity()) {
      $inputTel.reportValidity();
      return false;
    }

    const body = createOrder({
      totalItemsPrice: $totalItemsPrice.textContent,
      cart,
      tel: $inputTel.value,
    });


    cart = {};
    utilsStorage.saveCart(cart);

    console.log(cart, 'cart');
    $formOrder.reset();
    renderEmptyCart();
    $totalItemsPrice.textContent = "0.00 $"
    $countCart.classList.remove('cart-btn__count--active');
    $countCart.textContent = 0;
    alert("Your order has been sent! We'll call you back.");



    let response = await fetch('/send-form.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)
    });

    let result = await response.json();
    alert(result.message);
  }
});

function createOrder({ totalItemsPrice, cart, tel }) {
  const typeArr = ["Order call", "Order pizza"];
  let typeOrder = "Order call";
  const orderId = `ORD-${Date.now()}`;
  let body = null;

  const cartArrValue = Object.values(cart);
  if (!cartArrValue.length) {
    typeOrder = typeArr[0];

    body = {
      "Order ID": orderId,
      "Type": typeOrder,
      "Phone client": tel,
    };

  } else {
    typeOrder = typeArr[1];
    console.log(cartArrValue, typeOrder, tel);
    const orders = cartArrValue.map((val) => {
      const additionalIngredients = val.addedIngredients.length
        ? val.addedIngredients.map(ingr => ingr.name.toUpperCase()).join(", ")
        : "no additional ingredients";
      return {
        "Name pizza": val.namePizza,
        Quantity: val.pizzaQuantity,
        Size: `${val.sizePizza}см`,
        "Additional ingredients": additionalIngredients,
        "Total price pizza": `${val.totalPrice} $`,
      };
    });

    body = {
      "Order ID": orderId,
      "Type": typeOrder,
      orders,
      "Phone client": tel,
      "Total price orders": totalItemsPrice,
    };
  }

  return body;
}

// {
//   "2_22_no-custom-ingredients": {
//       "namePizza": "Argentina",
//       "image": "argentina-pizza",
//       "pizzaQuantity": 4,
//       "sizePizza": 22,
//       "totalPrice": 52,
//       "pricePerPizza": 13,
//       "addedIngredients": []
//   },
//   "2_28_no-custom-ingredients": {
//       "namePizza": "Argentina",
//       "image": "argentina-pizza",
//       "pizzaQuantity": 1,
//       "sizePizza": 28,
//       "totalPrice": 17,
//       "pricePerPizza": 17,
//       "addedIngredients": []
//   },
//   "2_22_15": {
//       "namePizza": "Argentina",
//       "image": "argentina-pizza",
//       "pizzaQuantity": 1,
//       "sizePizza": 22,
//       "totalPrice": 15.5,
//       "pricePerPizza": 15.5,
//       "addedIngredients": [
//           {
//               "id": 15,
//               "name": "beef",
//               "price": 2.5,
//               "nameImg": "beef"
//           }
//       ]
//   }
// }

