


function initHeaderListUi(targetElements) {
  const $headerList = document.querySelectorAll('.header .link-nav');

  $headerList.forEach(link => {
    link.addEventListener('click', (e) => {
      linkUiActive(e.target);
    })
  });



const options = {
  threshold: 0,
  rootMargin: '0px 0px -200px 0px',

};
const onEntry = (entries) => {
  entries.forEach(entry => {
    const { isIntersecting, target } = entry;
    if (isIntersecting) {
     console.log('появился', target.getAttribute('data-index'));
     const indexSection = +target.getAttribute('data-index');
    //  linkUiActive($headerList[indexSection]);
    console.log(indexSection);
    } 
  });
};
const observer = new IntersectionObserver(onEntry, options);

targetElements.forEach(section => {
  observer.observe(section);
});


function  linkUiActive(target) {
  $headerList.forEach(link => link.classList.remove('link-nav--active'));
  target.classList.add('link-nav--active');

}

}