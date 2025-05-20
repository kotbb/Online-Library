document.addEventListener("DOMContentLoaded", () => {
    let image = document.getElementById('id_book_cover');
    let filenameDisplay = document.getElementById('current-image-filename');
    let preview = document.getElementById('preview-image');

    // Show current image on page load
    if (preview.src && preview.src !== window.location.href) {
        preview.style.display = 'block';
        // Get filename from the URL
        const filename = preview.src.split('/').pop();
        filenameDisplay.textContent = filename;
    }

    // Read the file image
    image.addEventListener('change', function() {
        let file = this.files[0];
        if(file) {
            let reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.style.display = 'block';
                filenameDisplay.textContent = file.name;
            }
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
            filenameDisplay.textContent = '';
        }
    });
    if (image.src) {
        image.setAttribute('data-current-image', image.src);
    }
})
