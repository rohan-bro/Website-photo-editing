const mainImage = document.getElementById('main-image');
const uploadInput = document.getElementById('upload');
const vignette = document.getElementById('vignette');

const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hue = document.getElementById('hue');
const blur = document.getElementById('blur');
const vignetteRange = document.getElementById('vignetteRange');

let savedStyles = null;

uploadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            mainImage.src = event.target.result;
            mainImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
};

function applyFilters() {
    mainImage.style.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hue.value}deg) blur(${blur.value}px)`;
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.9)`;
}

[brightness, contrast, saturation, hue, blur, vignetteRange].forEach(item => {
    item.oninput = applyFilters;
});

// COPY LOGIC: Eta diye onner preset chobir style copy koro
document.getElementById('copySettings').onclick = () => {
    if (!mainImage.src) return alert("Upload a photo first!");
    savedStyles = {
        b: brightness.value, c: contrast.value, s: saturation.value, h: hue.value, bl: blur.value, v: vignetteRange.value
    };
    alert("Style Copied! Now upload your photo and click 'Apply To New'.");
};

// PASTE LOGIC: Eta diye tomar chobite bosiye dao
document.getElementById('pasteSettings').onclick = () => {
    if (!savedStyles) return alert("Copy a style first!");
    brightness.value = savedStyles.b;
    contrast.value = savedStyles.c;
    saturation.value = savedStyles.s;
    hue.value = savedStyles.h;
    blur.value = savedStyles.bl;
    vignetteRange.value = savedStyles.v;
    applyFilters();
};

document.getElementById('downloadBtn').onclick = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;
    ctx.filter = getComputedStyle(mainImage).filter;
    ctx.drawImage(mainImage, 0, 0);
    const link = document.createElement('a');
    link.download = 'edited.png';
    link.href = canvas.toDataURL();
    link.click();
};
