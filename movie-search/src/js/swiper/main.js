import { movieComponent } from '../movie/main';
import { searchInput, searchResult, searchLoader } from '../directory/globalVariables';
import newSwiper from './swiperObject';

const swiperManager = {
  previousQueryName: null,
  totalPageNumber: 0,
  handlerObtainData: function handler(data) {
    const { movieCardStorage, pageNumber, query } = data;
    const isNewRequest = pageNumber === 1;

    function preventChangeSlide(isAllowed) {
      newSwiper.allowSlideNext = isAllowed;
      newSwiper.allowSlidePrev = isAllowed;
      newSwiper.allowTouchMove = isAllowed;
    }

    if (isNewRequest) {
      this.previousQueryName = query;
      this.totalPageNumber = 1;

      searchLoader.classList.remove('active');
      searchResult.textContent = (searchInput.value !== '') ? `Show result for '${query}'` : '';

      newSwiper.wrapperEl.classList.add('fadeOut');
      preventChangeSlide(false);

      setTimeout(() => {
        newSwiper.virtual.removeAllSlides();
        newSwiper.virtual.appendSlide(movieCardStorage);
        newSwiper.update();

        movieComponent(query, pageNumber + 1);

        newSwiper.wrapperEl.classList.add('fadeIn');
      }, 500);

      setTimeout(() => {
        newSwiper.wrapperEl.classList.remove('fadeOut', 'fadeIn');
        preventChangeSlide(true);
      }, 1000);
    } else {
      this.totalPageNumber += 1;

      newSwiper.virtual.appendSlide(movieCardStorage);
    }
  },
};


export default swiperManager;
