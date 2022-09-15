const btn = document.getElementById("up-button");

// Enable hover only on PC
if ("ontouchstart" in window) {
        btn.style.setProperty('--hoverBgColor', '#ff9800')
}

window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 300) {
                btn.classList.add("show");
        } else {
                btn.classList.remove("show");
        }
});

btn.addEventListener("click", (e) => {
        e.preventDefault();

        window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
        });
});
