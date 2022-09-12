import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { download } from "./download";

// Create instanse of SimpleBox
export const lightbox = new SimpleLightbox(".gallery .gallery__link", {
    captions: true,
    captionType: "attr",
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
    heightRatio: 0.8,
});

export function lightboxUpdateDownloadButton() {
        lightbox.on("shown.simplelightbox", function (e) {
                const simplelightbox = document.querySelector(".sl-wrapper");
                const btnDownload = document.querySelector(".sl-wrapper .download");
                const href = e.target.getAttribute("href");

                if (!btnDownload) {
                        const btnDownload = document.createElement("div");
                        btnDownload.classList.add("download");
                        btnDownload.textContent = "Download";

                        btnDownload.onclick = () => download(href);

                        simplelightbox.appendChild(btnDownload);
                        return;
                }

                btnDownload.onclick = () => download(href);
        });

        lightbox.on("changed.simplelightbox", function (e) {
                const img = document.querySelector(".sl-wrapper img");
                const href = img.getAttribute("src");

                const btnDownload = document.querySelector(".sl-wrapper .download");

                btnDownload.onclick = () => download(href);
        });
}
