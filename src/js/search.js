import { fetchPictures } from "./fetch.js";
import Notiflix from "notiflix";
import { renderPicsToGrid } from "./gallery";

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
                        getPicByName(searchElem.value);
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
                getPicByName(searchElem.value);
        });
});

// Post http req and trying to get pictures
function getPicByName(name) {
        fetchPictures(name)
                .then((response) => {
                        if (!response.ok) {
                                throw new Error(response.status);
                        }

                        return response.json();
                })

                .then((foundedPics) => {
                        try {
                                const { totalHits } = foundedPics;
                                if (totalHits == 0) {
                                        throw new Error(`Images on the request ${name} not found`);
                                }

                                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

                                renderPicsToGrid(foundedPics);
                        } catch (error) {
                                console.log(error);

                                Notiflix.Notify.failure(error.message);
                        }
                })

                .catch(() => {
                        Notiflix.Notify.failure("Oops, something was going wrong");
                });
}
