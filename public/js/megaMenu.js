if (document.querySelector(".account__image")) {
  document.querySelector(".account__image").addEventListener("click", (e) => {
    const accountMenu = document.querySelector(".account__menu");
    accountMenu.classList.toggle("account__menu-hidden");
    accountMenu.classList.toggle("account__menu-show");
  });
}
