// Icons
import icons from "../../images/icons.svg";

import { heartElement } from "./like";

// Create box of image
export function createGalleryCard(
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
    
    <div class="gallery__card new">
            
            <a class="gallery__link" href="${largeImageURL}">
                    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
           
            <ul class="gallery__info">
                    <li class="gallery__item">
                            <b>Likes</b>
                            <div class="gallery__icon-wrapper" data="likes">
                                    ${heartElement()}

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
