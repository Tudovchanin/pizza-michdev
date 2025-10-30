function initVideoPromo(triggerElement, videoElement) {
  const $title = document.querySelector('.promo__title');
  const videoPlayer = {
    $video: videoElement,
    
    playVideo() {
      this.$video.play().catch(e => {
        console.log('Автовоспроизведение заблокировано', e);
      });
    },
    
    pauseVideo() {
      this.$video.pause();
    }
  }

  const options = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px',
  };
  const onEntry = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        videoPlayer.playVideo();
        $title.classList.remove('promo__title--hidden');
        observer.unobserve(triggerElement);

      }
    });
  };

  const observer = new IntersectionObserver(onEntry, options);
  observer.observe(triggerElement);
}