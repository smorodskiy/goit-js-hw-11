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
function createGalleryCard(webformatURL, largeImageURL, tags, likes, views, comments, downloads) {
        const galleryCard = `
        <a class="gallery__link" href="${largeImageURL}">
        <div class="gallery__card">
                <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="gallery__info">
                        <p class="gallery__item">
                                <b>Likes</b>
                                <span class="gallery__icon-wrapper">
                                        <svg class="gallery__icon gallery__likes-icon">
                                                <use xlink:href="${icons}#icon-likes"></use>
                                        </svg>
                                        ${likes}
                                </span>
                        </p>
                        <p class="gallery__item">
                                <b>Views</b>
                                <span class="gallery__icon-wrapper">
                                        <svg class="gallery__icon gallery__views-icon">
                                                <use xlink:href="${icons}#icon-views"></use>
                                        </svg>
                                        ${views}
                                </span>                                
                        </p>
                        <p class="gallery__item">
                                <b>Comments</b>
                                <span class="gallery__icon-wrapper">
                                        <svg class="gallery__icon gallery__comments-icon">
                                                <use xlink:href="${icons}#icon-comments"></use>
                                        </svg>
                                        ${comments}
                                </span>                                                                
                        </p>
                        <p class="gallery__item">
                                <b>Downloads</b>
                                <span class="gallery__icon-wrapper">
                                        <svg class="gallery__icon gallery__downloads-icon">
                                                <use xlink:href="${icons}#icon-downloads"></use>
                                        </svg>
                                        ${downloads}
                                </span>                                                                
                        </p>
                </div>
        </div>
        </a>
        `;

        return galleryCard;
}

function emptyGallery() {}

// Rendering founded pictures to grid
export function renderPicsToGrid(foundedPicsJson) {
        const gallery = document.querySelector(".gallery");

        const { hits } = foundedPicsJson;

        // Remap json to HTML elements
        const galleryCards = hits
                .map((img) => {
                        const {
                                webformatURL,
                                largeImageURL,
                                tags,
                                likes,
                                views,
                                comments,
                                downloads,
                        } = img;

                        return createGalleryCard(
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
}
