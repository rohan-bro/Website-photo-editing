const uploadInput = document.getElementById('upload');
const mainImage = document.getElementById('main-image');
const vignette = document.getElementById('vignette');

// স্লাইডার
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const vignetteRange = document.getElementById('vignetteRange');

// ছবি আপলোড লজিক (সবচেয়ে শক্তিশালী পদ্ধতি)
uploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            mainImage.src = event.target.result;
            mainImage.style.display = 'block'; // ছবি দেখাবে
            mainImage.parentElement.style.border = 'none'; // ড্যাশ বর্ডার সরিয়ে দিবে
        }
        reader.readAsDataURL(file);
    }
});

function applyFilters() {
    mainImage.style.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%)`;
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2}px rgba(0,0,0,0.9)`;
}

[brightness, contrast, saturation, vignetteRange].forEach(input => {
    input.addEventListener('input', applyFilters);
});

// প্রিসেট ও ডাউনলোড আগের মতোই থাকবে...
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.onclick = () => {
        const type = btn.getAttribute('data-type');
        if (type === 'noir') { saturation.value = 0; contrast.value = 130; }
        else if (type === 'teal') { mainImage.style.filter += " hue-rotate(-10deg)"; saturation.value = 140; }
        else { brightness.value = 100; contrast.value = 100; saturation.value = 100; vignetteRange.value = 0; }
        applyFilters();
    };
});
