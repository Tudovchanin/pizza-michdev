"use strict";

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

const MAX_PIZZA = 10;
const KEY = {
  NO_INGREDIENTS: 'no-custom-ingredients',
  SEPARATOR: '_'
};

// DOM

// sections page
const $menuPizza = document.getElementById("menuPizza");
const $heroPizza = document.getElementById("hero");
const $eventsPizza = document.getElementById("events");
const $aboutPizza = document.getElementById("about");
const $footer = document.getElementById("footer");

// elements
const $videoMenu = document.getElementById("video-promo");
const $cartBtn = document.getElementById("cartBtn");
const $countCart = document.querySelector('.cart-btn__count');
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
const $menuOverlay = document.getElementById("overlay-menu");
const $ingredientsPanel = document.getElementById("panel-ingredients");
const $pizzaInfoPanel = document.getElementById("panel-info-pizza");

// state
const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : {};
let popUpPizzaData = {};
let addedIngredients = [];

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

  if (!e.target.closest(".menu__panel")) {
    handleClosePopUpPizza({
      pizzaCardElem: popUpPizzaData.cardElement,
      sizeValue: popUpPizzaData.pizzaData.size,
      pizzaQuantity: popUpPizzaData.pizzaData.defaultQuantity,
      callbackFormat: utilsFormat.formatPrice,
    });
    popUpPizzaData = {};
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
    const priceIngredient = ingredient.price * INGR_PRICE_COEFF[sizePizza];

    btnIngredient.classList.toggle("panel-ingredients__value--add");
    const ingredientIsSelected = btnIngredient.classList.contains(
      "panel-ingredients__value--add"
    );

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

    const keyIngredients = addedIngredients
      .map((ingredient) => ingredient.id)
      .sort((a, b) => a - b)
      .join('-') || KEY.NO_INGREDIENTS;

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
      addedIngredients
    });


    console.log(cart);
    alert("PIZZA ADD TO THE CART");
    handleClosePopUpPizza({
      pizzaCardElem: popUpPizzaData.cardElement,
      sizeValue: 22,
      pizzaQuantity: 1,
      callbackFormat: utilsFormat.formatPrice,
    });

    utilsCart.updateCartItemCount({
      targetElement: $countCart,
      quantity: utilsCart.getQuantity({ cart, propertyQuantity: 'pizzaQuantity' }),
      activeClass: 'cart-btn__count--active',
    });
  }
});


// проверка count-btn__cart

// utilsCart.updateCartItemCount({
//   targetElement: $countCart,
//   quantity: 222,
//   activeClass: 'cart-btn__count--active',
// });

function handleClosePopUpPizza({
  pizzaCardElem,
  sizeValue = 22,
  pizzaQuantity = 1,
  callbackFormat,
}) {
  $menuOverlay.classList.remove("menu__overlay--active");
  utilsDOM.unlockScroll();
  utilsDOM.clearContainer($pizzaInfoPanel);
  utilsDOM.clearContainer($ingredientsPanel);

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
  utilsDOM.removeClassFromAll({
    selector: ".panel-ingredients__value--add",
    className: "panel-ingredients__value--add",
  });
}


// HANDLE CUSTOM PIZZA IN THE CARD
$menuPizza.addEventListener("click", (e) => {
  if (!e.target.closest(".pizza-card__customize-btn")) return;

  const $pizzaCard = e.target.closest(".pizza-card");
  const $form = $pizzaCard.querySelector(".pizza-card__form");
  if (!$pizzaCard || !$form) return;

  const idPizza = utilsPizza.getPizzaId($pizzaCard);
  const sizePizza = utilsPizza.getPizzaSize($form);
  const pizzaQuantity = utilsPizza.getPizzaQuantity($pizzaCard);
  const pizza = flatPizzaProducts.find((pizza) => pizza.id === idPizza);

  const clonePizza = utilsData.deepClone(pizza);

  // data pop up
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
  utilsRender.renderPanelAddIngredients(ingredientsHTML, $ingredientsPanel);

  utilsRender.renderPanelInfoPizza({
    pizzaData: pizza,
    sizePizza,
    pizzaQuantity,
    container: $pizzaInfoPanel,
    callbackFormat: utilsFormat.formatPrice,
  });
  utilsPizza.updateBtn({
    parentElement: $pizzaInfoPanel,
    pizzaQuantity: popUpPizzaData.pizzaData.customQuantity,
  });

  $menuOverlay.classList.add("menu__overlay--active");
  utilsDOM.lockScroll();
});





// HANDLE CLICK ORDER NOW IN THE CARD
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
    separator: KEY.SEPARATOR
  });

  console.log(cart, "CART");


  utilsCart.updateCartItemCount({
    targetElement: $countCart,
    quantity: utilsCart.getQuantity({ cart, propertyQuantity: 'pizzaQuantity' }),
    activeClass: 'cart-btn__count--active',
  });

  utilsPizza.resetPizzaCard({
    pizzaCardElem: $pizzaCard,
    sizeValue: 22,
    pizzaQuantity: 1,
    callbackFormat: utilsFormat.formatPrice,
  });

  alert("PIZZA ADD TO THE CART");
});






function addToCart({
  cart,
  idPizza,
  sizePizza,
  keyIngredients,
  pizzaQuantity,
  pricePerPizza,
  namePizza,
  image = '',
  addedIngredients = [],
  separator = '_',
}) {

  if (cart[idPizza + separator + sizePizza + separator + keyIngredients]) {
    console.log("уже есть пицца-карточка");
    cart[idPizza + separator + sizePizza + separator + keyIngredients].pizzaQuantity += pizzaQuantity;
    cart[idPizza + separator + sizePizza + separator + keyIngredients].totalPrice =
      cart[idPizza + separator + sizePizza + separator + keyIngredients].pizzaQuantity * pricePerPizza;
  } else {
    console.log("новая пицца карточка");
    cart[idPizza + separator + sizePizza + separator + keyIngredients] = {
      namePizza: namePizza,
      image,
      pizzaQuantity,
      sizePizza,
      totalPrice: pizzaQuantity * pricePerPizza,
      addedIngredients
    };
  }
}

// HANDLE CHANGE QUANTITY BTN PIZZA IN THE CARD
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

// HANDLE CHANGE SIZE PIZZA IN THE CARD
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

// ------------------------------------------------------------


// cards event hide text

const $eventText = document.querySelectorAll(".event__text");
const $eventTitle = document.querySelectorAll(".event__title");

utilsDOM.hiddenText($eventTitle[5], 25);





// HEADER STYLE SCROLL
const $header = document.querySelector('.header');

window.addEventListener('scroll', (e) => {
  if (window.scrollY > 60) {
    $header.classList.add('header--active');
  } else {
    $header.classList.remove('header--active');
  }
}, { passive: true });


