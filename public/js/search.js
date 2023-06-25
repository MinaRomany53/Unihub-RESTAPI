const searchBox = document.querySelector(".search__box");
const searchBtn = document.querySelector(".search__btn");
const searchInput = document.querySelector(".search__input");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!searchInput.value) return;
  const searchTerm = searchInput.value.replace(/  +/g, " ");
  window.location.href = `/search?searchTerm=${searchTerm}`;
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!searchInput.value) return;
    const searchTerm = searchInput.value.replace(/  +/g, " ");
    window.location.href = `/search?searchTerm=${searchTerm}`;
  }
});
