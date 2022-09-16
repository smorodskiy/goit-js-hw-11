import { debounce } from "lodash";
import Notiflix from "notiflix";
import icons from "../images/icons.svg";
import { getPicturesByName_deb } from "../js/search";
import { PER_PAGE } from "./services/fetch.js";
import { lightbox, lightboxUpdateDownloadButton } from "./lightbox";
import { customScrollbar } from "./scrollbar";
import { likeElem, onLike } from "./like";

let numPages = 1;

// Init Notiflix params
Notiflix.Notify.init({
        ID: "NotiflixNotify",
        className: "notiflix-notify",
        // width: "280px",
        position: "right-top",
        // distance: "100px",
        clickToClose: true,
        cssAnimationStyle: "zoom",
        // closeButton: true,
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
        // <svg class="gallery__icon gallery__likes-icon">
        //         <use class="shown" xlink:href="${icons}#icon-likes"></use>
        // </svg>;

        const galleryCard = `
        
        <div class="gallery__card new">
                
                <a class="gallery__link" href="${largeImageURL}">
                        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                </a>
               
                <ul class="gallery__info">
                        <li class="gallery__item">
                                <b>Likes</b>
                                <div class="gallery__icon-wrapper" data="likes">
                                        ${likeElem()}

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

// Events on click buttons in cards
function attachEventsToCardsIcons(newCards) {
        newCards.forEach((card) => {
                const icons = card.querySelector(".gallery__icon-wrapper");
                icons.addEventListener("click", (e) => {
                        const btn = e.currentTarget;
                        if (btn.getAttribute("data") == "likes") {
                                onLike(btn);
                        }
                });
        });
}

// Smooth scrolling for pagination
function doSmoothScroll(loadingHeight) {
        const container = document.querySelector(".container");

        const paddingBottom = window
                .getComputedStyle(container, null)
                .getPropertyValue("padding-bottom");

        window.scrollBy({
                top:
                        document.documentElement.clientHeight -
                        loadingHeight -
                        parseInt(paddingBottom),
                behavior: "smooth",
        });
}

// Get absolute height of element
function getAbsoluteHeight(el) {
        // Get the DOM Node if you pass in a string
        el = typeof el === "string" ? document.querySelector(el) : el;

        const styles = window.getComputedStyle(el);
        const margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

        return Math.ceil(el.offsetHeight + margin);
}

// Loading... label
function paginationShowLoading(show) {
        const container = document.querySelector(".container");

        if (show) {
                container.insertAdjacentHTML(
                        "beforeend",
                        `
                        <div class="loading">
                        <ul>
                          <li></li>
                          <li></li>
                          <li></li>
                          <li></li>
                          <li></li>
                          <li></li>
                          <li></li>
                        </ul>
                      </div>
                        `,
                );

                // container.insertAdjacentHTML(
                //         "beforeend",
                //         `

                //         <div class="loading">
                //                 <div class="loading__yellow"></div>
                //                 <div class="loading__red"></div>
                //                 <div class="loading__blue"></div>
                //                 <div class="loading__violet"></div>
                //         </div>

                //         `,
                // );
                window.scrollTo(0, document.body.scrollHeight);
        } else {
                const loading = document.querySelector(".loading");

                // Get loading div's size
                const loadingHeight = getAbsoluteHeight(document.querySelector(".loading"));

                loading.remove();

                return loadingHeight;
        }
}

// Check end of page and do pagination
function scrollPagination(name, currentPage) {
        // If position is end of page
        if (Math.round(window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                // Temp deattach
                window.onscroll = null;

                // Increment num of page
                currentPage++;

                // Return if it's last page of pictures
                if (currentPage > numPages) {
                        // Show end message
                        Notiflix.Notify.success(`You've reached the end of search results.`);
                        return;
                }

                // Show waiting label
                paginationShowLoading(true);

                // Close active picture
                lightbox.close();

                // Little wait for loading label
                setTimeout(() => {
                        // Send request for next pages pictures
                        getPicturesByName_deb(name, currentPage);
                }, 1000);
        }
}

// Scroll pagination debounced func
const scrollPagination_deb = (name, currentPage) =>
        debounce(() => scrollPagination(name, currentPage), 100);

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
        gallery.insertAdjacentHTML("beforeend", galleryCards);

        // Get all new cards
        const newCards = gallery.querySelectorAll(".gallery__card.new");

        // Add events on pictures and checking downloading complete
        onLoadPics(newCards);

        return newCards;
}

// Add events on pictures and checking downloading complete
function onLoadPics(newCards) {
        newCards.forEach((card) => {
                const link = card.firstElementChild;
                const img = link.firstElementChild;

                // If pic is loaded - remove skelet effect and add loaded mark on img
                img.onload = () => {
                        // Added random showing delay
                        setTimeout(() => {
                                card.classList.remove("new");
                                img.classList.add("loaded");
                        }, getRndInteger(400, 1000));
                };
        });
}

// Random nums
function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
}

// Initialization render gallery
export function initRender(foundedPics, name, currentPage) {
        // Total founded pics on free account
        const { totalHits } = foundedPics;

        // If nothing founded throw Message and return
        if (totalHits == 0) {
                throw new Error(
                        `Sorry, there are no images matching your search "${name}" query. Please try again.`,
                );
        }

        const isCustomScroll = document.querySelector(".custom-scrollbar");
        let lastScrollTop;

        // If it's first page
        if (currentPage == 1) {
                // Show succes message
                name != "" && Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

                // Calcs pages
                numPages = Math.ceil(totalHits / PER_PAGE);

                // Remove blank pic
                // const gallery = document.querySelector(".intro");
                // gallery.style.setProperty("display", "none");
                // gallery.classList.remove("gallery--empty-page");

                // Clear all gallery
                clearGallery();

                // Deattach onScroll event
                window.onscroll = null;

                // Rendering part of gallery
                var newCards = renderPicsToGrid(foundedPics);

                // Add attach on scrolling and doing pagination if num of pages more than one
                if (numPages > 1) window.onscroll = scrollPagination_deb(name, currentPage);
        }

        if (currentPage > 1) {
                // Save last position for custom scroll
                if (isCustomScroll) lastScrollTop = document.documentElement.scrollTop;

                // lightbox.refresh();
                // Close active picture
                // lightbox.close();
                // const isClosed = new Promise()

                // Hide waiting label and get label height
                const loadingHeight = paginationShowLoading(false);

                // Rendering part of gallery
                var newCards = renderPicsToGrid(foundedPics);

                // Restore last position for custom scroll
                if (isCustomScroll) document.documentElement.scrollTop = lastScrollTop;

                // Do smooth scroll
                doSmoothScroll(loadingHeight);

                // Attach scroll event
                window.onscroll = scrollPagination_deb(name, currentPage);
        }

        // Refresh simple box for new DOM
        lightbox.refresh();

        // Func for Update href for Download button
        lightboxUpdateDownloadButton();

        // Attach events on cards buttons
        attachEventsToCardsIcons(newCards);

        // Execute custom Scrollbar only on desktop devices
        if ("ontouchstart" in window == false) {
                document.body.classList.add("custom-scrollbar");
                customScrollbar();
        }
}
