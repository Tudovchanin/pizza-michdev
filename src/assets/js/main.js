"use strict";


//= components/test.js

//= data/pizza.data.js
//= utils/utils.js


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

const topContainerCards = document.getElementById('top-cards');
const bottomContainerCards = document.getElementById('bottom-cards');

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
console.log(e.target);
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




$tabs.addEventListener('click', (e)=> {

  const button = e.target.closest('button');
  if(!button) return;
  const category = button.getAttribute('data-category');
  console.log(category);
  $allTab.forEach(tab => {
    tab.classList.remove('btn--accent')
    const li = tab.closest('li');
    if(li){
      li.classList.remove('menu__tab-btn--active');
    }
  })
  button.classList.add('btn--accent');
  const li = button.closest('li');
  if(li) {
    li.classList.add('menu__tab-btn--active')
  }
  console.log(pizzaProducts[category][0]);
  utils.removeCards();
  const card = utils.renderCard(pizzaProducts[category][0]);
  topContainerCards.innerHTML = `${card}`;
})
