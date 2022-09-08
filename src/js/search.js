import { fetchPictures } from "./fetch.js";
import Notiflix from "notiflix";
import { initRender } from "./gallery";

// Wait the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
        // Refs to DOM elements
        const searchElem = document.querySelector(".search__input");
        const searchBoxElem = document.querySelector(".search__box");
        const searchIconElem = document.querySelector(".search__find-icon");
        const goBtnElem = document.querySelector(".search__go-btn");

        // On Focus
        searchElem.addEventListener("focus", () => {
                searchBoxElem.classList.add("search__box--searching");
                searchIconElem.classList.add("search__find-icon--rotate");
        });

        // On take focus off
        searchElem.addEventListener("blur", () => {
                searchBoxElem.classList.remove("search__box--searching");
                searchIconElem.classList.remove("search__find-icon--rotate");
        });

        searchElem.addEventListener("keydown", (e) => {
                if (e.keyCode === 13) {
                        e.preventDefault();
                        getPicturesByName(searchElem.value, 1);
                }
        });

        // On typing
        searchElem.addEventListener("keyup", (e) => {
                // Show arrow if value is not empty
                if (e.target.value.length > 0) {
                        goBtnElem.classList.add("search__go-btn--goin");
                } else {
                        goBtnElem.classList.remove("search__go-btn--goin");
                }
        });

        // On button click
        goBtnElem.addEventListener("click", () => {
                getPicturesByName(searchElem.value, 1);
        });
});

// Post http req and trying to get pictures
export function getPicturesByName(name, page = 1) {
        fetchPictures(name, page)
                .then((response) => {
                        if (!response.ok) {
                                throw new Error(response.status);
                        }

                        return response.json();
                })

                .then((foundedPics) => {
                        try {

                                console.log('START----------------');
                                console.log(`getPicturesByName(${name}, ${page})`);

                                initRender(foundedPics, name, page);
                        } catch (error) {
                                console.log(error);
                                Notiflix.Notify.failure(error.message);
                        }
                })

                .catch(() => {
                        Notiflix.Notify.failure("Oops, something was going wrong");
                });
}
