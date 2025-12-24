console.log(MAX_PIZZA, "MAX PIZZA");

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
    removeClassFromAll({
      selector = null,
      className,
      arrElements = null
    }) {
      let elements = [];
      if (selector !== null) {
        elements = document.querySelectorAll(selector);
      } else if (arrElements !== null) {
        elements = arrElements;
      }
      if (!elements.length) return;
      elements.forEach((el) => el.classList.remove(className));
    },
    addClassToAll({
      selector = null,
      className,
      arrElements = null
    }) {
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
          <img class="pizza-card__img" src="./assets/img/pizza/${data.image
        }.webp" alt="${data.namePizza}" />
        </figure>
        <h3 class="pizza-card__title">${data.namePizza}</h3>
      </header>
      <div class="pizza-card__ingredients">
        <p class="pizza-card__first-line text-ellipsis w-17vw">
          Filling: ${firstThreeIngredients}${remainingIngredients ? "," : ""}
        </p>
        ${remainingIngredients
          ? `
          <p class="pizza-card__second-line text-ellipsis">
            ${remainingIngredients}
          </p>
        `
          : ""
        }
      </div>
      <form class="pizza-card__form">
        <fieldset class="pizza-card__fieldset">
          <legend class="visually-hidden">Select pizza size</legend>
            ${sizeRadios}
        </fieldset>
      </form>
    
      <button aria-expanded="false" aria-haspopup="dialog" aria-label="Customize ingredients for ${data.namePizza
        }" class="pizza-card__customize-btn">
        <span class="text-gradient ps-rel-idx-100">+ Ingredients</span>
      </button>
      <div class="pizza-card__order-controls">
        <p class="pizza-card__price text-ellipsis">
          <span class="total-price">${firstPrice}</span>
          <span class="pizza-card__currency">$</span>
        </p>
        <div class="pizza-card__quantity-controls">
          <button aria-label="Decrease quantity" disabled class="pizza-card__quantity-btn decrement-quantity">
            <svg width="8" height="2" viewBox="0 0 12 2">
              <path d="M0 1H12" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
          <p aria-live="polite" class="pizza-card__quantity quantity">1</p>
          <button aria-label="Increase quantity" class="pizza-card__quantity-btn pizza-card__quantity-btn--active increment-quantity">
            <svg width="8" height="8" viewBox="0 0 12 12">
              <path d="M0 6H12M6 0V12" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>
      </div>
      <button aria-label="Order ${data.namePizza} now" class="pizza-card__order btn btn--accent btn--small">
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
          <li tabindex="0" role="checkbox" aria-checked="false" class="panel-ingredients__value" data-id="${ingredient.id
          }">
          <p class="panel-ingredients__price" aria-label="Ingredient price">${(
            ingredient.price * coefficient
          ).toFixed(2)} $</p>
            <figure class="ingredient-card">
              <div class="ingredient-card__wrapper-img">
                <img src="./assets/img/ingredients/${ingredient.nameImg
          }.png" alt="image ingredient ${ingredient.name
          }" class="ingredient-card__img" />
              </div>
              <figcaption class="ingredient-card__title">${ingredient.name
          }</figcaption>
            </figure>
          </li>
        `;
      });
      return cardsIngredients;
    },

    renderTextIngredients(ingredients, initialVal = "") {
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
        <p aria-label="Pizza size" class="panel-pizza__size">X ${sizePizza}</p>
      </header>

      <div class="panel-pizza__info-container">
        <div class="panel-pizza__img">
          <img src="./assets/img/pizza/${pizzaData.image}.png" alt="${pizzaData.namePizza
        }">
         </div>
        <div class="panel-pizza__info">
          <p class="panel-pizza__description">${pizzaData.description}</p>
          <p class="panel-pizza__price-custom">Your pizza: <span class="custom-price-one"> ${pricePizza}</span> $</p>
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
          <p class="panel-pizza__price-total">Total <span class="total-price">${totalPrice}</span> $</p>
        </div>
      `;

      container.innerHTML = panelInfo;
    },

    // {"4_22_no-custom-ingredients":{"namePizza":"Pepperoni Classic","image":"meat-pizza","pizzaQuantity":1,"sizePizza":22,"totalPrice":11,"addedIngredients":[]}}
    renderCartItem(data) {
      const isMinusDisabled = data[1].pizzaQuantity <= 1 ? "disabled" : "";
      // const isPlusDisabled =
      //   data[1].pizzaQuantity >= MAX_PIZZA ? "disabled" : "";

      let addedIngredients = [];

      if (data[1].addedIngredients.length) {
        addedIngredients = data[1].addedIngredients.map(
          (objIngr) => objIngr.name
        );
      }

      const cartItem = `
      <article class="cart-item" data-id="${data[0]}">
      <img src="./assets/img/pizza/${data[1].image}.webp" alt="${data[1].namePizza
        } size ${data[1].sizePizza}" class="cart-item__img" />
      <div class="cart-item__info">
        <h3 class="cart-item__name">${data[1].namePizza}</h3>
        <p class="cart-item__size">X ${data[1].sizePizza}</p>
        <p class="cart-item__price">
          <span class="cart-item-price">${data[1].totalPrice.toFixed(
          2
        )}</span> $
        </p>
        <section class="cart-item__custom-ingredients">
          <h3 class="cart-item__title-ingredients">Extra ingredients:</h3>
          <p class="cart-item__addons">
          ${this.renderTextIngredients(
          addedIngredients,
          "no additional ingredients"
        )}
          </p>
        </section>
      </div>
      <div class="cart-item__controls">
        <button class="cart-item__btn cart-item__btn--minus decrement-quantity" aria-label="Reduce quantity" ${isMinusDisabled}>
          −
        </button>
        <span class="cart-item__quantity" aria-live="polite">${data[1].pizzaQuantity
        }</span>
        <button class="cart-item__btn cart-item__btn--plus increment-quantity" aria-label="Increase quantity">
          +
        </button>
      </div>
      <button class="cart-item__btn cart-item__remove" aria-label="Delete ${data[1].pizzaQuantity
        } ${data[1].namePizza}"></button>
    </article>
      `;
      return cartItem;
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
      const btnIncrement = pizzaCardElem.querySelector(".increment-quantity");
      const btnDecrement = pizzaCardElem.querySelector(".decrement-quantity");

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
      btnIncrement.disabled = false;
      btnDecrement.disabled = true;
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

    setPizzaQuantity({
      parentElement,
      quantity,
      selector,
      min = 1,
      max = MAX_PIZZA,
    }) {
      const $quantityPizza = parentElement.querySelector(selector);
      if (quantity > max) {
        quantity = max;
      } else if (quantity < min) {
        quantity = min;
      }
      $quantityPizza.textContent = quantity;
    },

    setPricePizza({ parentElement, price, selector }) {
      const $priceSpan = parentElement.querySelector(selector);
      if ($priceSpan) {
        $priceSpan.textContent = price;
      }
    }
    
    ,

    updateBtn({
      parentElement,
      pizzaQuantity,
      min = 1,
      max = MAX_PIZZA
    }) {
      const $btnDecrement = parentElement.querySelector(".decrement-quantity");
      const $btnIncrement = parentElement.querySelector(".increment-quantity");

      $btnDecrement.disabled = pizzaQuantity <= min;
      $btnIncrement.disabled = pizzaQuantity >= max;
    },
  };
}

function cartUtils() {
  return {
    updateCartItemCount({
      targetElement,
      quantity,
      activeClass
    }) {
      if (quantity < 1) {
        targetElement.classList.remove(activeClass);
        targetElement.textContent = 0;
      } else {
        const displayQuantity = quantity > 99 ? "99+" : quantity;
        targetElement.classList.add(activeClass);
        targetElement.textContent = displayQuantity;
      }
    },

    getQuantity({
      cart,
      propertyQuantity
    }) {
      const pizzaOrder = Object.values(cart);
      const totalQuantity = pizzaOrder.reduce((sum, order) => {
        sum += order[propertyQuantity];
        return sum;
      }, 0);

      return totalQuantity;
    },

    calculateItemTotalPrice({
      cart,
      idCartItem
    }) {
      cart[idCartItem].totalPrice =
        cart[idCartItem].pricePerPizza * cart[idCartItem].pizzaQuantity;
    },

    sumCartItemsPrice({
      cart
    }) {
      const sumItemsPrice = Object.values(cart).reduce((sum, item) => {
        return sum + item.totalPrice;
      }, 0);

      return sumItemsPrice;
    },
  };
}