document.addEventListener('DOMContentLoaded', () => {
  const burgerMenu = document.querySelector('.burger-menu');

  burgerMenu.querySelector('.burger-menu__btn').addEventListener('click', (event) => {
    event.target.classList.toggle('burger-menu__btn_active');
  });
});
