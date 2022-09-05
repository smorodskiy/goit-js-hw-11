import { debounce } from "lodash";

const URL = "https://pixabay.com/api/";
const API_KEY = "29730166-90781f613c54edfa0d110c161";
const fields = "name,capital,population,flags,languages";
const DEBOUNCE_DELAY = 300;

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
export const fetchPictures = (name) => {
        const fetched = () => {
                return fetch(`${URL}?key=${API_KEY}`, {
                        headers: {
                                Accept: "application/json",
                        },
                });
        };

        const debouncedFetch = asyncDebounce(fetched, DEBOUNCE_DELAY);

        return debouncedFetch();
};

// Async debounce
function asyncDebounce(func, wait) {
        const debounced = debounce((resolve, reject, args) => {
                func(...args)
                        .then(resolve)
                        .catch(reject);
        }, wait);

        return (...args) =>
                new Promise((resolve, reject) => {
                        debounced(resolve, reject, args);
                });
}
