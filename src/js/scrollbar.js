// Perform custom scrollbar
export const customScrollbar = (function () {
        var nu = navigator.userAgent,
                aus = ["Mozilla", "IE"],
                // Remove event listner polyfill
                removeEventListner = function (el, type, handler) {
                        if (el.addEventListener) {
                                el.removeEventListener(type, handler, false);
                        } else if (elem.attachEvent) {
                                el.detachEvent("on" + type, handler);
                        } else {
                                el["on" + type] = null;
                        }
                },
                // Event listner polyfill
                eventListner = function (el, type, handler, once) {
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
                },
                retfalse = function () {
                        return !!0;
                },
                disableSelection = function (el) {
                        if (nu.indexOf(aus[0]) != -1)
                                // FF
                                el.style["MozUserSelect"] = "none";
                        else if (nu.indexOf(aus[1]) != -1)
                                // IE
                                eventListner(el, "selectstart.disableTextSelect", retfalse);
                        else eventListner(el, "mousedown.disableTextSelect", retfalse);
                },
                enableSelection = function (el) {
                        if (nu.indexOf(aus[0]) != -1)
                                // FF
                                el.style["MozUserSelect"] = "";
                        else if (nu.indexOf(aus[1]) != -1)
                                // IE
                                removeEventListner(el, "selectstart.disableTextSelect", retfalse);
                        else removeEventListner(el, "mousedown.disableTextSelect", retfalse);
                };

        return function (a) {
                var body,
                        scrollbar, // Runner
                        height, // Runner height
                        scrollTop, // Start scroll top,
                        // Scroll handler
                        handlerScroll = function (e) {
                                scrollbar.style.top =
                                        (100 - parseFloat(scrollbar.style.height)) *
                                                (document.documentElement.scrollTop /
                                                        (body.scrollHeight -
                                                                document.documentElement
                                                                        .clientHeight)) +
                                        "%";
                        },
                        drag = !!0,
                        screenY = 0,
                        handlerMove = function (e) {
                                var d =
                                        height *
                                                (scrollTop /
                                                        (body.scrollHeight -
                                                                document.documentElement
                                                                        .clientHeight)) +
                                        (e.screenY - screenY);

                                if (d > height) d = height;
                                else if (d < 0) d = 0;

                                // set Scroll top
                                const calc = Math.round(
                                        (body.scrollHeight -
                                                document.documentElement.clientHeight) *
                                                (d / height),
                                );

                                window.scrollTo(0, calc);
                        },
                        handlerUp = function (e) {
                                drag = !!0;

                                // Enable selection
                                enableSelection(body);

                                // Enable transition
                                scrollbar.classList.remove("notransition"); // Re-enable transitions
                                // setDefaultStyle();
                                // remove listen for window move
                                removeEventListner(window, "mousemove", handlerMove);
                                e.stopPropagation();
                        },
                        handlerDown = function (e) {
                                drag = !0;
                                screenY = e.screenY;
                                height =
                                        document.documentElement.clientHeight -
                                        parseInt(window.getComputedStyle(scrollbar).height);
                                scrollTop = document.documentElement.scrollTop;

                                // Disable selection
                                disableSelection(body);

                                // Disable transition
                                scrollbar.classList.add("notransition"); // Disable transitions
                                // setHoverStyle();

                                // console.log(getComputedStyle(scrollbar));

                                // Listen for window move
                                eventListner(window, "mousemove", handlerMove);
                                eventListner(window, "mouseup", handlerUp, true);
                                e.preventDefault();
                                return false;
                        },
                        handlerWrapDown = function (e) {
                                if (e.offsetX > body.offsetWidth - 20) {
                                        const calc = (document.documentElement.scrollTop =
                                                Math.round(
                                                        (body.scrollHeight -
                                                                document.documentElement
                                                                        .clientHeight) *
                                                                (e.offsetY / body.offsetHeight),
                                                ));
                                        window.scrollTo(0, calc);
                                        handlerDown(e);
                                }
                        },
                        setScrollSize = function () {
                                // Set size of runner
                                const scrollContentToBody =
                                        document.documentElement.clientHeight / body.scrollHeight;

                                const calc =
                                        100 *
                                        (
                                                (document.documentElement.clientHeight *
                                                        +scrollContentToBody) /
                                                body.scrollHeight
                                        ).toFixed(5);

                                scrollbar.style.height = calc < 0.003 ? (calc = 0.003) : calc + "%";
                        },
                        // setDefaultStyle = function () {
                        //         scrollbar.style.cssText = `
                        //                 border: 1px solid;
                        //                 box-shadow: inset 0 0 20px #ff7608, 0 0 15px #ff7608;
                        //                 outline-color: rgba(255, 255, 255, 0);
                        //                 outline-offset: 15px;
                        //         `;
                        // },
                        // setHoverStyle = function () {
                        //         scrollbar.style.cssText = `
                        //                 border: 0 solid;
                        //                 box-shadow: inset 0 0 20px #de415f;
                        //                 outline: 1px solid;
                        //                 outline-color: #de415f;
                        //                 outline-offset: 0px;
                        //                 height: 270px;
                        //                 transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
                        // `;
                        // },
                        body = document.querySelector(".custom-scrollbar");

                if (!document.querySelector("figure")) {
                        scrollbar = document.createElement("figure");
                        body.insertAdjacentElement("afterbegin", scrollbar);

                        // Style1
                        // scrollbar.className = "animated-button1";
                        // span = d.createElement("span");
                        // scrollbar.appendChild(span);
                        // span = d.createElement("span");
                        // scrollbar.appendChild(span);
                        // span = d.createElement("span");
                        // scrollbar.appendChild(span);
                        // span = d.createElement("span");
                        // scrollbar.appendChild(span);

                        // Style2
                        scrollbar.className = "outliner";
                } else {
                        scrollbar = document.querySelector("figure");
                }

                setScrollSize();

                // Listen for scroll
                document.addEventListener("scroll", handlerScroll);
                // eventListner(body, "scroll", handlerScroll);

                window.addEventListener("resize", setScrollSize);

                // Listen for drug
                eventListner(scrollbar, "mousedown", handlerDown);
                eventListner(scrollbar, "mouseup", handlerUp);

                // Listerb for drug on wrapper
                eventListner(body, "mousedown", handlerWrapDown);
        };
})();
