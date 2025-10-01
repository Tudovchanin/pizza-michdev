


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