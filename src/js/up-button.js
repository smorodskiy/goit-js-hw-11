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

    console.log('click');


    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

    // window.scrollBy({ 
    //     top: 0,
    //     behavior: 'smooth' 
    //   });

})