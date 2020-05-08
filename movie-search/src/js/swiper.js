import Swiper from 'swiper';
import { movieComponent } from './movie';
import { searchInput, searchResult, searchLoader } from './directory/globalVariables';

const swiperManager = {
  previousQueryName: null,
  totalPageNumber: 0,
};

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

swiperManager.handlerObtainData = function handler(data) {
  const { movieCardStorage, pageNumber, queryName } = data;
  const isNewRequest = pageNumber === 1;
  if (isNewRequest) {
    this.previousQueryName = queryName;
    this.totalPageNumber = 1;

    searchLoader.classList.remove('active');
    searchResult.textContent = (searchInput.value !== '') ? `Show result for '${queryName}'` : '';

    document.querySelector('.swiper-container').classList.add('fadeOut');

    setTimeout(() => {
      newSwiper.virtual.removeAllSlides();
      newSwiper.virtual.appendSlide(movieCardStorage);
      newSwiper.update();

      movieComponent(queryName, pageNumber + 1);

      document.querySelector('.swiper-container').classList.add('fadeIn');
    }, 1000);

    setTimeout(() => {
      document.querySelector('.swiper-container').classList.remove('fadeOut', 'fadeIn');
    }, 2000);
  } else {
    this.totalPageNumber += 1;

    newSwiper.virtual.appendSlide(movieCardStorage);
  }
};

export default swiperManager;
