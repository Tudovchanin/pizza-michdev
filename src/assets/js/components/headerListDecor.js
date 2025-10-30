


function initHeaderListUi() {
  const $headerList = document.querySelectorAll('.header .link-nav');

  $headerList.forEach(link => {
    link.addEventListener('click', (e) => {
      $headerList.forEach(link => link.classList.remove('link-nav--active'))
      e.target.classList.add('link-nav--active');
    })
  })
}