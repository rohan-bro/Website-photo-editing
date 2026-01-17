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
            
            // ছবি আসার পর অটো-স্ক্যান করার অপশন
            setTimeout(() => {
                if(confirm("Do you want to extract Preset from this photo?")) {
                    analyzeImageSettings(mainImage);
                }
            }, 500);
        };
        reader.readAsDataURL(file);
    }
};

// এই ফাংশনটি ছবির পিক্সেল স্ক্যান করে এডিট কপি করবে
function analyzeImageSettings(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100; // স্পিড বাড়ানোর জন্য ছোট সাইজে স্ক্যান
    canvas.height = 100;
    ctx.drawImage(img, 0, 0, 100, 100);
    
    const imageData = ctx.getImageData(0, 0, 100, 100).data;
    let r = 0, g = 0, b = 0, avgBrightness = 0;

    for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        avgBrightness += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
    }

    // স্লাইডারের জন্য ভ্যালু ক্যালকুলেশন
    const totalPixels = 100 * 100;
    const brightnessLevel = (avgBrightness / totalPixels);
    
    // অটো অ্যাডজাস্টমেন্ট লজিক
    elements['brightness'].value = brightnessLevel < 128 ? 130 : 100;
    elements['contrast'].value = 125;
    elements['saturation'].value = (r > g && r > b) ? 140 : 110; // যদি লালচে হয় তবে স্যাচুরেশন বাড়বে
    elements['hue'].value = (g > b) ? 10 : 0; // হালকা গোল্ডেন টোন
    elements['vignetteRange'].value = 30;

    applyFilters();
    alert("✨ Preset settings extracted! Now upload your photo.");
}

function applyFilters() {
    if(!mainImage.src) return;
    const { brightness, contrast, saturation, hue, blur, vignetteRange } = elements;
    const filterStr = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hue.value}deg) blur(${blur.value}px)`;
    mainImage.style.filter = filterStr;
    mainImage.style.WebkitFilter = filterStr;
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.8)`;
}

Object.values(elements).forEach(el => el.oninput = applyFilters);

// ম্যানুয়াল কপি-পেস্ট আগের মতোই থাকবে
document.getElementById('copySettings').onclick = () => {
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
    link.download = 'preset_applied.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};
