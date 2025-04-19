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

// check if the user doesn't enter values
let checkValues = function(book) {
    return book.name.trim() !== "" &&
           book.ISBN.trim() !== "" &&
           book.author.trim() !== "" &&
           book.papers.trim() !== "";
}
// submiting data in the array and sending them to the local storage
submit.addEventListener('click',function(e) 
{
    e.preventDefault();
    let newBook = {
        name: name.value.trim(),
        author: author.value.trim(),
        ISBN: ISBN.value.trim(),
        papers: papers.value.trim(),
        description: description.value.trim(),
        image: image.value.trim(),
        category: category.value,
        status: true
    }
    // to check if the user click on submit with null values to prevent sending wrong data to the array
    if(checkValues(newBook))
    {
        dataBooks.push(newBook);
        localStorage.setItem('book',JSON.stringify(dataBooks));
        window.location.href = "admin-dashboard.html";

    }

})

//----------------------------------------------------------------------------------------+









