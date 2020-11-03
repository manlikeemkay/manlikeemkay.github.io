"use strict";

AOS.init({
    duration: 1250,
    offset: 300,
});

const SCROLL_SPEED = 0.5;
const NOISE_SPEED = 0.005;
const NOISE_AMOUNT = 5;
const bubblesElement = document.querySelector(".bubbles");
const bubbleSpecs = [
    { s: 0.8, x: 1210, y: 365 },
    { s: 0.6, x: 1761, y: 372 },
    { s: 0.6, x: 2419, y: 129 },
    { s: 0.6, x: 2545, y: 387 },
    { s: 0.6, x: 396, y: 256 },
    { s: 0.6, x: 1595, y: 226 },
    { s: 0.8, x: 1303, y: 193 },
    { s: 0.8, x: 1440, y: 342 },
    { s: 0.8, x: 1929, y: 293 },
    { s: 0.8, x: 2235, y: 198 },
    { s: 0.6, x: 633, y: 320 },
    { s: 0.8, x: 857, y: 138 },
    { s: 0.5, x: 1071, y: 233 },
    { s: 0.5, x: 1519, y: 118 },
    { x: 1773, y: 148 },
    { s: 0.5, x: 1990, y: 75 },
    { x: 2098, y: 385 },
    { s: 0.5, x: 2895, y: 271 },
    { x: 624, y: 111 },
    { x: 901, y: 385 },
    // { s: 0.6, x: 1134, y: 45 },
    // { s: 0.6, x: 1620, y: 271 },
    // { s: 0.6, x: 2271, y: 356 },
    // { s: 0.6, x: 2704, y: 334 },
    // { s: 0.6, x: 444, y: 193 },
    // { s: 0.8, x: 129, y: 357 },
    // { s: 0.8, x: 2276, y: 82 },
    // { s: 0.8, x: 2654, y: 182 },
    // { s: 0.8, x: 2783, y: 60 },
    // { s: 0.8, x: 323, y: 60 },
    // { x: 2423, y: 244 },
    // { x: 413, y: 367 },
    // { x: 75, y: 103 },
];

class Bubbles {
    constructor(specs) {
        this.bubbles = [];
        specs.forEach((spec, index) => {
            this.bubbles.push(new Bubble(index, spec));
        });
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        this.bubbles.forEach((bubble) => bubble.update());
        this.raf = requestAnimationFrame(this.update.bind(this));
    }
}

class Bubble {
    constructor(index, { x, y, s = 1 }) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.scale = s;
        this.noiseSeedX = Math.floor(Math.random() * 64000);
        this.noiseSeedY = Math.floor(Math.random() * 64000);
        this.el = document.createElement("div");
        this.el.className = `bubble`;
        bubblesElement.appendChild(this.el);
    }

    update() {
        this.noiseSeedX += NOISE_SPEED;
        this.noiseSeedY += NOISE_SPEED;
        let randomX = noise.simplex2(this.noiseSeedX, 0);
        let randomY = noise.simplex2(this.noiseSeedY, 0);
        this.x -= SCROLL_SPEED;
        this.xWithNoise = this.x + randomX * NOISE_AMOUNT;
        this.yWithNoise = this.y + randomY * NOISE_AMOUNT;

        if (this.x < -200) {
            this.x = window.screen.width;
        }

        this.el.style.transform = `translate(${this.xWithNoise}px, ${this.yWithNoise}px) scale(${this.scale})`;
    }
}

noise.seed(Math.floor(Math.random() * 64000));
const bubbles = new Bubbles(bubbleSpecs);
