"use strict";






function getPizzaData (){
  const productsData = {
    meat: [
      {
        id: 1,
        name: "Meat",
        description: "Assortment of beef, ham, pepperoni and bacon",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "meat-pizza",
        ingredients: ["beef", "ham", "pepperoni", "bacon", "mozzarella", "tomato sauce"]
      },
      {
        id: 2,
        name: "Argentina", 
        description: "Juicy Argentinian beef with herbs",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "argentina-pizza",
        ingredients: ["beef", "herbs", "onions", "bell peppers", "mozzarella", "tomato sauce"]
      },
      {
        id: 3,
        name: "Venecia",
        description: "Venetian style with Italian sausages",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "venecia-pizza",
        ingredients: ["Italian sausages", "olives", "onions", "bell peppers", "mozzarella"]
      },
      {
        id: 4,
        name: "Pepperoni Classic",
        description: "Double pepperoni with extra cheese",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "pepperoni-pizza",
        ingredients: ["pepperoni", "mozzarella", "tomato sauce", "oregano"]
      },
      {
        id: 5,
        name: "BBQ Chicken",
        description: "Grilled chicken with BBQ sauce",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "bbq-chicken-pizza",
        ingredients: ["chicken", "BBQ sauce", "red onions", "mozzarella", "corn"]
      }
    ],
    
    vegetarian: [
      {
        id: 6,
        name: "Cheese",
        description: "Mozzarella, gorgonzola, parmesan and ricotta",
        price: { 22: 10, 28: 14, 33: 18 },
        image: "cheese-pizza",
        ingredients: ["mozzarella", "gorgonzola", "parmesan", "ricotta", "tomato sauce"]
      },
      {
        id: 7,
        name: "Tomato",
        description: "Classic with fresh tomatoes and basil",
        price: { 22: 9, 28: 13, 33: 17 },
        image: "tomato-pizza",
        ingredients: ["fresh tomatoes", "basil", "mozzarella", "tomato sauce"]
      },
      {
        id: 8,
        name: "Italian",
        description: "Traditional Italian recipe",
        price: { 22: 8.35, 28: 15.33, 33: 19.60 },
        image: "italian-pizza",
        ingredients: ["prosciutto", "arugula", "parmesan", "mozzarella", "tomato sauce"]
      },
      {
        id: 9,
        name: "Italian x2",
        description: "Double portion of Italian ingredients",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "italian-x2-pizza",
        ingredients: ["prosciutto", "salami", "olives", "mozzarella", "tomato sauce"]
      },
      {
        id: 10,
        name: "Vegetarian",
        description: "Fresh vegetables and herbs",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "vegetarian-pizza",
        ingredients: ["bell peppers", "tomatoes", "onions", "olives", "mushrooms", "mozzarella"]
      },
      {
        id: 11,
        name: "Mediterranean",
        description: "Sun-dried tomatoes, olives and feta cheese",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "mediterranean-pizza",
        ingredients: ["sun-dried tomatoes", "olives", "feta cheese", "spinach", "mozzarella"]
      }
    ],
    
    mushroom: [
      {
        id: 12,
        name: "Gribnaya",
        description: "Assorted mushrooms with creamy sauce",
        price: { 22: 10, 28: 14, 33: 18 },
        image: "mushroom-pizza",
        ingredients: ["champignons", "porcini mushrooms", "creamy sauce", "mozzarella", "thyme"]
      },
      {
        id: 13,
        name: "Forest Mushroom",
        description: "Wild forest mushrooms with herbs",
        price: { 22: 11, 28: 15, 33: 19 },
        image: "forest-mushroom-pizza",
        ingredients: ["wild mushrooms", "herbs", "garlic", "mozzarella", "cream sauce"]
      },
      {
        id: 14,
        name: "Truffle Mushroom",
        description: "Mushrooms with truffle oil",
        price: { 22: 13, 28: 17, 33: 21 },
        image: "truffle-pizza",
        ingredients: ["mushrooms", "truffle oil", "parmesan", "mozzarella", "cream sauce"]
      }
    ],
    
    sea_products: [
      {
        id: 15,
        name: "Seafood Mix",
        description: "Shrimps, squid and mussels",
        price: { 22: 14, 28: 18, 33: 22 },
        image: "seafood-pizza",
        ingredients: ["shrimps", "squid", "mussels", "garlic", "mozzarella", "white sauce"]
      },
      {
        id: 16,
        name: "Tuna & Corn",
        description: "Tuna with sweet corn and onions",
        price: { 22: 12, 28: 16, 33: 20 },
        image: "tuna-pizza",
        ingredients: ["tuna", "sweet corn", "red onions", "mozzarella", "tomato sauce"]
      },
      {
        id: 17,
        name: "Salmon Supreme",
        description: "Smoked salmon with cream cheese",
        price: { 22: 15, 28: 19, 33: 23 },
        image: "salmon-pizza",
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
        minimumFractionDigits:0,
        maximumFractionDigits: 2
      }).format(price);
    },
    saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
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
    link.addEventListener('click', (e)=> {
      $headerList.forEach(link=> link.classList.remove('link-nav--active'))
      e.target.classList.add('link-nav--active');
    })
  })
 }


 initHeaderListUi();



//  tabs 

const $tabs = document.getElementById('tabs');

const $allTab = document.querySelectorAll('.menu__tab-btn button');

$tabs.addEventListener('click', (e)=> {

  const button = e.target.closest('button');
  if(!button) return;

  const category = button.getAttribute('data-category');
  console.log(category);
  console.log($allTab);
  $allTab.forEach(tab => tab.classList.remove('btn--accent'));
  button.classList.add('btn--accent');


console.log(button);
})

console.log($tabs);


// cart
const savedCart = localStorage.getItem('cart');
const cart = savedCart ? JSON.parse(savedCart) : {};

$menuPizza.addEventListener('click', (e)=> {
  if (!e.target.closest('.pizza-card__order')) return;
  const $pizzaCard = e.target.closest('.pizza-card');
  if (!$pizzaCard) return;

  const idPizza = +$pizzaCard.getAttribute('data-id');
  
  const $quantityPizza = $pizzaCard.querySelector('.pizza-card__quantity');
  const $selectedSizeRadio = $pizzaCard.querySelector('input[name="size"]:checked');

  const numberOfPizzas = +$quantityPizza.textContent;
  const sizePizza = $selectedSizeRadio.value;

  if(!cart[idPizza]) {
    console.log('записываем');
    cart[idPizza] = {
        [sizePizza]:numberOfPizzas
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