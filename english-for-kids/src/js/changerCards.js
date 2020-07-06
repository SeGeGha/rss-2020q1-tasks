import Page from './trainMode';
import changePage from './changerPage';

let cards = null;

function changeCard(target, objDifWords) {
  const categoryName = (target) ? target.dataset.name : 'statistics';
  const namePage = (target) ? target.getAttribute('href').slice(1) : 'category';
  const categoryCards = document.querySelectorAll('.category-page .category-card'); // Get all (8) cards from container

  if (namePage === 'category') {
    cards = new Page(categoryCards);
    cards.init(categoryName, objDifWords);
    cards.connectPage();
  }

  changePage(namePage, categoryName);
}

export { changeCard, cards };
