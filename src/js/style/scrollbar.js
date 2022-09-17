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
export function customScrollbar() {
        var body,
                scrollbar, // Runner
                clientHeightWithoutScroll, // Runner height
                scrollTop, // Start scroll top,
                screenY = 0;

        body = document.querySelector(".custom-scrollbar");

        // Check if scrollbar already present in DOM
        // Scroll reference
        if (!document.querySelector("figure")) {
                scrollbar = document.createElement("figure");
                body.insertAdjacentElement("afterbegin", scrollbar);

                // Add style
                scrollbar.className = "outliner";
        } else {
                scrollbar = document.querySelector("figure");
        }

        // First init size
        setScrollSize();

        // Listen for scroll
        eventListner(document, "scroll", handlerScroll);

        // Resize scrollbar on resizing window
        eventListner(window, "resize", setScrollSize);

        // Listen for drug
        eventListner(scrollbar, "mousedown", handlerDown);
        eventListner(scrollbar, "mouseup", handlerUp);

        // Lister for drug on wrapper(up/down of the scrollbar)
        eventListner(body, "mousedown", handlerWrapDown);

        // On mouse up click
        function handlerUp(e) {
                // drag = !!0;

                // Enable selection
                enableSelection(body);

                // Enable transition
                scrollbar.classList.remove("notransition"); // Re-enable transitions

                // Set style
                // setDefaultStyle();

                // remove listen for window move
                removeEventListner(window, "mousemove", handlerMove);

                // Stop events(bubbling)
                e.stopPropagation();
        }

        // On mouse down click
        function handlerDown(e) {
                // drag = !0;

                // Vertical position
                screenY = e.screenY;

                // Height of visible document minus height of scrollbar
                clientHeightWithoutScroll =
                        document.documentElement.clientHeight -
                        parseInt(window.getComputedStyle(scrollbar).height);

                // Current position scrollbar
                scrollTop = document.documentElement.scrollTop;

                // Disable selection
                disableSelection(body);

                // Disable transition, slowly moving
                scrollbar.classList.add("notransition");

                // Listen for window move
                eventListner(window, "mousemove", handlerMove);
                eventListner(window, "mouseup", handlerUp, true);

                e.preventDefault();
                return false;
        }

        // On mouse move
        function handlerMove(e) {
                // Calc position of scroll
                // Height of visible document without scrollbar *
                // (Last Y position of scrollbar / (height all of document - visible part document)) +
                //
                var curScrollPosition =
                        clientHeightWithoutScroll *
                                (scrollTop /
                                        (body.scrollHeight -
                                                document.documentElement.clientHeight)) +
                        (e.screenY - screenY);

                // Checking scroll position don't moving out of clientheight
                if (curScrollPosition > clientHeightWithoutScroll)
                        curScrollPosition = clientHeightWithoutScroll;
                else if (curScrollPosition < 0) curScrollPosition = 0;

                // Calc new scroll position
                const calcNewScrollPosition = Math.round(
                        (body.scrollHeight - document.documentElement.clientHeight) *
                                (curScrollPosition / clientHeightWithoutScroll),
                );

                // Set scrollbar new position
                window.scrollTo(0, calcNewScrollPosition);
        }

        // Mouse click on wrapper scrollbar
        function handlerWrapDown(e) {
                // Click at area scroll(15px from right side)
                if (e.offsetX > body.offsetWidth - 15) {
                        const calcNewScrollPosition = (document.documentElement.scrollTop =
                                Math.round(
                                        (body.scrollHeight -
                                                document.documentElement.clientHeight) *
                                                (e.offsetY / body.offsetHeight),
                                ));

                        // Set scrollbar new position
                        window.scrollTo(0, calcNewScrollPosition);

                        // Call mouse down click for document moving
                        handlerDown(e);
                }
        }

        // On mouse scroll
        function handlerScroll() {
                // Set postition scrollbar on mouse scrolling
                scrollbar.style.top =
                        (100 - parseFloat(scrollbar.style.height)) *
                                (document.documentElement.scrollTop /
                                        (body.scrollHeight -
                                                document.documentElement.clientHeight)) +
                        "%";
        }

        // Set size of scrollbar
        function setScrollSize() {
                // Calc relation all of doc to visible part
                const relation = document.documentElement.clientHeight / body.scrollHeight;

                // Set size scrollbar like relation (all of doc to visible part)
                let calcScrollSize =
                        100 *
                        (
                                (document.documentElement.clientHeight * +relation) /
                                body.scrollHeight
                        ).toFixed(5);

                // Set scroll size and if size very small set static
                scrollbar.style.height =
                        calcScrollSize < 0.003 ? (calcScrollSize = 0.003) : calcScrollSize + "%";
        }
}
