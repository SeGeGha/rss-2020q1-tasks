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
    debugger;
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
  slidesPerView: 3, // Responsive
  centerInsufficientSlides: true,
  observer: true,

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
  this.pageObj.totalPageNumber = 0; // костыль)
  newSwiper.removeAllSlides();
  newSwiper.slideTo(0);
  newSwiper.appendSlide(slides);
  newSwiper.update();

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
