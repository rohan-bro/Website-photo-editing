const mainImage = document.getElementById('main-image');
const uploadInput = document.getElementById('upload');
const vignette = document.getElementById('vignette');
const grain = document.getElementById('grain');

// স্লাইডারগুলো সিলেক্ট করা
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const grainRange = document.getElementById('grainRange');
const vignetteRange = document.getElementById('vignetteRange');

// ছবি আপলোড লজিক (মোবাইল ফ্রেন্ডলি FileReader)
uploadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            mainImage.src = event.target.result;
            mainImage.style.display = "block"; // ছবি দেখা নিশ্চিত করা
        }
        reader.readAsDataURL(file);
    }
};

// ফিল্টার আপডেট ফাংশন
function updateFilters() {
    mainImage.style.filter = `
        brightness(${brightness.value}%) 
        contrast(${contrast.value}%) 
        saturate(${saturation.value}%)
    `;
    
    // Vignette কন্ট্রোল
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.9)`;
    
    // Grain কন্ট্রোল
    grain.style.opacity = grainRange.value / 150;
}

// স্লাইডারে ইভেন্ট যোগ করা
[brightness, contrast, saturation, grainRange, vignetteRange].forEach(item => {
    item.oninput = updateFilters;
});

// প্রিসেট লজিক
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.onclick = () => {
        const type = btn.getAttribute('data-type');
        if (type === 'noir') {
            brightness.value = 110; contrast.value = 140; saturation.value = 0;
        } else if (type === 'teal') {
            brightness.value = 100; contrast.value = 120; saturation.value = 130;
            mainImage.style.filter += " hue-rotate(-10deg)";
        } else if (type === 'vintage') {
            brightness.value = 110; contrast.value = 90; saturation.value = 70;
            mainImage.style.filter += " sepia(40%)";
        } else {
            // Reset All
            brightness.value = 100; contrast.value = 100; saturation.value = 100;
            grainRange.value = 0; vignetteRange.value = 0;
            mainImage.style.filter = "none";
        }
        updateFilters();
    };
});

// ডাউনলোড লজিক
document.getElementById('downloadBtn').onclick = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // ছবি লোড হওয়া পর্যন্ত নিশ্চিত করা
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;
    
    ctx.filter = getComputedStyle(mainImage).filter;
    ctx.drawImage(mainImage, 0, 0);
    
    const link = document.createElement('a');
    link.download = 'cinema_edit.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};
