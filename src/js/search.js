import { fetchPictures } from "./fetch.js";
import Notiflix from "notiflix";
import { renderPicsToGrid } from "./gallery";

document.addEventListener("DOMContentLoaded", function () {
        // Refs to DOM elements
        const searchElem = document.querySelector("#search");
        const searchBoxElem = document.querySelector(".search-box");
        const searchIconElem = document.querySelector(".search-icon");
        const goBtnElem = document.querySelector(".go-btn");

        // On Focus
        searchElem.addEventListener("focus", () => {
                searchBoxElem.classList.add("border-searching");
                searchIconElem.classList.add("si-rotate");
        });

        // On take focus off
        searchElem.addEventListener("blur", () => {
                searchBoxElem.classList.remove("border-searching");
                searchIconElem.classList.remove("si-rotate");
        });

        // On typing
        searchElem.addEventListener("keyup", (e) => {
                if (e.target.value.length > 0) {
                        goBtnElem.classList.add("go-in");
                } else {
                        goBtnElem.classList.remove("go-in");
                }
        });

        // On button click
        goBtnElem.addEventListener("click", () => {
                getPicByName(searchElem.value);
        });
});

// Post http req and get names
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
                                renderPicsToGrid(foundedPics);
                        } catch (error) {
                                console.log(error);

                                Notiflix.Notify.failure(error.message);
                        }
                })

                .catch(() => {
                        Notiflix.Notify.failure("Oops, there is no country with that name");
                });
}
