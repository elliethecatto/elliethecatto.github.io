const menuButton = document.querySelector(".menu-toggle");
const menu = document.getElementById("main-navigation");
const menuHeader = document.querySelector("header");

function closeMenu() {
    menu.classList.remove("is-open");
    document.documentElement.classList.remove("mobile-menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
}

if (menuButton && menu && menuHeader) {
    menuButton.hidden = false;
    menuHeader.classList.add("menu-ready");

    menuButton.addEventListener("click", function () {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menu.classList.toggle("is-open", !isOpen);
        document.documentElement.classList.toggle("mobile-menu-open", !isOpen);
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
            closeMenu();
            menuButton.focus();
        }
    });

    document.addEventListener("click", function (event) {
        if (!menuHeader.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 760) closeMenu();
    });
}
