const backToTop = document.querySelector(".portfolio-back-to-top");

function updateBackToTop() {
    const pageCanScroll = document.documentElement.scrollHeight > window.innerHeight;
    backToTop.hidden = !pageCanScroll || window.scrollY < 200;
}

if (backToTop) {
    window.addEventListener("scroll", updateBackToTop);
    window.addEventListener("resize", updateBackToTop);
    updateBackToTop();
}
