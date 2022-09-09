import { debounce } from "lodash";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";

import icons from "../images/icons.svg";
import { getPicturesByName } from "../js/search";
import { PER_PAGE } from "./fetch.js";

// Create instanse of SimpleBox
const lightbox = new SimpleLightbox(".gallery .gallery__link", {
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
        const countLikesElem = btn.querySelector("p");

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

// Smooth scrolling for pagination
function doSmoothScroll() {
        const { height: cardHeight } = document
                .querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

        console.log(cardHeight);

        console.log("SCROLLING");
        window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
        });
}

// Attach to window.scroll
function attachToScrollAndPagination(name, currentPage, numPages) {
        // Check end of page and do pagination
        const isEndPageDebounced = debounce(() => {
                // Notiflix.Notify.info(`scrollHeight: ${document.body.scrollHeight}
                // ,
                // height: ${window.innerHeight} + Y: ${Math.trunc(window.scrollY)},
                // sum: ${window.innerHeight + Math.trunc(window.scrollY)};
                // `);
                if (Math.round(window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                        // Increment num of page
                        currentPage++;

                        // Deattach pagination if endpage and return
                        if (currentPage > numPages) {
                                // Show end message
                                Notiflix.Notify.success(`You've reached the end of search results.`);
                                window.onscroll = null;
                                return;
                        }

                        // Post req for next page and doing smooth scroll
                        // Wait async get... func
                        (async () => {
                                await getPicturesByName(name, currentPage);
                                doSmoothScroll()
                        })();
                                                
                        
                }
        }, 300);

        window.onscroll = isEndPageDebounced;
}

// Clear gallery
function clearGallery() {
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
}

// Rendering founded pictures to grid
function renderPicsToGrid(picsOfJSON) {
        const gallery = document.querySelector(".gallery");

        const { hits } = picsOfJSON;

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

        // Append new photos to DOM
        gallery.innerHTML += galleryCards;
}

// Initialization render gallery
export function initRender(foundedPics, name, currentPage) {
        // Total founded pics on free account
        const { totalHits } = foundedPics;

        // If nothing founded throw Message and return
        if (totalHits == 0) {
                throw new Error(`Sorry, there are no images matching your search "${name}" query. Please try again.`);
        }

        // If it's first page
        if (currentPage == 1) {
                // Show succes message
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

                // Calcs pages
                const numPages = Math.ceil(totalHits / PER_PAGE);                

                // Remove blank pic
                const gallery = document.querySelector(".gallery");
                gallery.classList.remove("gallery--empty-page");

                // Clear all gallery
                clearGallery();

                // Deattach onScroll event
                window.onscroll = null;

                // Add attach on scrolling and doing pagination if count of pages more than one
                if (numPages > 1) attachToScrollAndPagination(name, currentPage, numPages);
        }

        // Rendering part of gallery
        renderPicsToGrid(foundedPics);

        // Refresh simple box for new DOM
        lightbox.refresh();

        // Attach events on cards buttons
        attachEventsToCardsIcons();
}
