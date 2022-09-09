import axios from "axios";

const URL = "https://pixabay.com/api/";
const API_KEY = "29730166-90781f613c54edfa0d110c161";
export const PER_PAGE = 40;

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.

// Fetch pictures by name
export const fetchPictures = async (name, page) => {
        const param = new URLSearchParams({
                key: API_KEY,
                q: name,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page,
                per_page: PER_PAGE,
        });

        return axios.get(`${URL}?${param.toString()}`);
}