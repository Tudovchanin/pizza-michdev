

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


