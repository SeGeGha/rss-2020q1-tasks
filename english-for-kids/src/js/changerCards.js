import Page from './trainMode';
import changePage from './changerPage';

let cards = null;

function changeCard(target) {
  const categoryName = target.dataset.name;
  const namePage = target.getAttribute('href').slice(1);
  const categoryCards = document.querySelectorAll('.category-page .category-card'); // Get all (8) cards from container

  if (namePage === 'category') {
    cards = new Page(categoryCards);
    cards.init(categoryName);
    cards.connectPage();
  }

  changePage(namePage, categoryName);
}

export { changeCard, cards };
