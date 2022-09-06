import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

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
                                ${likes}
                        </p>
                        <p class="gallery__item">
                                <b>Views</b>
                                ${views}
                        </p>
                        <p class="gallery__item">
                                <b>Comments</b>
                                ${comments}
                        </p>
                        <p class="gallery__item">
                                <b>Downloads</b>
                                ${downloads}
                        </p>
                </div>
        </div>
        </a>
        `;

        return galleryCard;
}


function emptyGallery() {
                
}

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

        // Add new photos to DOM
        gallery.innerHTML = galleryCards;

        // Refresh simple box for new DOM
        lightbox.refresh();

}
