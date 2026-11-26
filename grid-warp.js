(() => {
    const radius = 165;
    const strength = 0.65;
    const followDelay = 160;
    const fadeTime = 150;
    const displacementScale = 100;

    const map = document.getElementById("grid-warp-map");
    const displacement = document.getElementById("grid-warp-displacement");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = radius * 2;
    const context = canvas.getContext("2d");
    if (!map || !displacement || !context) return;

    const image = context.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const dx = x + 0.5 - radius;
            const dy = y + 0.5 - radius;
            const distanceSquared = (dx * dx + dy * dy) / (radius * radius);
            const fade = Math.max(0, 1 - distanceSquared) ** 2;
            const index = (y * canvas.width + x) * 4;
            image.data[index] = 127.5 - dx * strength * fade / displacementScale * 255;
            image.data[index + 1] = 127.5 - dy * strength * fade / displacementScale * 255;
            image.data[index + 2] = 0;
            image.data[index + 3] = 255;
        }
    }
    context.putImageData(image, 0, 0);
    map.setAttribute("width", canvas.width);
    map.setAttribute("height", canvas.height);
    map.setAttribute("href", canvas.toDataURL("image/png"));
    displacement.setAttribute("scale", 0);

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let warpX = 0;
    let warpY = 0;
    let amount = 0;
    let targetAmount = 0;
    let lastTime = 0;
    let hasPosition = false;

    function clearWarp() {
        cancelAnimationFrame(frame);
        frame = 0;
        amount = 0;
        targetAmount = 0;
        lastTime = 0;
        hasPosition = false;
        displacement.setAttribute("scale", 0);
        document.body.classList.remove("grid-warp-active");
    }

    function animate(time) {
        frame = 0;
        const elapsed = lastTime ? Math.min(time - lastTime, 64) : 1000 / 60;
        lastTime = time;

        const followEase = 1 - Math.exp(-elapsed / followDelay);
        warpX += (pointerX - warpX) * followEase;
        warpY += (pointerY - warpY) * followEase;
        const fadeEase = 1 - Math.exp(-elapsed / fadeTime);
        amount += (targetAmount - amount) * fadeEase;

        const positionSettled = Math.hypot(pointerX - warpX, pointerY - warpY) < 0.1;
        if (positionSettled) {
            warpX = pointerX;
            warpY = pointerY;
        }
        if (Math.abs(targetAmount - amount) < 0.005) amount = targetAmount;

        map.setAttribute("x", warpX - radius);
        map.setAttribute("y", warpY - radius);
        displacement.setAttribute("scale", displacementScale * amount);

        if (targetAmount === 0 && amount === 0) {
            clearWarp();
        } else if (!positionSettled || amount !== targetAmount) {
            frame = requestAnimationFrame(animate);
        } else {
            lastTime = 0;
        }
    }

    document.addEventListener("pointermove", (event) => {
        if (reducedMotion.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!hasPosition) {
            warpX = pointerX;
            warpY = pointerY;
            hasPosition = true;
        }
        targetAmount = 1;
        document.body.classList.add("grid-warp-active");
        if (!frame) frame = requestAnimationFrame(animate);
    });

    document.addEventListener("pointerleave", () => {
        targetAmount = 0;
        if (hasPosition && !frame) frame = requestAnimationFrame(animate);
    });
    reducedMotion.addEventListener("change", (event) => {
        if (event.matches) clearWarp();
    });
})();
