const mainImage = document.getElementById('main-image');
const uploadInput = document.getElementById('upload');
const vignette = document.getElementById('vignette');

const controls = ['brightness', 'contrast', 'saturation', 'hue', 'blur', 'vignetteRange'];
const elements = {};
controls.forEach(id => elements[id] = document.getElementById(id));

let savedEdit = null;

// ইমেজ আপলোড লজিক
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

// ফিল্টার অ্যাপ্লাই করার ফাংশন
function applyFilters() {
    if(!mainImage.src || mainImage.src === "") return;
    
    const { brightness, contrast, saturation, hue, blur, vignetteRange } = elements;
    
    const filterValue = `
        brightness(${brightness.value}%) 
        contrast(${contrast.value}%) 
        saturate(${saturation.value}%) 
        hue-rotate(${hue.value}deg) 
        blur(${blur.value}px)
    `;
    
    mainImage.style.filter = filterValue;
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.8)`;
}

// স্লাইডার মুভ করলে ফিল্টার আপডেট হবে
Object.values(elements).forEach(el => el.oninput = applyFilters);

// COPY EDITS: বর্তমান সেটিংস সেভ করা
document.getElementById('copySettings').onclick = () => {
    if(!mainImage.src) return alert("Please upload a photo first!");
    savedEdit = {};
    controls.forEach(id => savedEdit[id] = elements[id].value);
    alert("✨ Aesthetic edits copied! Now upload a new photo.");
};

// PASTE EDITS: সেভ করা সেটিংস নতুন ছবিতে বসানো
document.getElementById('pasteSettings').onclick = () => {
    if (!savedEdit) return alert("Nothing to paste! Copy edits from a photo first.");
    controls.forEach(id => elements[id].value = savedEdit[id]);
    applyFilters();
};

// ডাউনলোড লজিক
document.getElementById('downloadBtn').onclick = () => {
    if(!mainImage.src) return alert("No image to export!");
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;
    ctx.filter = getComputedStyle(mainImage).filter;
    ctx.drawImage(mainImage, 0, 0);
    const link = document.createElement('a');
    link.download = 'aesthetic_export.png';
    link.href = canvas.toDataURL();
    link.click();
};
