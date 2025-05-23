//          *************** Create Book *************** 

// Getting Book inputs
let name = document.getElementById('id_title');
let image = document.getElementById('id_book_cover');
let submit = document.getElementById('submit-btn');
let upload = document.getElementById('upload-btn');
let preview = document.getElementById('preview-image');
let form = document.getElementById('add-book-form');
let filenameDisplay = document.getElementById('current-image-filename');
// focus on name in loading the page
window.onload = function() {
    name.focus();
}

form.addEventListener('keydown', function(e) {
    if(e.key == 'Enter')
        e.preventDefault();
})

// Read the file image
image.addEventListener('change', function() {
    let file = this.files[0];
    if(file) {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            this.value = ''; // Clear the file input
            preview.style.display = 'none';
            return;
        }

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
