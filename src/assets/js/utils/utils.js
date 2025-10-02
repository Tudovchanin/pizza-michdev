


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