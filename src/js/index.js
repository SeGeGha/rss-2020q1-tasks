document.addEventListener('DOMContentLoaded', () => {
  const burgerMenu = document.querySelector('.burger-menu');
  const burgerBtn = burgerMenu.querySelector('.burger-menu__btn');
  const navigation = burgerMenu.querySelector('.burger-menu__navigation');

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('burger-menu__btn_active');
    navigation.classList.toggle('burger-menu__navigation_active');
  });
});
