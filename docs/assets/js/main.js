"use strict";






function getPizzaData (){
  const productsData = {
    meat: [
      {
        id: 1,
        namePizza: "Meat",
        description: "Assortment of beef, ham, pepperoni and bacon",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "meat-pizza",
        ingredients: ["beef", "ham", "pepperoni", "bacon", "mozzarella", "tomato sauce"]
      },
      {
        id: 2,
        namePizza: "Argentina", 
        description: "Juicy Argentinian beef with herbs",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "argentina-pizza",
        ingredients: ["beef", "herbs", "onions", "bell peppers", "mozzarella", "tomato sauce"]
      },
      {
        id: 3,
        namePizza: "Venecia",
        description: "Venetian style with Italian sausages",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "venecia-pizza",
        ingredients: ["Italian sausages", "olives", "onions", "bell peppers", "mozzarella"]
      },
      {
        id: 4,
        namePizza: "Pepperoni Classic",
        description: "Double pepperoni with extra cheese",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "meat-pizza",
        ingredients: ["pepperoni", "mozzarella", "tomato sauce", "oregano"]
      },
      {
        id: 5,
        namePizza: "BBQ Chicken",
        description: "Grilled chicken with BBQ sauce",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "meat-pizza",
        ingredients: ["chicken", "BBQ sauce", "red onions", "mozzarella", "corn"]
      }
    ],
    
    vegetarian: [
      {
        id: 6,
        namePizza: "Cheese",
        description: "Mozzarella, gorgonzola, parmesan and ricotta",
        price: { 22: 10, 28: 14, 33: 18 },
        image: "cheese-pizza",
        ingredients: ["mozzarella", "gorgonzola", "parmesan", "ricotta", "tomato sauce"]
      },
      {
        id: 7,
        namePizza: "Tomato",
        description: "Classic with fresh tomatoes and basil",
        price: { 22: 9, 28: 13, 33: 17 },
        image: "tomato-pizza",
        ingredients: ["fresh tomatoes", "basil", "mozzarella", "tomato sauce"]
      },
      {
        id: 8,
        namePizza: "Italian",
        description: "Traditional Italian recipe",
        price: { 22: 8.35, 28: 15.33, 33: 19.60 },
        image: "italian-pizza",
        ingredients: ["prosciutto", "arugula", "parmesan", "mozzarella", "tomato sauce"]
      },
      {
        id: 9,
        namePizza: "Italian x2",
        description: "Double portion of Italian ingredients",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "italian-x2-pizza",
        ingredients: ["prosciutto", "salami", "olives", "mozzarella", "tomato sauce"]
      },
      {
        id: 10,
        namePizza: "Vegetarian",
        description: "Fresh vegetables and herbs",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "tomato-pizza",
        ingredients: ["bell peppers", "tomatoes", "onions", "olives", "mushrooms", "mozzarella"]
      },
      {
        id: 11,
        namePizza: "Mediterranean",
        description: "Sun-dried tomatoes, olives and feta cheese",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "meat-pizza",
        ingredients: ["sun-dried tomatoes", "olives", "feta cheese", "spinach", "mozzarella"]
      }
    ],
    
    mushroom: [
      {
        id: 12,
        namePizza: "Gribnaya",
        description: "Assorted mushrooms with creamy sauce",
        price: { 22: 10, 28: 14, 33: 18 },
        image: "mushroom-pizza",
        ingredients: ["champignons", "porcini mushrooms", "creamy sauce", "mozzarella", "thyme"]
      },
      {
        id: 13,
        namePizza: "Forest Mushroom",
        description: "Wild forest mushrooms with herbs",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "argentina-pizza",
        ingredients: ["wild mushrooms", "herbs", "garlic", "mozzarella", "cream sauce"]
      },
      {
        id: 14,
        namePizza: "Truffle Mushroom",
        description: "Mushrooms with truffle oil",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "mushroom-pizza",
        ingredients: ["mushrooms", "truffle oil", "parmesan", "mozzarella", "cream sauce"]
      }
    ],
    
    sea_products: [
      {
        id: 15,
        namePizza: "Seafood Mix",
        description: "Shrimps, squid and mussels",
        price: { 22: 14, 28: 18, 33: 22 },
        image: "argentina-pizza",
        ingredients: ["shrimps", "squid", "mussels", "garlic", "mozzarella", "white sauce"]
      },
      {
        id: 16,
        namePizza: "Tuna & Corn",
        description: "Tuna with sweet corn and onions",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "venecia-pizza",
        ingredients: ["tuna", "sweet corn", "red onions", "mozzarella", "tomato sauce"]
      },
      {
        id: 17,
        namePizza: "Salmon Supreme",
        description: "Smoked salmon with cream cheese",
        price: { 22: 15, 28: 19, 33: 23 },
        image: "cheese-pizza",
        ingredients: ["smoked salmon", "cream cheese", "capers", "red onions", "dill"]
      }
    ]
  };
  

return productsData;
}



function getUtils() {

  return {
    formatPrice(price, locale = 'en-US') {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(price);
    },
    saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    },
    removeCards() {
      topContainerCards.innerHTML = '';
      bottomContainerCards.innerHTML = '';
    },

    renderCard(data) {
      // Обрабатываем ингредиенты (первые 3 и остальные)
      const firstThreeIngredients = data.ingredients.slice(0, 3).join(', ');
      const remainingIngredients = data.ingredients.slice(3).join(', ');

      // Получаем первую цену для отображения
      const firstPrice = Object.values(data.price)[0];

      // Генерируем радио-кнопки размеров
      const sizeRadios = Object.entries(data.price)
        .map(([size, price], index) => `
      <label class="pizza-card__size-label">
        <input class="pizza-card__size-radio visually-hidden" 
               data-price="${price}" 
               type="radio" 
               name="size" 
               value="${size}" 
               ${index === 0 ? 'checked' : ''} />
        <span class="pizza-card__size-text">${size}</span>
      </label>
    `).join('');

      const card = `
    <article data-id="${data.id}" class="pizza-card">
      <header class="pizza-card__header">
        <figure class="pizza-card__figure">
          <img class="pizza-card__img" src="./assets/img/pizza/${data.image}.png" alt="${data.namePizza}" />
        </figure>
        <h3 class="pizza-card__title">${data.namePizza}</h3>
      </header>
      <div class="pizza-card__ingredients">
        <p class="pizza-card__first-line text-ellipsis">
          Filling: ${firstThreeIngredients}
        </p>
        ${remainingIngredients ? `
          <p class="pizza-card__second-line text-ellipsis">
            ${remainingIngredients}
          </p>
        ` : ''}
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
          <button disabled class="pizza-card__quantity-btn decrement-pizza">
            <svg width="8" height="2" viewBox="0 0 12 2">
              <path d="M0 1H12" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
          <p class="pizza-card__quantity">1</p>
          <button class="pizza-card__quantity-btn pizza-card__quantity-btn--active increment-pizza">
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
  }
}


const pizzaProducts = getPizzaData();
const utils = getUtils();

const $menuPizza = document.getElementById('menuPizza');
const $cartBtn = document.getElementById('cartBtn');



// header list decor

function initHeaderListUi() {
  const $headerList = document.querySelectorAll('.header .link-nav');

  $headerList.forEach(link => {
    link.addEventListener('click', (e) => {
      $headerList.forEach(link => link.classList.remove('link-nav--active'))
      e.target.classList.add('link-nav--active');
    })
  })
}


initHeaderListUi();

// feat(menu): connect tabs filtering with card rendering

//  tabs 

const $tabs = document.getElementById('tabs');

const $allTab = document.querySelectorAll('.menu__tab-btn button');

const topContainerCards = document.getElementById('top-cards');
const bottomContainerCards = document.getElementById('bottom-cards');




$tabs.addEventListener('click', (e) => {

  const button = e.target.closest('button');
  if (!button) return;
  const category = button.getAttribute('data-category');

  $allTab.forEach(tab => {
    tab.classList.remove('btn--accent')
    const li = tab.closest('li');
    if (li) {
      li.classList.remove('menu__tab-btn--active');
    }
  })
  button.classList.add('btn--accent');
  const li = button.closest('li');
  if (li) {
    li.classList.add('menu__tab-btn--active')
  }

  utils.removeCards();

  if (category === 'all') {
    const allProducts = Object.values(pizzaProducts).flat();
    console.log(allProducts);
    const cardsTopData = allProducts.slice(0, 4);
    const cardsBottomData = allProducts.slice(4);
    
  if (cardsTopData.length) {
    const arrCards = renderAllCards(cardsTopData, utils.renderCard);

    topContainerCards.innerHTML = `${arrCards.join('')}`
  }

  
  if (cardsBottomData.length) {
    const arrCards = renderAllCards(cardsBottomData, utils.renderCard);
    bottomContainerCards.innerHTML = `${arrCards.join('')}`
  }

    return;
  }


  const cardsTopData = pizzaProducts[category].slice(0, 4);
  const cardsBottomData = pizzaProducts[category].slice(4);


  if (cardsTopData.length) {
    const arrCards = renderAllCards(cardsTopData, utils.renderCard);
    topContainerCards.innerHTML = `${arrCards.join('')}`
  }

  if (cardsBottomData.length) {
    const arrCards = renderAllCards(cardsBottomData, utils.renderCard);
    bottomContainerCards.innerHTML = `${arrCards.join('')}`
  }

})



function renderAllCards(cards, renderFun) {

  const arrCards = cards.map(card => {
    return renderFun(card)
  });

  return arrCards;
}










// cart
const savedCart = localStorage.getItem('cart');
const cart = savedCart ? JSON.parse(savedCart) : {};

$menuPizza.addEventListener('click', (e) => {
  if (!e.target.closest('.pizza-card__order')) return;
  const $pizzaCard = e.target.closest('.pizza-card');
  if (!$pizzaCard) return;

  const idPizza = +$pizzaCard.getAttribute('data-id');

  const $quantityPizza = $pizzaCard.querySelector('.pizza-card__quantity');
  const $selectedSizeRadio = $pizzaCard.querySelector('input[name="size"]:checked');

  const numberOfPizzas = +$quantityPizza.textContent;
  const sizePizza = $selectedSizeRadio.value;

  if (!cart[idPizza]) {
    console.log('записываем');
    cart[idPizza] = {
      [sizePizza]: numberOfPizzas
    }
  } else {
    cart[idPizza][sizePizza] = (cart[idPizza][sizePizza] || 0) + numberOfPizzas;
  }


  console.log(cart);
  utils.saveCart(cart);
});


// cards pizza ui -------------------------------------------


$menuPizza.addEventListener('click', (e) => {
  if (!e.target.closest('.pizza-card__quantity-btn')) return;

  const $pizzaCard = e.target.closest('.pizza-card');
  const $form = $pizzaCard.querySelector('.pizza-card__form');
  const $selectedSizeRadio = $form.querySelector('input[name="size"]:checked');

  if (!$pizzaCard) return;

  const idPizza = +$pizzaCard.getAttribute('data-id');


  const $quantityPizza = $pizzaCard.querySelector('.pizza-card__quantity');
  const $totalPricePizza = $pizzaCard.querySelector('.total-price');

  if (!$quantityPizza) return;

  console.log($selectedSizeRadio, '$selectedSizeRadio');
  let numberOfPizzas = +$quantityPizza.textContent;
  const pricePerPizza = +$selectedSizeRadio.getAttribute('data-price');


  const $btnToggleQuantity = e.target.closest('.pizza-card__quantity-btn');

  if ($btnToggleQuantity.classList.contains('increment-pizza')) {
    ++numberOfPizzas;

    if (numberOfPizzas > 1 && numberOfPizzas < 3) {
      const $btnDecrement = $pizzaCard.querySelector('.decrement-pizza');
      $btnDecrement.disabled = false;
    }

    if (numberOfPizzas > 9) {
      $btnToggleQuantity.disabled = true;
    }

    $totalPricePizza.textContent = utils.formatPrice(numberOfPizzas * pricePerPizza);
    $quantityPizza.textContent = numberOfPizzas;

  } else {
    --numberOfPizzas;
    if (numberOfPizzas > 8 && numberOfPizzas < 10) {
      const $btnIncrement = $pizzaCard.querySelector('.increment-pizza');
      $btnIncrement.disabled = false;
    }
    $totalPricePizza.textContent = utils.formatPrice(numberOfPizzas * pricePerPizza);
    $quantityPizza.textContent = numberOfPizzas;
  }

  if (numberOfPizzas < 2) {
    $btnToggleQuantity.disabled = true;
  }

});

$menuPizza.addEventListener('change', (e) => {
  if (!e.target.closest('.pizza-card__size-radio')) return;

  const $pizzaCard = e.target.closest('.pizza-card');
  const $quantityPizza = $pizzaCard.querySelector('.pizza-card__quantity');
  const $totalPricePizza = $pizzaCard.querySelector('.total-price');

  let numberOfPizzas = +$quantityPizza.textContent;
  const pricePerPizza = +e.target.getAttribute('data-price');

  $totalPricePizza.textContent = utils.formatPrice(numberOfPizzas * pricePerPizza);
})