import cards from "../gallery-items.js";

const refs = {
  gallery: document.querySelector(".js-gallery"),
  lightbox: document.querySelector(".js-lightbox"),
  lightboxImg: document.querySelector(".lightbox__image"),
  closeOverlayBtn: document.querySelector(".lightbox__button"),
  content: document.querySelector(".lightbox__content"),
};
const slideShowoptions = {
  disable: true,
  timerId: null,
};
let imageNumber = 0;
// let disable = true;
// let timerId = null;

refs.gallery.addEventListener("click", openLightbox);
renderItems(createMarkUp(cards), refs.gallery);

function renderItems(markup, list) {
  list.insertAdjacentHTML("afterbegin", markup);
}
function createMarkUp(arrCards) {
  const markUp = arrCards.reduce((acc, image, index) => {
    acc += `
        <li class="gallery__item">
        <a class="gallery__link" href=${image.original}>
        <img class="gallery__image" src=${image.preview} data-number="${
      index + 1
    }" data-source=${image.original} alt=${image.description}></a>
        </li>
        `;
    return acc;
  }, "");
  return markUp;
}
function openLightbox(event) {
  event.preventDefault();
  if (event.target.tagName === "IMG") {
    refs.lightbox.classList.add("is-open");
    showImage(event.target.dataset.source);
    imageNumber = Number(event.target.dataset.number);
    addOverlayListeners();
  }
}
function addOverlayListeners() {
  refs.closeOverlayBtn.addEventListener("click", closeOverlay);
  refs.content.addEventListener("click", clickOnOutClose);
  window.addEventListener("keydown", onOverlayPressEsc);
  window.addEventListener("keydown", onOverlayPressLeftRight);
  window.addEventListener("keydown", startSlideShow);
  refs.lightboxImg.addEventListener("click", onImageClick);
}
function closeOverlay() {
  refs.lightbox.classList.remove("is-open");
  clearInterval(slideShowoptions.timerId);
  slideShowoptions.disable = true;
  removeOverlayListeners();
}
function removeOverlayListeners() {
  window.removeEventListener("keydown", onOverlayPressEsc);
  window.removeEventListener("keydown", onOverlayPressLeftRight);
  window.removeEventListener("keydown", startSlideShow);
  window.removeEventListener("click", clickOnOutClose);
  window.removeEventListener("click", closeOverlay);
  window.removeEventListener("click", onImageClick);
}
function showImage(link) {
  refs.lightboxImg.src = link;
}
function clickOnOutClose(event) {
  if (event.target == event.currentTarget) {
    closeOverlay();
  }
}
function onOverlayPressEsc(event) {
  if (event.code === "Escape") {
    closeOverlay();
  }
}
function onOverlayPressLeftRight(event) {
  if (event.code === "ArrowLeft") {
    prevImage();
  }
  if (event.code === "ArrowRight") {
    nextImage();
  }
}
function searchSrc() {
  const src = cards[imageNumber - 1].original;
  showImage(src);
}
function startSlideShow(event) {
  if (event.code === "Space") {
    if (slideShowoptions.disable) {
      slideShowoptions.timerId = setInterval(nextImage, 3000);
      slideShowoptions.disable = false;
    } else {
      clearInterval(slideShowoptions.timerId);
      slideShowoptions.disable = true;
    }
  }
}
function nextImage() {
  if (imageNumber < cards.length) {
    imageNumber++;
  } else {
    imageNumber = 1;
  }
  searchSrc();
}
function prevImage() {
  if (imageNumber > 1) {
    imageNumber--;
  } else {
    imageNumber = cards.length;
  }
  searchSrc();
}
function onImageClick(event) {
  if (event.offsetX >= this.offsetWidth / 2) {
    nextImage();
  } else {
    prevImage();
  }
}
