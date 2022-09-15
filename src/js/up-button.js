const btn = document.getElementById("up-button");

window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 300) {
                btn.classList.add("show");
        } else {
                btn.classList.remove("show");
        }
});

"click mousedown touchdown".split(" ").forEach(function (e) {
    btn.addEventListener(e, (btnEvent) => {
        btnEvent.preventDefault();

        window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
        });

        document.body.click();

        // btn.blur(); 

    }, false);
});



// btn.addEventListener("click", (e) => {

//         // window.scrollBy({
//         //     top: 0,
//         //     behavior: 'smooth'
//         //   });
// });
