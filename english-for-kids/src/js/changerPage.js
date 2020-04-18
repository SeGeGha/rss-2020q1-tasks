const navigation = document.querySelector('.burger-menu__navigation');
const sections = document.querySelectorAll('section');

function changePage(pageName, categoryName) {
  sections.forEach((page) => page.classList.remove('page_active'));
  document.querySelector(`.${pageName}-page`).classList.add('page_active');

  navigation.querySelectorAll('a').forEach((a) => {
    if (a.dataset.name === categoryName) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

export default changePage;
