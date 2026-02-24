// Select elements
const dataInput = document.querySelector("input[name='data']");
const fillColorInput = document.querySelector("input[name='fill_color']");
const backColorInput = document.querySelector("input[name='back_color']");
const sizeSelect = document.querySelector("select[name='size']");
const logoInput = document.querySelector("input[name='logo']");
const form = document.querySelector("form");

// Create preview container
const previewContainer = document.createElement("div");
previewContainer.style.marginTop = "20px";
previewContainer.style.textAlign = "center";

const previewImg = document.createElement("img");
previewImg.style.maxWidth = "200px";

previewContainer.appendChild(previewImg);
form.appendChild(previewContainer);

// Function to generate preview QR (Frontend only)
function generatePreview() {
    const data = dataInput.value.trim();
    const fillColor = fillColorInput.value;
    const backColor = backColorInput.value;
    const size = sizeSelect.value;

    if (data === "") {
        previewImg.src = "";
        return;
    }

    // Using public QR API for preview
    previewImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 25}x${size * 25}&data=${encodeURIComponent(data)}&color=${fillColor.replace('#', '')}&bgcolor=${backColor.replace('#', '')}`;
}

// Live update on change
dataInput.addEventListener("input", generatePreview);
fillColorInput.addEventListener("input", generatePreview);
backColorInput.addEventListener("input", generatePreview);
sizeSelect.addEventListener("change", generatePreview);

// Logo preview
logoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Simple form validation
form.addEventListener("submit", function (e) {
    if (dataInput.value.trim() === "") {
        e.preventDefault();
        alert("Please enter text or URL!");
    }
});