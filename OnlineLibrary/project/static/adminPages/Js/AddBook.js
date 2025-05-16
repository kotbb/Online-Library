//          *************** Create Book *************** 

// Getting Book inputs
let name = document.getElementById('id_title');
let image = document.getElementById('id_cover_image');
let submit = document.getElementById('submit-btn');
let upload = document.getElementById('upload-btn');
let preview = document.getElementById('preview-image');
let form = document.getElementById('add-book-form');
let filenameDisplay = document.getElementById('current-image-filename');

// focus on name in loading the page
window.onload = function() {
    name.focus();
}

// prevent when clicking Enter , it fetch the data to the local Storage
form.addEventListener('keydown', function(e) {
    if(e.key == 'Enter')
        e.preventDefault();
})

// Read the file image
image.addEventListener('change', function() {
    let file = this.files[0];
    if(file) {
        let reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            filenameDisplay.textContent = file.name;
        }
        reader.readAsDataURL(file);
        preview.style.display = 'block';
    }
});