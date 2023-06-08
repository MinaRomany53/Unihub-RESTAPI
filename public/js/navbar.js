const navIconBtn = document.getElementById("mobile_btn");
const navbar = document.querySelector(".nav");
const overlay = document.querySelector(".overlay");

const openNav = () => {
  navIconBtn.innerHTML = '<i class="fa-solid fa-x icon-x"></i>';
  navIconBtn.setAttribute("data-state", "close");
  navbar.classList.remove("hidden");
  navbar.classList.add("show");
  overlay.style.width = "100%";
  // document.body.style.position = "fixed"; // prevent scrolling
};
const closeNav = () => {
  navIconBtn.innerHTML = '<i class="fa-solid fa-bars icon"></i>';
  navIconBtn.setAttribute("data-state", "open");
  navbar.classList.remove("show");
  navbar.classList.add("hidden");
  overlay.style.width = "0%";
  // document.body.style.position = "relative";
};

// Nav Icon Button Event
navIconBtn.addEventListener("click", (e) => {
  const state = navIconBtn.getAttribute("data-state");
  if (state === "open") openNav();
  else if (state === "close") closeNav();
});

overlay.addEventListener("click", (e) => {
  const state = navIconBtn.getAttribute("data-state");
  state === "close" && closeNav();
});
document.addEventListener("keydown", (e) => {
  const state = navIconBtn.getAttribute("data-state");
  if (e.key === "Escape" && state === "close") {
    closeNav();
  }
});
