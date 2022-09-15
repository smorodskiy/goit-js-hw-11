import { fetchPictures } from "./services/fetch.js";
import { debounce } from "lodash";
import Notiflix from "notiflix";
import { initRender } from "./gallery";

export const DEBOUNCE_DELAY = 300;

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

        // On take Focus off
        searchElem.addEventListener("blur", () => {
                searchBoxElem.classList.remove("search__box--searching");
                searchIconElem.classList.remove("search__find-icon--rotate");
        });

        // On Enter click
        searchElem.addEventListener("keydown", (e) => {
                if (e.keyCode === 13) {
                        e.preventDefault();
                        getPicturesByName_deb(searchElem.value, 1);
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
                getPicturesByName_deb(searchElem.value, 1);
        });

        getPicturesByName_deb(searchElem.value, 1);
});

// Post http req and trying to get pictures
async function getPicturesByName(name, currentPage = 1) {
        try {
                // Send http req, trying get the pictures
                const response = await fetchPictures(name, currentPage);

                // console.log(response);

                if (response.status != 200) {
                        Notiflix.Notify.failure(response.status);
                        throw new Error(response.status);
                }

                if (response.data == undefined) {
                        Notiflix.Notify.failure("Incorrect data");
                        throw new Error("Incorrect data");
                }

                // Get JSON of pictures
                const foundedPics = response.data;

                // console.log(foundedPics);

                // Initialization rendering gallery
                initRender(foundedPics, name, currentPage);
        } catch (error) {
                console.log(error);
                Notiflix.Notify.failure(error.message);
        }
}

export const getPicturesByName_deb = debounce((name, currentPage)=>{
        getPicturesByName(name, currentPage);
}, DEBOUNCE_DELAY);