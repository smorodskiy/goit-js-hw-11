// Remove event listener polyfill
function removeEventListner(el, type, handler) {
        if (el.addEventListener) {
                const re = el.removeEventListener(type, handler, false);
        } else if (elem.attachEvent) {
                el.detachEvent("on" + type, handler);
        } else {
                el["on" + type] = null;
        }
}

// Event listener polyfill
function eventListner(el, type, handler, once) {
        var realhandler = once
                ? function () {
                          removeEventListner(el, type, realhandler);
                  }
                : handler;
        if (el.addEventListener) {
                el.addEventListener(type, handler, false);
        } else if (el.attachEvent) {
                el.addEventListener("on" + type, handler, false);
        } else {
                el["on" + type] = handler;
        }
        return el;
}

function retfalse() {
        return !!0;
}

// For selection text
var nu = navigator.userAgent;
var aus = ["Mozilla", "IE"];

// Disable selection text
function disableSelection(el) {
        if (nu.indexOf(aus[0]) != -1)
                // FF
                el.style["MozUserSelect"] = "none";
        else if (nu.indexOf(aus[1]) != -1)
                // IE
                eventListner(el, "selectstart.disableTextSelect", retfalse);
        else eventListner(el, "mousedown.disableTextSelect", retfalse);
}

// Enable selection text
function enableSelection(el) {
        if (nu.indexOf(aus[0]) != -1)
                // FF
                el.style["MozUserSelect"] = "";
        else if (nu.indexOf(aus[1]) != -1)
                // IE
                removeEventListner(el, "selectstart.disableTextSelect", retfalse);
        else removeEventListner(el, "mousedown.disableTextSelect", retfalse);
}

// Custom scrollbar
export const customScrollbar = {
        scrollbar: null, // Runner
        clientHeightWithoutScroll: 0, // Runner height
        scrollTop: 0, // Start scroll top,
        screenY: 0,
        body: null,

        init() {
                this.body = document.querySelector(".custom-scrollbar");

                // Check if scrollbar already present in DOM
                // Scroll reference
                if (!document.querySelector("figure")) {
                        this.scrollbar = document.createElement("figure");
                        this.body.insertAdjacentElement("afterbegin", this.scrollbar);

                        // Add style
                        this.scrollbar.className = "outliner";
                } else {
                        this.scrollbar = document.querySelector("figure");
                }

                // First init size
                this.setScrollSize();

                // Listen for scroll
                eventListner(document, "scroll", (e) => this.handlerScroll(e));

                // Resize scrollbar on resizing window
                eventListner(window, "resize", (e) => this.setScrollSize(e));

                // Listen for drug
                eventListner(this.scrollbar, "mousedown", (e) => this.handlerDown(e));
                eventListner(this.scrollbar, "mouseup", (e) => this.handlerUp(e));

                // Lister for drug on wrapper(up/down of the scrollbar)
                eventListner(this.body, "mousedown", (e) => this.handlerWrapDown(e));
        },

        // Set size of scrollbar
        setScrollSize() {
                // Calc relation all of doc to visible part
                const relation = document.documentElement.clientHeight / this.body.scrollHeight;

                // Set size scrollbar like relation (all of doc to visible part)
                let calcScrollSize =
                        100 *
                        (
                                (document.documentElement.clientHeight * +relation) /
                                this.body.scrollHeight
                        ).toFixed(5);

                // Set scroll size and if size very small set static
                this.scrollbar.style.height =
                        calcScrollSize < 0.003 ? (calcScrollSize = 0.003) : calcScrollSize + "%";
        },
        // On mouse up click
        handlerUp(e) {
                // drag = !!0;

                // Enable selection
                enableSelection(this.body);

                // Enable transition
                this.scrollbar.classList.remove("notransition"); // Re-enable transitions
                
                // remove listen for window move
                removeEventListner(window, "mousemove", this.handlerMove);

                // Stop events(bubbling)
                e.stopPropagation();
        },

        // On mouse down click
        handlerDown(e) {
                // drag = !0;

                // Vertical position
                this.screenY = e.screenY;

                // Height of visible document minus height of scrollbar
                this.clientHeightWithoutScroll =
                        document.documentElement.clientHeight -
                        parseInt(window.getComputedStyle(this.scrollbar).height);

                // Current position scrollbar
                this.scrollTop = document.documentElement.scrollTop;

                // Disable selection
                disableSelection(this.body);

                // Disable transition, slowly moving
                this.scrollbar.classList.add("notransition");

                // Listen for window move
                eventListner(window, "mousemove", this.handlerMove);
                eventListner(window, "mouseup", (e) => this.handlerUp(e), true);

                e.preventDefault();
                return false;
        },

        // On mouse move
        handlerMove(e) {
                // Calc position of scroll
                // Height of visible document without scrollbar *
                // (Last Y position of scrollbar / (height all of document - visible part document)) +
                //
                var curScrollPosition =
                        customScrollbar.clientHeightWithoutScroll *
                                (customScrollbar.scrollTop /
                                        (customScrollbar.body.scrollHeight -
                                                document.documentElement.clientHeight)) +
                        (e.screenY - customScrollbar.screenY);

                // Checking scroll position don't moving out of clientheight
                if (curScrollPosition > customScrollbar.clientHeightWithoutScroll)
                        curScrollPosition = customScrollbar.clientHeightWithoutScroll;
                else if (curScrollPosition < 0) curScrollPosition = 0;

                // Calc new scroll position
                const calcNewScrollPosition = Math.round(
                        (customScrollbar.body.scrollHeight - document.documentElement.clientHeight) *
                                (curScrollPosition / customScrollbar.clientHeightWithoutScroll),
                );

                // Set scrollbar new position
                window.scrollTo(0, calcNewScrollPosition);
        },

        // Mouse click on wrapper scrollbar
        handlerWrapDown(e) {
                // Click at area scroll(15px from right side)
                if (e.offsetX > this.body.offsetWidth - 15) {
                        const calcNewScrollPosition = (document.documentElement.scrollTop =
                                Math.round(
                                        (this.body.scrollHeight -
                                                document.documentElement.clientHeight) *
                                                (e.offsetY / this.body.offsetHeight),
                                ));

                        // Set scrollbar new position
                        window.scrollTo(0, calcNewScrollPosition);

                        // Call mouse down click for document moving
                        this.handlerDown(e);
                }
        },

        // On mouse scroll
        handlerScroll() {
                // Set postition scrollbar on mouse scrolling
                this.scrollbar.style.top =
                        (100 - parseFloat(this.scrollbar.style.height)) *
                                (document.documentElement.scrollTop /
                                        (this.body.scrollHeight -
                                                document.documentElement.clientHeight)) +
                        "%";
        },
};
