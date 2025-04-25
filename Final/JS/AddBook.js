//          *************** Create Book *************** 

// Getting Book inputs
let name = document.getElementById('book-name');
let author = document.getElementById('book-author');
let ISBN = document.getElementById('book-ISBN');
let papers = document.getElementById('book-papers');
let description = document.getElementById('book-description');
let image = document.getElementById('book-image');
let category = document.getElementById('category');
let submit = document.getElementById('submit-btn');
let upload = document.getElementById('upload-btn');
let form = document.querySelector('form');
let preview = document.getElementById('preview-image');
let filenameDisplay = document.getElementById('current-image-filename');
//---------------------------------------------------

// focus on name in loading the page
window.onload = function()
{
    name.focus();
}

// prevent when clicking Enter , it fetch the data to the local Storage
form.addEventListener('keydown',function(e){
    if(e.key == 'Enter')
        e.preventDefault();
})

// Initilize the books array and check if it is empty
let dataBooks;
let checkEmptyArray = function()
{
    if(localStorage.book != null)
    {
        return JSON.parse(localStorage.book);
    }
    else{
        return [];
    }
}
dataBooks = checkEmptyArray();

// Check validation
let checkValues = function(book) {

    // Check for empty fields
    if( book.name.trim() === "" ||  book.ISBN.trim() === "" || book.author.trim() === "" || book.papers.trim() === "")
    {
        alert('Please fill in all fields ❌');
        return false;
    }
    // Check for a book with the same ISBN
    for(let i = 0; i < dataBooks.length; i++){
        if(book.ISBN === dataBooks[i].ISBN){
            alert('Duplicate ISBN, Please enter another ISBN ❌');
            return false;
        }
    }
    return true;
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
// submiting data in the array and sending them to the local storage
submit.addEventListener('click',function(e) 
{
    e.preventDefault();
    let imageName = 'defaultBookCover.jpg'; 
    
    if(image.files.length)
        imageName = image.files[0].name;
    let newBook = {
        name: name.value.trim(),
        author: author.value.trim(),
        ISBN: ISBN.value.trim(),
        papers: papers.value.trim(),
        category: category.value,
        status: 'Available',
        description: description.value.trim(),
        image: imageName,
        adminEmail: user.email
    };
    // to check if the user click on submit with null values to prevent sending wrong data to the array
    if(checkValues(newBook))
    {
        dataBooks.push(newBook);
        localStorage.setItem('book',JSON.stringify(dataBooks));
        alert("Book added successfully ✅");
        window.location.href = "admin-dashboard.html";
    }
})
//----------------------------------------------------------------------------------------+
