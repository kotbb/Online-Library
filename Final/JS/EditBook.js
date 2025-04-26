
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("EditForm");

  const bookNameInput = document.getElementById("book-name");
  const authorInput = document.getElementById("book-author");
  const isbnInput = document.getElementById("book-ISBN");
  const papersInput = document.getElementById("book-papers");
  const categoryInput = document.getElementById("category");
  const descriptionInput = document.getElementById("book-description");
  const statusInput = document.getElementById("book-status");

  const submitBtn = document.getElementById("submit");

  let image = document.getElementById('book-image-file');
  let filenameDisplay = document.getElementById('current-image-filename');
  let preview = document.getElementById('preview-image');


  // Load existing data
  let dataBooks = JSON.parse(localStorage.getItem("book")) || [];
  let index = localStorage.getItem("editIndex");

  if (index !== null && dataBooks[index]) {
    const book = dataBooks[index];
    bookNameInput.value = book.name || "";
    authorInput.value = book.author || "";
    isbnInput.value = book.ISBN || "";
    papersInput.value = book.papers || "";
    categoryInput.value = book.category || "";
    descriptionInput.value = book.description || "";
    statusInput.value = book.status || "Available";
    // to load the image source
    if (book.image) {
      preview.src = 'img/'+ book.image;
      filenameDisplay.textContent = book.image;
    }
    // Read the file image to show it in the page
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
      }
      })
  }

  // Save on click
  submitBtn.addEventListener("click", function () {
    const name = bookNameInput.value.trim();
    const author = authorInput.value.trim();
    const ISBN = isbnInput.value.trim();
    const papers = papersInput.value.trim();
    const category = categoryInput.value.trim();
    const description = descriptionInput.value.trim();
    const status = statusInput.value.trim();

    let imageName;
    if(image.files.length)
        imageName = image.files[0].name ;
    else
        imageName = filenameDisplay.textContent;

    // Validation
    if (!name ) {
      alert("Please enter a book name.");
      return;
    }
    
    if (!author) {
      alert("Please enter the author's name.");
      return;
    }
    
    if (!ISBN ) {
      alert("Please enter a ISBN .");
      return;
    }
    
    if (!papers) {
      alert("Please enter a  number of papers .");
      return;
    }
    
    if (!category) {
      alert("Please select a category.");
      return;
    }
    

  
    if (index !== null && dataBooks[index]) {
      dataBooks[index] = {
        name,
        author,
        ISBN,
        papers,
        category,
        description,
        status,
        image: imageName,
        userEmail : user.email 
      };

      localStorage.setItem("book", JSON.stringify(dataBooks));
      alert("Changes saved successfully ✅");
      window.location.href = 'admin-dashboard.html'

     
    } else {
      alert("Error: Book not found.");
    }
  });
});
