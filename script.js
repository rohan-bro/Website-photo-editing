const uploadInput = document.getElementById('upload');
const mainImage = document.getElementById('main-image');
const vignette = document.getElementById('vignette');
const downloadBtn = document.getElementById('downloadBtn');

// স্লাইডার এলিমেন্ট
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hue = document.getElementById('hue');
const blur = document.getElementById('blur');
const sepia = document.getElementById('sepia');
const vignetteRange = document.getElementById('vignetteRange');

// ছবি আপলোড ফাংশন
uploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            mainImage.src = event.target.result;
            mainImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// ফিল্টার অ্যাপ্লাই ফাংশন
function applyFilters() {
    mainImage.style.filter = `
        brightness(${brightness.value}%) 
        contrast(${contrast.value}%) 
        saturate(${saturation.value}%)
        hue-rotate(${hue.value}deg)
        blur(${blur.value}px)
        sepia(${sepia.value}%)
    `;
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.9)`;
}

// সব স্লাইডারে ইভেন্ট লিসেনার
[brightness, contrast, saturation, hue, blur, sepia, vignetteRange].forEach(input => {
    input.addEventListener('input', applyFilters);
});

// প্রিসেট লজিক
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.onclick = () => {
        const type = btn.getAttribute('data-type');
        resetValues();
        if (type === 'noir') { saturation.value = 0; contrast.value = 150; brightness.value = 110; }
        else if (type === 'teal') { hue.value = 170; saturation.value = 150; contrast.value = 120; }
        else if (type === 'vintage') { sepia.value = 60; contrast.value = 90; brightness.value = 110; }
        applyFilters();
    };
});

function resetValues() {
    brightness.value = 100; contrast.value = 100; saturation.value = 100;
    hue.value = 0; blur.value = 0; sepia.value = 0; vignetteRange.value = 0;
}

// ডাউনলোড ফাংশন
downloadBtn.onclick = () => {
    if(!mainImage.src) return alert("Please upload an image first!");
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;
    ctx.filter = getComputedStyle(mainImage).filter;
    ctx.drawImage(mainImage, 0, 0);
    const link = document.createElement('a');
    link.download = 'cinematic_edit.png';
    link.href = canvas.toDataURL();
    link.click();
};
