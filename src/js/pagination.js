import { debounce } from "lodash";
import { lightbox } from "./lightbox";
import Notiflix from "notiflix";
import { getPicturesByName_deb } from "./search";

export const pagination = {
        loadingHeight: 0,

        // Loading... label
        showAnimation(show) {
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

                        window.scrollTo(0, document.body.scrollHeight);
                } else {
                        const loading = document.querySelector(".loading");

                        // Get loading div's size
                        this.loadingHeight = getAbsoluteHeight(document.querySelector(".loading"));

                        loading.remove();
                }
        },

        // Scroll pagination debounced func
        scrollPagination_deb: (name, currentPage, numPages) =>
                debounce(() => scrollEventPagination(name, currentPage, numPages), 100),

        // Smooth scrolling for pagination
        scrollToNewCards() {
                const container = document.querySelector(".container");

                const paddingBottom = window
                        .getComputedStyle(container, null)
                        .getPropertyValue("padding-bottom");

                window.scrollBy({
                        top:
                                document.documentElement.clientHeight -
                                this.loadingHeight -
                                parseInt(paddingBottom),
                        behavior: "smooth",
                });
        },
};

// Get absolute height of element
function getAbsoluteHeight(el) {
        // Get the DOM Node if you pass in a string
        el = typeof el === "string" ? document.querySelector(el) : el;

        const styles = window.getComputedStyle(el);
        const margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

        return Math.ceil(el.offsetHeight + margin);
}

// Check end of page and do pagination
function scrollEventPagination(name, currentPage, numPages) {
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
                pagination.showAnimation(true);

                // Little wait for loading label
                setTimeout(() => {
                        // Send request for next pages pictures
                        getPicturesByName_deb(name, currentPage);
                }, 1000);
        }
}
