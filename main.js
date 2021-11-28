/** @type {[HTMLInputElement, HTMLInputElement]} */
const [rgbInput, hexInput] = [document.querySelector("#rgbInput"), document.querySelector("#hexInput")]
/** @type {HTMLButtonElement} */
const copyBtn = document.querySelector("#copyBtn");

const bgColor = document.body.style.backgroundColor;
const rgbRegex = /^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;
const hexRegex = /(^#)([0-9AaBbCcDdEeFf]{6,6}$)/g;

let validHex = false;

/**
 * 
 * @param {HTMLElement} element
 */
function style(element, invalid = false) {
    element.style.color = invalid ? "#ff0033" : "#05832d";
}

/**
 * 
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @returns {string}
 */
function rgbToHex(r, g, b) {
    const red = r.toString(16),
        green = g.toString(16),
        blue = b.toString(16);
    return "#" + (red.length === 1 ? "0" + red : red) + (green.length === 1 ? "0" + green : green) + (blue.length === 1 ? "0" + blue : blue);
}

/**
 * 
 * @param {string} hex 
 * @returns {{ r: number, b: number, g: number}}
 */
function hexToRgb(hex) {
    hex = hex[0] === "#" ? hex.slice(1) : hex;
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
    }
}


hexInput.addEventListener("input", (e) => {
    const { target: { value } } = e;


    if (value === "")
        return reset(true);

    if (!value.match(hexRegex))
        return style(hexInput, true);

    const rgb = hexToRgb(value);
    rgbInput.value = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    style(hexInput);
    document.body.style.backgroundColor = rgbInput.value;
    validHex = true;

});


rgbInput.addEventListener("input", (e) => {
    let { target: { value } } = e;

    if (value === "")
        return reset(true);


    if (!value.match(rgbRegex))
        return style(rgbInput, true);

    const numbers = value.replace(/rgb|\(|\)/g, "").split(",").map((v) => +v);
    if (numbers.some((v) => v < 0 || v > 255)) {
        style(rgbInput, true);
        return reset();
    }
    else
        style(rgbInput);

    const [r, g, b] = numbers;
    hexInput.value = rgbToHex(r, g, b);
    document.body.style.backgroundColor = hexInput.value;
    validHex = true;

});

function reset(texts = false) {
    document.body.style.backgroundColor = bgColor;
    if (texts) {
        hexInput.value = "";
        rgbInput.value = "";
    }
    validHex = false;
}

copyBtn.addEventListener("click", () => {
    if (validHex) {
        navigator.clipboard.writeText(hexInput.value);
        const oldColor = copyBtn.style.backgroundColor;
        copyBtn.style.backgroundColor = "green";
        setTimeout(() => {
            copyBtn.style.backgroundColor = oldColor;
        }, 1000);
        reset(true);
    }
});