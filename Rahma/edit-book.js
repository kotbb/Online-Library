document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent page reload
  
      const bookName = form.elements[0].value.trim();
      const author = form.elements[1].value.trim();
      const category = form.elements[2].value.trim();
      const description = form.elements[3].value.trim();
  
      // Validation
      if (!bookName || bookName.length < 2) {
        alert("Please enter a valid book name (at least 2 characters).");
        return;
      }
  
      if (!author) {
        alert("Please enter the author's name.");
        return;
      }
  
      if (!category) {
        alert("Please enter a category.");
        return;
      }
  
      if (!description || description.length < 10) {
        alert("Description must be at least 10 characters long.");
        return;
      }
  
      // Save data to localStorage
      const editedBook = {
        bookName: bookName,
        author: author,
        category: category,
        description: description,
      };
  
      // Convert the object to a string before saving
      localStorage.setItem("editedBook", JSON.stringify(editedBook));
  
      alert("Changes saved successfully ✅");
    });
  
    // Optional: Load existing data into form if it exists
    const savedBook = localStorage.getItem("editedBook");
    if (savedBook) {
      const data = JSON.parse(savedBook);
      form.elements[0].value = data.bookName;
      form.elements[1].value = data.author;
      form.elements[2].value = data.category;
      form.elements[3].value = data.description;
    }
  });
  