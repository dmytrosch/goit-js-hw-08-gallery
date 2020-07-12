import cards from "../gallery-items.js";

const refs = {
  gallery: document.querySelector(".js-gallery"),
  lightbox: document.querySelector(".js-lightbox"),
  lightboxImg: document.querySelector(".lightbox__image"),
  closeOverlayBtn: document.querySelector(".lightbox__button"),
};
let imageNumber = 0;

refs.gallery.insertAdjacentHTML("afterbegin", createMarkUp(cards));
refs.gallery.addEventListener("click", openLightbox);

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
  refs.lightbox.addEventListener("click", clickOnOutClose);
  window.addEventListener("keydown", onOverlayPressEsc);
  window.addEventListener("keydown", onOverlayPressLeftRight);
  window.addEventListener("keydown", startSlideShow);
}
function closeOverlay() {
  refs.lightbox.classList.remove("is-open");
  removeOverlayListeners();
}
function removeOverlayListeners() {
  window.removeEventListener("keydown", onOverlayPressEsc);
  window.removeEventListener("keydown", onOverlayPressLeftRight);
  // window.removeEventListener("keydown", stopSlideShow);
  refs.lightbox.removeEventListener("click", clickOnOutClose);
  refs.closeOverlayBtn.removeEventListener("click", closeOverlay);
}
function showImage(link) {
  refs.lightboxImg.src = link;
}
function clickOnOutClose(event) {
  console.log(event.target, event.currentTarget);
  if (event.target.className === "lightbox__content") {
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
    const slideShowInterval = setInterval(nextImage, 3000);
    window.removeEventListener("keydown", startSlideShow);
    window.addEventListener(
      "keydown",
      secondPressSpace(event, slideShowInterval)
    );
  }
}
function secondPressSpace(event, interval) {
  if (event.code === "Space") {
    clearInterval(interval);
    window.removeEventListener(
      "keydown",
      secondPressSpace(event, slideShowInterval)
    );
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
