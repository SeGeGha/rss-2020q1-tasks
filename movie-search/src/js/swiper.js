import Swiper from 'swiper';
import { movieComponent } from './movie';

const swiperManager = {
  pageObj: {
    currentPageNumber: null,
    totalPageNumber: 0,
    pageStorage: new Map(),
  },
  previousQueryName: null,
  handlerObtainData: function a(data) {
    const { movieCardStorage, pageNumber, queryName } = data;
    const isNewRequest = pageNumber === 1;

    if (isNewRequest) {
      this.updateSwiper(movieCardStorage, queryName);
      movieComponent(queryName, pageNumber + 1);
    } else {
      this.pageObj.totalPageNumber += 1;
      this.pageObj.pageStorage.set(pageNumber, movieCardStorage);
    }
  },
};

const newSwiper = new Swiper('.swiper-container', {
  direction: 'horizontal',
  centerInsufficientSlides: true,
  observer: true,
  grabCursor: true,
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

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    reachEnd: () => {
      const isSwiperInit = swiperManager.pageObj.totalPageNumber;

      if (isSwiperInit) {
        swiperManager.addSlide();
      }
    },
  },
});

swiperManager.updateSwiper = function updateSwiper(slides, queryName) {
  const searchLoader = document.querySelector('.search__loader');
  const searchResult = document.querySelector('.search__result');
  const searchInput = document.querySelector('.search__field');

  newSwiper.removeAllSlides();
  newSwiper.slideTo(0);
  newSwiper.appendSlide(slides);
  newSwiper.update();

  searchLoader.classList.remove('active');
  searchResult.textContent = (searchInput.value !== '') ? `Show result for '${queryName}'` : '';

  this.pageObj.currentPageNumber = 1;
  this.pageObj.totalPageNumber = 1;
  this.previousQueryName = queryName;
  this.pageObj.pageStorage.clear();
  this.pageObj.pageStorage.set(1, slides);
};

swiperManager.addSlide = function addSlide() {
  if (this.pageObj.currentPageNumber !== this.pageObj.totalPageNumber) {
    this.pageObj.currentPageNumber += 1;
    const id = newSwiper.activeIndex;
    newSwiper.appendSlide(this.pageObj.pageStorage.get(this.pageObj.currentPageNumber));
    newSwiper.update();
    newSwiper.slideTo(id);
    movieComponent(this.previousQueryName, this.pageObj.currentPageNumber + 1);
  }
};

export default swiperManager;
