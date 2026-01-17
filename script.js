const mainImage = document.getElementById('main-image');
const uploadInput = document.getElementById('upload');
const vignette = document.getElementById('vignette');

const controls = ['brightness', 'contrast', 'saturation', 'hue', 'blur', 'vignetteRange'];
const elements = {};
controls.forEach(id => elements[id] = document.getElementById(id));

let savedEdit = null;

uploadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            mainImage.src = event.target.result;
            mainImage.style.display = 'block';
            applyFilters();
        };
        reader.readAsDataURL(file);
    }
};

function applyFilters() {
    if(!mainImage.src || mainImage.src === "") return;
    const { brightness, contrast, saturation, hue, blur, vignetteRange } = elements;
    const filterStr = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hue.value}deg) blur(${blur.value}px)`;
    mainImage.style.filter = filterStr;
    mainImage.style.WebkitFilter = filterStr;
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.8)`;
}

Object.values(elements).forEach(el => el.oninput = applyFilters);

document.getElementById('copySettings').onclick = () => {
    if(!mainImage.src) return alert("Upload photo first!");
    savedEdit = {};
    controls.forEach(id => savedEdit[id] = elements[id].value);
    alert("Settings Copied!");
};

document.getElementById('pasteSettings').onclick = () => {
    if (!savedEdit) return alert("Copy settings first!");
    controls.forEach(id => elements[id].value = savedEdit[id]);
    applyFilters();
};

document.getElementById('downloadBtn').onclick = () => {
    if(!mainImage.src) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;
    ctx.filter = getComputedStyle(mainImage).filter;
    ctx.drawImage(mainImage, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = 'edited_photo.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
};
