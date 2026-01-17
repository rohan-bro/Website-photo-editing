const mainImage = document.getElementById('main-image');
const uploadInput = document.getElementById('upload');
const vignette = document.getElementById('vignette');

// সব স্লাইডার এবং কন্ট্রোল সিলেক্ট করা
const controls = ['brightness', 'contrast', 'saturation', 'hue', 'blur', 'vignetteRange'];
const elements = {};
controls.forEach(id => elements[id] = document.getElementById(id));

let savedEdit = null; // কপি করা সেটিংস রাখার জন্য

// ছবি আপলোড লজিক
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

// ফিল্টার অ্যাপ্লাই করার মূল ফাংশন
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
    mainImage.style.WebkitFilter = filterValue; // মোবাইল ব্রাউজারের জন্য
    vignette.style.boxShadow = `inset 0 0 ${vignetteRange.value * 2.5}px rgba(0,0,0,0.8)`;
}

// স্লাইডার মুভ করলেই ছবি আপডেট হবে
Object.values(elements).forEach(el => el.oninput = applyFilters);

// COPY EDITS: বর্তমান ছবির এডিট কপি করা
document.getElementById('copySettings').onclick = () => {
    if(!mainImage.src) return alert("আগে একটি ছবি আপলোড করুন!");
    savedEdit = {};
    controls.forEach(id => savedEdit[id] = elements[id].value);
    alert("✨ Edit Settings Copied! এবার নতুন ছবি আপলোড করে Paste বাটনে ক্লিক করুন।");
};

// PASTE EDITS: কপি করা এডিট নতুন ছবিতে বসানো
document.getElementById('pasteSettings').onclick = () => {
    if (!savedEdit) return alert("আগে একটি ছবির এডিট Copy করুন!");
    controls.forEach(id => elements[id].value = savedEdit[id]);
    applyFilters();
};

// ডাউনলোড/এক্সপোর্ট লজিক
document.getElementById('downloadBtn').onclick = () => {
    if(!mainImage.src) return alert("ডাউনলোড করার জন্য কোনো ছবি নেই!");
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;
    ctx.filter = getComputedStyle(mainImage).filter;
    ctx.drawImage(mainImage, 0, 0);
    const link = document.createElement('a');
    link.download = 'cinema_edit_pro.png';
    link.href = canvas.toDataURL();
    link.click();
};
