import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { download } from "./services/download";

// Create instanse of SimpleBox
export const lightbox = new SimpleLightbox(".gallery .gallery__link", {
        captions: true,
        captionType: "attr",
        captionsData: "alt",
        captionPosition: "bottom",
        captionDelay: 250,
        heightRatio: 0.8,
});

// Update href for Download button on shown and changed events
export function addDownloadButtonToLightbox() {
        // this event fires after the lightbox was opened
        lightbox.on("shown.simplelightbox", function (e) {
                const simplelightbox = document.querySelector(".sl-wrapper");
                const btnDownload = simplelightbox.querySelector(".sl-wrapper .download");
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

        // this event fires after image was changed
        lightbox.on("changed.simplelightbox", function (e) {
                const img = document.querySelector(".sl-wrapper img");

                const href = img.getAttribute("src");

                const btnDownload = document.querySelector(".sl-wrapper .download");

                btnDownload.onclick = () => download(href);
        });

        // this event fires before the lightbox closes
        lightbox.on("close.simplelightbox", function (e) {
                const btnDownload = document.querySelector(".sl-wrapper .download");
                btnDownload.style.setProperty('opacity', '0');
        });

        // this event fires after the lightbox was closed
        lightbox.on("closed.simplelightbox", function (e) {
                const btnDownload = lightbox.domNodes.wrapper.querySelector(".download");
                btnDownload.style.setProperty('opacity', '1');
        });
}
