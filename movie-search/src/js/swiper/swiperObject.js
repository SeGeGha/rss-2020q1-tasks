import Swiper from 'swiper';
import { movieComponent } from '../movie/main';
import swiperManager from './main';

const newSwiper = new Swiper('.swiper-container', {
  direction: 'horizontal',
  centerInsufficientSlides: true,
  grabCursor: true,
  preventInteractionOnTransition: true,
  speed: 400,
  virtual: {
    renderSlide(slide) {
      return slide;
    },
    cache: true,
    addSlidesAfter: 6,
    addSlidesBefore: 6,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 100,
    },
    775: {
      slidesPerView: 2,
      spaceBetween: 75,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 100,
    },
    1600: {
      slidesPerView: 4,
      spaceBetween: 100,
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

newSwiper.on('slideChange', () => {
  if (newSwiper.activeIndex % 10 === 7) {
    const query = swiperManager.previousQueryName;
    const pageNumber = swiperManager.totalPageNumber + 1;

    movieComponent(query, pageNumber);
  }
});

export default newSwiper;
