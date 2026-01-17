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
    if(!mainImage.src) return;
    const { brightness, contrast, saturation, hue, blur, vignetteRange } = elements;
    
    mainImage.style.filter = `
        brightness(${brightness.value}%) 
        contrast(${contrast.value}%) 
        saturate(${saturation.value}%) 
        hue-rotate(${hue.value}deg) 
        blur(${blur.value}px)
    `;
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.8)`;
}

Object.values(elements).forEach(el => el.oninput = applyFilters);

document.getElementById('copySettings').onclick = () => {
    savedEdit = {};
    controls.forEach(id => savedEdit[id] = elements[id].value);
    alert("✨ Aesthetic settings copied!");
};

document.getElementById('pasteSettings').onclick = () => {
    if (!savedEdit) return alert("Copy some settings first!");
    controls.forEach(id => elements[id].value = savedEdit[id]);
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
    link.download = 'aesthetic_edit.png';
    link.href = canvas.toDataURL();
    link.click();
};
