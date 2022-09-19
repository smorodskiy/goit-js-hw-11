// Num of page from request
import { PER_PAGE } from "./services/fetch.js";

import Notiflix from "notiflix";
import { lightbox, addDownloadButtonToLightbox } from "./lightbox";

import { clickOnLike } from "./style/like";
import { pagination } from "./pagination";

// Components of style
import { customScrollbar } from "./style/scrollbar";
import { createGalleryCard } from "./style/card";

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

        // Add events to cards
        attachEventsToCards(newCards);

        return newCards;
}

// Events on click buttons in cards
// Add events on pictures and checking downloading complete
function attachEventsToCards(newCards) {
        newCards.forEach((card) => {
                // Get icons refs
                const icons = card.querySelector(".gallery__icon-wrapper");

                // Click event on Like buttons
                icons.addEventListener("click", (e) => {
                        const btn = e.currentTarget;
                        if (btn.getAttribute("data") == "likes") {
                                clickOnLike(btn);
                        }
                });

                // Get link and img refs
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
                renderPicsToGrid(foundedPics);

                // Add attach on scrolling and doing pagination if num of pages more than one
                if (numPages > 1)
                        window.onscroll = pagination.scrollPagination_deb(
                                name,
                                currentPage,
                                numPages,
                        );

                // Execute custom Scrollbar only on desktop devices
                if ("ontouchstart" in window == false) {
                        document.body.classList.add("custom-scrollbar");
                        customScrollbar.init();
                }
        }

        if (currentPage > 1) {
                // Save last position for custom scroll
                if (isCustomScroll) lastScrollTop = document.documentElement.scrollTop;

                // Hide waiting label and get label height
                pagination.showAnimation(false);

                // Rendering part of gallery
                renderPicsToGrid(foundedPics);

                // Restore last position for custom scroll
                if (isCustomScroll) document.documentElement.scrollTop = lastScrollTop;

                // Do smooth scroll
                pagination.scrollToNewCards();

                // Attach scroll event
                window.onscroll = pagination.scrollPagination_deb(name, currentPage, numPages);

                // Resize scrollbar
                document.querySelector(".custom-scrollbar") && customScrollbar.setScrollSize();
        }

        // If Lightbox preview img is open - close it
        if (lightbox.isOpen) {
                lightbox.close();

                // this event fires after the lightbox was closed
                lightbox.on("closed.simplelightbox", function (e) {
                        lightbox.refresh();
                        // Add Download button to lightbox preview
                        addDownloadButtonToLightbox();
                });
        } else {
                lightbox.refresh();
                // Add Download button to lightbox preview
                addDownloadButtonToLightbox();
        }
}
