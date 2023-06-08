/* Start Slider */

let slides = document.querySelectorAll(".slide");
if (slides.length === 0) slides = document.querySelectorAll(".slide-full");

const sliderBtnRight =
  document.querySelector(".slider__btn--right") ||
  document.querySelector(".slider-full__btn--right");

const sliderBtnLeft =
  document.querySelector(".slider__btn--left") ||
  document.querySelector(".slider-full__btn--left");

let currSlide = 0;
const maxSlides = slides.length;

const createSlides = function (slide) {
  // 0% 100% 200%
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
createSlides(0);

const nextSlide = function () {
  if (currSlide >= maxSlides - 1) {
    currSlide = 0;
    sliderBtnRight;
  } else {
    currSlide++;
  }
  createSlides(currSlide);
};

const previousSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlides - 1;
  } else {
    currSlide--;
  }
  createSlides(currSlide);
};

//////////////////////Events Handler/////////////////////////
// Next Slide
sliderBtnRight.addEventListener("click", nextSlide);
// Previous Slide
sliderBtnLeft.addEventListener("click", previousSlide);

// Keyboard handle
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextSlide();
  }
  if (e.key === "ArrowLeft") {
    previousSlide();
  }
});

/* End Slider */
