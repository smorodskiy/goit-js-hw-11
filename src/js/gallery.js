import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// document.addEventListener("DOMContentLoaded", function () {


// const imgElements = document.createDocumentFragment();

// Empty func, on future
// lightbox.on("show.simplelightbox", function () {
//         //   console.log("show");
// });

// });

// Create box of image
function createPhotoCard(webformatURL, largeImageURL, tags, likes, views, comments, downloads) {
        const photoCard = `
        <a href="${largeImageURL}">
        <div class="photo-card">
                <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="photo-card__info">
                        <p class="photo-card__item">
                                <b>Likes: ${likes}</b>
                        </p>
                        <p class="photo-card__item">
                                <b>Views: ${views}</b>
                        </p>
                        <p class="photo-card__item">
                                <b>Comments: ${comments}</b>
                        </p>
                        <p class="photo-card__item">
                                <b>Downloads: ${downloads}</b>
                        </p>
                </div>
        </div>
        </a>
        `;

        return photoCard;
}

function initLightBox() {
        // Init lightbox        
        const lightbox = new SimpleLightbox(".gallery a", {
                captions: true,
                captionType: "attr",
                captionsData: "alt",
                captionPosition: "bottom",
                captionDelay: 250,
        });
}

// Rendering founded pictures to grid
export function renderPicsToGrid(foundedPicsJson) {
        const gallery = document.querySelector(".gallery");
        const { hits, total, totalHits } = foundedPicsJson;

        const photoCards = hits
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

                        return createPhotoCard(
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

        gallery.innerHTML = photoCards;
        initLightBox();
}
