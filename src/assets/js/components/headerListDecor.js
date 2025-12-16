


function initHeaderListUi(targetElements) {
  const $headerList = document.querySelectorAll('.header .link-nav');

  let clickLinkHeader = false;

  $headerList.forEach(link => {
    link.addEventListener('click', (e) => {
      clickLinkHeader = true;
      linkUiActive(e.target);
      setTimeout(() => {
        clickLinkHeader = false;
      }, 500);
    })
  });


  const options = {
    threshold: 0,
    rootMargin: '-50% 0px -50% 0px'
  };

  const onEntry = (entries) => {
    entries.forEach(entry => {
      if(clickLinkHeader) return;
      const { isIntersecting, target} = entry;

      if (isIntersecting) {
        const indexSection = +target.getAttribute('data-index');
          linkUiActive($headerList[indexSection]);
      }
    });
  };

  const observer = new IntersectionObserver(onEntry, options);

  targetElements.forEach(section => {
    observer.observe(section);
  });


  function linkUiActive(target) {

    if(!target) return;
    $headerList.forEach(link => link.classList.remove('link-nav--active'));
    target.classList.add('link-nav--active');
  }

}