const btn = document.getElementById("up-button");

window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 300) {
                btn.classList.add("show");
        } else {
                btn.classList.remove("show");
        }
});

btn.addEventListener('click', (e)=> {
    e.preventDefault();

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

    btn.blur();
    // window.scrollBy({ 
    //     top: 0,
    //     behavior: 'smooth' 
    //   });

})