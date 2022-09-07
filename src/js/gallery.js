import { head, slice } from "lodash";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import icons from "../images/icons.svg";

// Create instanse of SimpleBox
const lightbox = new SimpleLightbox(".gallery a", {
        captions: true,
        captionType: "attr",
        captionsData: "alt",
        captionPosition: "bottom",
        captionDelay: 250,
});

// Create box of image
function createGalleryCard(
        pageURL,
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
) {
        const galleryCard = `
        
        <div class="gallery__card">
                <a class="gallery__link" href="${largeImageURL}">
                        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
                <ul class="gallery__info">
                        <li class="gallery__item">
                                <b>Likes</b>
                                <div class="gallery__icon-wrapper" data="likes">
                                        <svg class="gallery__icon gallery__likes-icon">                                                
                                                <use class="shown" xlink:href="${icons}#icon-likes"></use>
                                        </svg>
                                        <p>${likes}</p>
                                </div>
                        </li>
                        <li class="gallery__item">
                                <b>Views</b>
                                <div class="gallery__icon-wrapper" data="views">
                                        <svg class="gallery__icon gallery__views-icon">
                                                <use xlink:href="${icons}#icon-views"></use>
                                        </svg>
                                        <p>${views}</p>
                                </div>                                
                        </li>
                        <li class="gallery__item">
                                <b>Comments</b>
                                <a href="${pageURL}#comments">
                                        <div class="gallery__icon-wrapper" data="comment">
                                                <svg class="gallery__icon gallery__comments-icon">
                                                        <use xlink:href="${icons}#icon-comments"></use>
                                                </svg>
                                                <p>${comments}</p>
                                        </div>                                                                
                                </a>
                        </li>
                        <li class="gallery__item">
                                <b>Downloads</b>
                                <div class="gallery__icon-wrapper" data="downloads">
                                        <svg class="gallery__icon gallery__downloads-icon">
                                                <use xlink:href="${icons}#icon-downloads"></use>
                                        </svg>
                                        <p>${downloads}</p>
                                </div>                                                                
                        </li>
                </ul>
        </div>
        
        `;

        return galleryCard;
}

// Change like(fill and not fill)
function onLikeBtn(btn) {
        const useElem = btn.querySelector("use");
        const countLikesElem = btn.querySelector('p');

        let href = useElem.getAttribute("xlink:href");

        if (href.includes("-fill")) {
                href = href.substring(0, href.length - 5);
                --countLikesElem.innerText;
        } else {
                href += "-fill";
                ++countLikesElem.innerText;
        }

        useElem.setAttribute("xlink:href", href);
}

// Events on click buttons in cards
function attachEventsToCardsIcons() {
        const icons = document.querySelectorAll(".gallery__icon-wrapper");

        icons.forEach((icon) => {
                icon.addEventListener("click", (e) => {
                        const btn = e.currentTarget;
                        if (btn.getAttribute("data") == "likes") {
                                onLikeBtn(btn);
                        }
                });
        });
}

// Rendering founded pictures to grid
export function renderPicsToGrid(foundedPicsJson) {
        const gallery = document.querySelector(".gallery");

        const { hits } = foundedPicsJson;

        // Remap json to HTML elements
        const galleryCards = hits
                .map((img) => {
                        const {
                                pageURL,
                                webformatURL,
                                largeImageURL,
                                tags,
                                likes,
                                views,
                                comments,
                                downloads,
                        } = img;

                        return createGalleryCard(
                                pageURL,
                                webformatURL,
                                largeImageURL,
                                tags,
                                likes,
                                views,
                                comments,
                                downloads,
                        );
                })
                .join("");

        // Remove blank pic
        gallery.classList.remove("gallery--empty-page");

        // Add new photos to DOM
        gallery.innerHTML = galleryCards;

        // Refresh simple box for new DOM
        lightbox.refresh();

        // Attach events on cards buttons
        attachEventsToCardsIcons();
}
