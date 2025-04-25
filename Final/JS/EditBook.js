// Get data of the book
let dataBooks = JSON.parse(localStorage.getItem("book")) || [];
let index = localStorage.getItem("editIndex");
let name = document.getElementById('book-name');
let author = document.getElementById('book-author');
let ISBN = document.getElementById('book-ISBN');
let papers = document.getElementById('book-papers');
let description = document.getElementById('book-description');
let image = document.getElementById('book-image');
let category = document.getElementById('category');
let status = document.getElementById('book-status');
let filenameDisplay = document.getElementById('current-image-filename');
//--------------------------------------------------------
// Load the date of the fields
window.addEventListener("DOMContentLoaded", function () {
    dataBooks = JSON.parse(localStorage.getItem("book")) || [];
    index = localStorage.getItem("editIndex");
    index = Number(index);

    if (index === null || !dataBooks[index]) return;
    let book = dataBooks[index];

    name.value = book.name;
    author.value = book.author;
    ISBN.value = book.ISBN;
    papers.value = book.papers;
    category.value = book.category;
    status.value = book.status;
    description.value = book.description || "";

    let preview = document.getElementById('preview-image');

    if (book.image) {
        preview.src = 'img/'+ book.image;
        filenameDisplay.textContent = book.image;
    }
    // Read the file image
    image.addEventListener('change',function(){
    let file = this.files[0];
    if(file)
    {
        let reader = new FileReader();

        // Load before read to not miss the loading event
        reader.onload = ()=>{
            preview.src = reader.result;
            filenameDisplay.textContent = file.name;
        }
        // Read at the end to make sure we will not miss the loading event
        reader.readAsDataURL(file);
        preview.style.display = 'block';
    }
    })
})
// Check if the user doesn't enter values
let checkValues = function(book) {
    return book.name.trim() !== "" &&
           book.ISBN.trim() !== "" &&
           book.author.trim() !== "" &&
           book.papers.trim() !== "";
}
// Submit the edited data
let submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click',function(){
    let imageName = dataBooks[index].image;
    if(image.files.length)
        imageName = image.files[0].name;
    let updatedBook = {
        name: name.value,
        author: author.value,
        ISBN: ISBN.value,
        papers: papers.value,
        category: category.value,
        status: status.value,
        description: description.value,
        image: imageName,
    };
    if(checkValues(updatedBook))
    {
        dataBooks[index] = updatedBook;
        localStorage.book = JSON.stringify(dataBooks);
        window.location.href = 'admin-dashboard.html';
    }
})