"use strict";

function formatUtils() {
  return {
    formatPrice(price, locale = "en-US", min = 2, max = 2) {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      }).format(price);
    },
  };
}

function storageUtils() {
  return {
    saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    },
  };
}

function domUtils() {
  return {
    clearContainer(container) {
      container.innerHTML = "";
    },
    lockScroll() {
      let scrollWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollWidth + "px";
      document.documentElement.classList.add("no-scroll");
      document.body.classList.add("no-scroll");
    },
    unlockScroll() {
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
    },
    hiddenText(elem, num) {
      const text = elem.textContent;
      if (text.length > num) {
        elem.textContent = text.slice(0, num) + "...";
      }
    },
    removeClassFromAll({ selector = null, className, arrElements = null }) {
      let elements = [];
      if (selector !== null) {
        elements = document.querySelectorAll(selector);
      } else if (arrElements !== null) {
        elements = arrElements;
      }
      if (!elements.length) return;
      elements.forEach((el) => el.classList.remove(className));
    },
    addClassToAll({ selector = null, className, arrElements = null }) {
      let elements = [];
      if (selector !== null) {
        elements = document.querySelectorAll(selector);
      } else if (arrElements !== null) {
        elements = arrElements;
      }
      if (!elements.length) return;
      elements.forEach((el) => el.classList.add(className));
    },
  };
}

function renderUtils() {
  return {
    renderCard(data, callbackFormat = null) {
      // top and bottom cards
      const firstThreeIngredients = data.ingredients.slice(0, 3).join(", ");
      const remainingIngredients = data.ingredients.slice(3).join(", ");

      // default price
      let firstPrice = Object.values(data.price)[0];
      if (callbackFormat) {
        firstPrice = callbackFormat(firstPrice);
      }

      //  render radio btn size
      const sizeRadios = Object.entries(data.price)
        .map(
          ([size, price], index) => `
      <label class="pizza-card__size-label">
        <input class="pizza-card__size-radio visually-hidden" 
               data-price="${price}" 
               type="radio" 
               name="size" 
               value="${size}" 
               ${index === 0 ? "checked" : ""} />
        <span class="pizza-card__size-text">${size}</span>
      </label>
    `
        )
        .join("");

      const card = `
    <article data-id="${data.id}" class="pizza-card">
      <header class="pizza-card__header">
        <figure class="pizza-card__figure">
          <img class="pizza-card__img" src="./assets/img/pizza/${
            data.image
          }.png" alt="${data.namePizza}" />
        </figure>
        <h3 class="pizza-card__title">${data.namePizza}</h3>
      </header>
      <div class="pizza-card__ingredients">
        <p class="pizza-card__first-line text-ellipsis w-17vw">
          Filling: ${firstThreeIngredients}${remainingIngredients ? "," : ""}
        </p>
        ${
          remainingIngredients
            ? `
          <p class="pizza-card__second-line text-ellipsis">
            ${remainingIngredients}
          </p>
        `
            : ""
        }
      </div>
    
      <form class="pizza-card__form">
        ${sizeRadios}
      </form>
    
      <button class="pizza-card__customize-btn">
        <span class="text-gradient ps-rel-idx-100">+ Ingredients</span>
      </button>
      <div class="pizza-card__order-controls">
        <p class="pizza-card__price text-ellipsis">
          <span class="total-price">${firstPrice}</span>
          <span class="pizza-card__currency">$</span>
        </p>
        <div class="pizza-card__quantity-controls">
          <button disabled class="pizza-card__quantity-btn decrement-quantity">
            <svg width="8" height="2" viewBox="0 0 12 2">
              <path d="M0 1H12" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
          <p class="pizza-card__quantity quantity">1</p>
          <button class="pizza-card__quantity-btn pizza-card__quantity-btn--active increment-quantity">
            <svg width="8" height="8" viewBox="0 0 12 12">
              <path d="M0 6H12M6 0V12" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>
      </div>
      <button class="pizza-card__order btn btn--accent btn--small">
        Order Now
      </button>
    </article>
  `;

      return card;
    },

    renderAllCards(cards, callbackFormat = null) {
      const arrCards = cards.map((card) => {
        return this.renderCard(card, callbackFormat);
      });

      return arrCards;
    },

    renderCardsIngredients(ingredients, coefficient = 1) {
      let cardsIngredients = "";
      ingredients.forEach((ingredient) => {
        cardsIngredients += `
          <li class="panel-ingredients__value" data-id="${ingredient.id}">
            <p class="panel-ingredients__price" area-label="price pizza">${(
              ingredient.price * coefficient
            ).toFixed(2)} $<p>
            <figure class="ingredient-card">
              <div class="ingredient-card__wrapper-img">
                <img src="./assets/img/ingredients/${
                  ingredient.nameImg
                }.png" alt="image ingredient ${
          ingredient.name
        }" class="ingredient-card__img" />
              </div>
              <figcaption class="ingredient-card__title">${
                ingredient.name
              }</figcaption>
            </figure>
          </li>
        `;
      });
      return cardsIngredients;
    },

    renderTextIngredients(ingredients, initialVal = '') {
      if (!ingredients.length) {
        return `<span>${initialVal}</span>`;
      }

      const ingredientsHTML = ingredients
        .map((ingredient) => {
          return `<span>${ingredient}</span>`;
        })
        .join(", ");

      return ingredientsHTML;
    },

    renderPanelAddIngredients(htmlIngredients, container) {
      let panelIngredients = "";

      Object.entries(htmlIngredients).forEach(([category, ingredients]) => {
        panelIngredients += `
            <section class="panel-ingredients__section">
              <h4 class="panel-ingredients__title panel-ingredients__title--small">${category}</h4>
              <ul class="panel-ingredients__container-ingredients">${ingredients}</ul>
            </section>
        `;
      });

      container.innerHTML = ` <h3 class="panel-ingredients__title panel-ingredients__overlay">Add ingredient</h3><div class="panel-ingredients__wrapper-sections">${panelIngredients}</div>`;
    },

    renderPanelInfoPizza({
      pizzaData,
      sizePizza,
      pizzaQuantity,
      container,
      callbackFormat = null,
    }) {
      let pricePizza = pizzaData.price[sizePizza];
      let totalPrice = pizzaData.price[sizePizza] * pizzaQuantity;
      if (callbackFormat) {
        pricePizza = callbackFormat(pricePizza);
        totalPrice = callbackFormat(totalPrice);
      }
      const panelInfo = `
      <header class="panel-pizza__header">
        <h3 class="panel-pizza__title">${pizzaData.namePizza}</h3>
        <p area-label="Pizza size" class="panel-pizza__size">X ${sizePizza}</p>
      </header>

      <div class="panel-pizza__info-container">
        <div class="panel-pizza__img">
          <img src="./assets/img/pizza/${pizzaData.image}.png" alt="${
        pizzaData.namePizza
      }}">
         </div>
        <div class="panel-pizza__info">
          <p class="panel-pizza__description">${pizzaData.description}</p>
          <p class="panel-pizza__price-custom">Price for one pizza custom <span class="custom-price-one"> ${pricePizza}</span> $</p>
          <p class="panel-pizza__price-standard">Standard price: ${pricePizza} $</p>
        </div>
      </div>
  
      <p class="panel-pizza__ingredients"><span class="fw-500">Ingredients:</span> ${this.renderTextIngredients(
        pizzaData.ingredients
      )}</p>
      <p class="panel-pizza__ingredients"><span class="fw-500">Extra Ingredients:</span> <span id="custom-ingredients">-</span></p>

        <div class="panel-pizza__footer">
          <div class="panel-pizza__quantity-controls">
            <button class="panel-pizza__btn-quantity decrement-quantity">-</button>
            <span class="panel-pizza__quantity quantity">${pizzaQuantity}</span>
            <button class="panel-pizza__btn-quantity  increment-quantity">+</button>
          </div>
          <p class="panel-pizza__price-total">Total <span class="total-price">${
            totalPrice
          }</span> $</p>
        </div>
      `;

      container.innerHTML = panelInfo;
    },
  };
}

function dataUtils() {
  return {
    normalizePizzaIngredients(pizzaData, ingredientsNames) {
      for (const category in pizzaData) {
        if (Object.hasOwnProperty.call(pizzaData, category)) {
          pizzaData[category].forEach((pizza) => {
            const arrNamesIngredients = [];

            pizza.ingredients.forEach((idIngredient) => {
              const nameIngredient = ingredientsNames.find(
                (ingredient) => ingredient.id === idIngredient
              );
              arrNamesIngredients.push(nameIngredient.name);
            });

            pizza.ingredients = arrNamesIngredients;
          });
        }
      }
      return pizzaData;
    },
    deepClone(obj) {
      if (!(obj instanceof Object)) {
        return obj;
      }
      const clone = {};

      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (obj[key] instanceof Object && !(obj[key] instanceof Array)) {
            clone[key] = this.deepClone(value);
            continue;
          } else if (obj[key] instanceof Array) {
            clone[key] = value.map((v) => this.deepClone(v));
            continue;
          }
          clone[key] = obj[key];
        }
      }
      return clone;
    },
  };
}

function pizzaUtils() {
  return {
    getPizzaId(targetElement) {
      return +targetElement.getAttribute("data-id");
    },

    resetPizzaCard({
      pizzaCardElem,
      sizeValue = 22,
      pizzaQuantity = 1,
      callbackFormat = null,
    }) {
      const $quantityPizza = pizzaCardElem.querySelector(".quantity");
      $quantityPizza.textContent = pizzaQuantity;

      const $radioBtnSize = pizzaCardElem.querySelector(
        `input[name="size"][value="${sizeValue}"]`
      );
      const $totalPricePizza = pizzaCardElem.querySelector(".total-price");
      const pricePerPizza = $radioBtnSize.getAttribute("data-price");
      if (callbackFormat) {
        $totalPricePizza.textContent = callbackFormat(
          pizzaQuantity * pricePerPizza
        );
      } else {
        $totalPricePizza.textContent = pizzaQuantity * pricePerPizza;
      }

      $radioBtnSize.checked = true;
    },

    getPizzaSize(form) {
      const $selectedSizeRadio = form.querySelector(
        'input[name="size"]:checked'
      );
      return +$selectedSizeRadio.value;
    },

    getPricePerPizza(form) {
      const $selectedSizeRadio = form.querySelector(
        'input[name="size"]:checked'
      );
      return +$selectedSizeRadio.getAttribute("data-price");
    },

    getPizzaQuantity(parentElement) {
      const $quantityPizza = parentElement.querySelector(".quantity");
      return +$quantityPizza.textContent;
    },

    setPizzaQuantity({ parentElement, quantity, selector, min = 1, max = 10 }) {
      const $quantityPizza = parentElement.querySelector(selector);
      if (quantity > max) {
        quantity = max;
      } else if (quantity < min) {
        quantity = min;
      }
      $quantityPizza.textContent = quantity;
    },

    setPricePizza({ parentElement, price, selector }) {
      const $totalPricePizza = parentElement.querySelector(selector);
      $totalPricePizza.textContent = price;
    },

    updateBtn({ parentElement, pizzaQuantity, min = 1, max = 10 }) {
      console.log("update btn function");
      const $btnDecrement = parentElement.querySelector(".decrement-quantity");
      const $btnIncrement = parentElement.querySelector(".increment-quantity");
      $btnDecrement.disabled = pizzaQuantity <= min;
      $btnIncrement.disabled = pizzaQuantity >= max;
    },
  };
}

function cartUtils() {
  return {
    updateCartItemCount({targetElement, quantity, activeClass}) {
      console.log(quantity, 'updateCartItemCount');
      if(quantity < 1) {
        targetElement.classList.remove(activeClass);
        targetElement.textContent = 0;
      } else {
        targetElement.classList.add(activeClass);
        targetElement.textContent = quantity;
      }
    },

    getQuantity({cart, propertyQuantity}) {
      console.log(cart, propertyQuantity);
     const pizzaOrder =  Object.values(cart);
      const totalQuantity = pizzaOrder.reduce((sum, order) => {
      sum += order[propertyQuantity];
      return sum
     },0);

     return totalQuantity;

    }
  }
}
function getIngredients() {
  return {
    cheeses: [
      { id: 1, name: "extra cheese", price: 1, nameImg: "extra-cheese" },
      { id: 2, name: "gorgonzola", price: 2.0, nameImg: "gorgonzola" },
      { id: 3, name: "parmesan", price: 1.8, nameImg: "parmesan" },
      { id: 4, name: "mozzarella", price: 1.2, nameImg: "mozzarella" },
      { id: 5, name: "ricotta", price: 1.7, nameImg: "ricotta" },
    ],
    vegetables: [
      { id: 6, name: "mushrooms", price: 1.0, nameImg: "mushrooms" },
      { id: 7, name: "olives", price: 0.8, nameImg: "olives" },
      { id: 8, name: "bell peppers", price: 1.0, nameImg: "bell-peppers" },
      { id: 9, name: "onions", price: 0.5, nameImg: "onions" },
      { id: 10, name: "fresh tomatoes", price: 0.9, nameImg: "fresh-tomatoes" },
      { id: 11, name: "spinach", price: 1.3, nameImg: "spinach" },
      { id: 12, name: "red onions", price: 0.6, nameImg: "red-onions" },
      {
        id: 13,
        name: "sun-dried tomatoes",
        price: 1.5,
        nameImg: "sun-dried-tomatoes",
      },
      { id: 14, name: "basil", price: 0.2, nameImg: "basil" },
      { id: 28, name: "sweet corn", price: 1.0, nameImg: "sweet-corn" },
    ],
    meats: [
      { id: 15, name: "beef", price: 2.5, nameImg: "beef" },
      { id: 16, name: "ham", price: 1.8, nameImg: "ham" },
      { id: 17, name: "pepperoni", price: 2.2, nameImg: "pepperoni" },
      { id: 18, name: "bacon", price: 2.0, nameImg: "bacon" },
      { id: 19, name: "chicken", price: 2.0, nameImg: "chicken" },
      { id: 20, name: "salami", price: 2.2, nameImg: "salami" },
      {
        id: 21,
        name: "italian sausages",
        price: 2.5,
        nameImg: "italian-sausages",
      },
      { id: 22, name: "prosciutto", price: 2.5, nameImg: "prosciutto" },
    ],
    seafood: [
      { id: 23, name: "shrimps", price: 2.5, nameImg: "shrimps" },
      { id: 24, name: "squid", price: 3.0, nameImg: "squid" },
      { id: 25, name: "mussels", price: 2.8, nameImg: "mussels" },
      { id: 26, name: "smoked salmon", price: 3.5, nameImg: "smoked-salmon" },
      { id: 27, name: "tuna", price: 2.5, nameImg: "tuna" },
    ],
    sauces: [
      { id: 30, name: "tomato sauce", price: 0.5, nameImg: "tomato-sauce" },
      { id: 31, name: "BBQ sauce", price: 0.8, nameImg: "BBQ-sauce" },
      { id: 32, name: "creamy sauce", price: 1.5, nameImg: "creamy-sauce" },
      { id: 33, name: "white sauce", price: 1.2, nameImg: "white-sauce" },
      { id: 34, name: "cream sauce", price: 1.3, nameImg: "cream-sauce" },
    ],
    special: [
      { id: 35, name: "truffle oil", price: 2.5, nameImg: "truffle-oil" },
      { id: 36, name: "oregano", price: 0.3, nameImg: "oregano" },
      { id: 37, name: "thyme", price: 0.4, nameImg: "thyme" },
      { id: 38, name: "dill", price: 0.4, nameImg: "dill" },
      { id: 39, name: "garlic", price: 0.5, nameImg: "garlic" },
      { id: 29, name: "capers", price: 1.0, nameImg: "capers" },
    ],
  };
}

function getPizzaData() {
  return {
    meat: [
      {
        id: 1,
        namePizza: "Meat",
        description: "Assortment of beef, ham, pepperoni and bacon",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "meat-pizza",
        ingredients: [15, 16, 17, 18, 4, 30],
      },
      {
        id: 2,
        namePizza: "Argentina",
        description: "Juicy Argentinian beef with herbs",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "argentina-pizza",
        ingredients: [15, 37, 9, 8, 4, 30],
      },
      {
        id: 3,
        namePizza: "Venecia",
        description: "Venetian style with Italian sausages",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "venecia-pizza",
        ingredients: [21, 7, 9, 8, 4],
      },
      {
        id: 4,
        namePizza: "Pepperoni Classic",
        description: "Double pepperoni with extra cheese",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "meat-pizza",
        ingredients: [17, 4, 30, 36],
      },
      {
        id: 5,
        namePizza: "BBQ Chicken",
        description: "Grilled chicken with BBQ sauce",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "meat-pizza",
        ingredients: [19, 31, 12, 4, 28],
      },
    ],

    vegetarian: [
      {
        id: 6,
        namePizza: "Cheese",
        description: "Mozzarella, gorgonzola, parmesan and ricotta",
        price: { 22: 10, 28: 14, 33: 18 },
        image: "cheese-pizza",
        ingredients: [4, 2, 3, 5, 30],
      },
      {
        id: 7,
        namePizza: "Tomato",
        description: "Classic with fresh tomatoes and basil",
        price: { 22: 9, 28: 13, 33: 17 },
        image: "tomato-pizza",
        ingredients: [10, 14, 4, 30],
      },
      {
        id: 8,
        namePizza: "Italian",
        description: "Traditional Italian recipe",
        price: { 22: 8.35, 28: 15.33, 33: 19.6 },
        image: "italian-pizza",
        ingredients: [22, 8, 3, 4, 30],
      },
      {
        id: 9,
        namePizza: "Italian x2",
        description: "Double portion of Italian ingredients",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "italian-x2-pizza",
        ingredients: [22, 20, 7, 4, 30],
      },
      {
        id: 10,
        namePizza: "Vegetarian",
        description: "Fresh vegetables and herbs",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "tomato-pizza",
        ingredients: [8, 10, 9, 7, 6, 4],
      },
      {
        id: 11,
        namePizza: "Mediterranean",
        description: "Sun-dried tomatoes, olives and feta cheese",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "meat-pizza",
        ingredients: [13, 7, 2, 11, 4],
      },
    ],

    mushroom: [
      {
        id: 12,
        namePizza: "Gribnaya",
        description: "Assorted mushrooms with creamy sauce",
        price: { 22: 10, 28: 14, 33: 18 },
        image: "mushroom-pizza",
        ingredients: [22, 23, 24, 4, 25],
      },
      {
        id: 13,
        namePizza: "Forest Mushroom",
        description: "Wild forest mushrooms with herbs",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "argentina-pizza",
        ingredients: [26, 37, 39, 4, 28],
      },
      {
        id: 14,
        namePizza: "Truffle Mushroom",
        description: "Mushrooms with truffle oil",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "mushroom-pizza",
        ingredients: [6, 29, 3, 4, 28],
      },
    ],

    sea_products: [
      {
        id: 15,
        namePizza: "Seafood Mix",
        description: "Shrimps, squid and mussels",
        price: { 22: 14, 28: 18, 33: 22 },
        image: "argentina-pizza",
        ingredients: [23, 24, 25, 39, 4, 33],
      },
      {
        id: 16,
        namePizza: "Tuna & Corn",
        description: "Tuna with sweet corn and onions",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "venecia-pizza",
        ingredients: [27, 28, 12, 4, 30],
      },
      {
        id: 17,
        namePizza: "Salmon Supreme",
        description: "Smoked salmon with cream cheese",
        price: { 22: 15, 28: 19, 33: 23 },
        image: "cheese-pizza",
        ingredients: [26, 5, 29, 12, 38],
      },
    ],
  };
}




function initHeaderListUi(targetElements) {
  const $headerList = document.querySelectorAll('.header .link-nav');

  let clickLinkHeader = false;

  $headerList.forEach(link => {
    link.addEventListener('click', (e) => {
      clickLinkHeader = true;
      linkUiActive(e.target);
      setTimeout(() => {
        clickLinkHeader = false;
      }, 1000);
    })
  });


  const options = {
    threshold: 0,
    rootMargin: '-50% 0px -50% 0px'
  };

  const onEntry = (entries) => {
    entries.forEach(entry => {
      if(clickLinkHeader) return;
      const { isIntersecting, target} = entry;


      if (isIntersecting) {
        const indexSection = +target.getAttribute('data-index');
          linkUiActive($headerList[indexSection]);
      }
    });
  };

  const observer = new IntersectionObserver(onEntry, options);

  targetElements.forEach(section => {
    observer.observe(section);
  });


  function linkUiActive(target) {

    if(!target) return;
    $headerList.forEach(link => link.classList.remove('link-nav--active'));
    target.classList.add('link-nav--active');
  }

}
function initSwitchHero(triggerElement) {
  
const switchHero = {
  $target: document.getElementById('switch'),
  class_1: 'switch--toggle-left',
  class_2: 'switch--toggle-right',
  switchLeft() {
    this.$target.classList.remove(this.class_2);
    this.$target.classList.add(this.class_1);
  },
  switchRight() {
    this.$target.classList.remove(this.class_1);
    this.$target.classList.add(this.class_2);
  }
}

switchHero.$target.addEventListener('click', (e) => {
  const btn = e.currentTarget;
  if (!btn) return;
  switchHero.switchRight();
});

const options = {
  threshold: 0,
  rootMargin: '0px 0px -200px 0px',
};

const onEntry = (entries) => {
  entries.forEach(entry => {
    const { isIntersecting } = entry;
    if (isIntersecting) {
     switchHero.switchRight();
    } else {
     switchHero.switchLeft();
    }
  });
};

const observer = new IntersectionObserver(onEntry, options);

observer.observe(triggerElement);

}
function initVideoPromo(triggerElement, videoElement) {
  const $title = document.querySelector('.promo__title');
  const videoPlayer = {
    $video: videoElement,
    
    playVideo() {
      this.$video.play().catch(e => {
        console.log('Автовоспроизведение заблокировано', e);
      });
    },
    
    pauseVideo() {
      this.$video.pause();
    }
  }

  const options = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px',
  };
  const onEntry = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        videoPlayer.playVideo();
        $title.classList.remove('promo__title--hidden');
        observer.unobserve(triggerElement);

      }
    });
  };

  const observer = new IntersectionObserver(onEntry, options);
  observer.observe(triggerElement);
}


function initFooter(footer) {


// link scroll to menu
const $footerLinkAll = document.getElementById("footer-link-all");
const $footerLinkMeat = document.getElementById("footer-link-meat");
const $footerLinkSea = document.getElementById("footer-link-sea");
const $footerLinkVegan = document.getElementById("footer-link-vegan");
const $footerLinkMushrooms = document.getElementById("footer-link-mushrooms");
const $btnTabAll = document.getElementById("all");
const $btnTabMeat = document.getElementById("meat");
const $btnTabVegan = document.getElementById("vegetarian");
const $btnTabSea = document.getElementById("sea_products");
const $btnTabMushroom = document.getElementById("mushroom");

const mapLinkFooter = new Map();
mapLinkFooter.set($footerLinkAll, $btnTabAll);
mapLinkFooter.set($footerLinkMeat, $btnTabMeat);
mapLinkFooter.set($footerLinkSea, $btnTabSea);
mapLinkFooter.set($footerLinkVegan, $btnTabVegan);
mapLinkFooter.set($footerLinkMushrooms, $btnTabMushroom);


footer.addEventListener("click", (event) => {

  if(!mapLinkFooter.get(event.target)) return;

  mapLinkFooter.get(event.target).click();

});
}

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
    targetElement:$countCart,
    quantity:utilsCart.getQuantity({cart, propertyQuantity: 'pizzaQuantity'}),
    activeClass: 'cart__count--active',
  });
  }
});

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
    image:pizzaData.image,
    separator: KEY.SEPARATOR
  });

  console.log(cart, "CART");

  
  utilsCart.updateCartItemCount({
    targetElement:$countCart,
    quantity:utilsCart.getQuantity({cart, propertyQuantity: 'pizzaQuantity'}),
    activeClass: 'cart__count--active',
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
  separator= '_',
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

window.addEventListener('scroll', (e)=> {
  if(window.scrollY > 60) {
    $header.classList.add('header--active');
  } else {
    $header.classList.remove('header--active');
  }
},{ passive: true });