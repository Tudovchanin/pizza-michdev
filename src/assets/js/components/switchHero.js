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