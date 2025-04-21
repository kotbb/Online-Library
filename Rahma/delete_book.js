document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.querySelector(".delete-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const bookToDelete = JSON.parse(localStorage.getItem("bookToDelete"));
    const messagePara = document.querySelector("p");
  
    // Show book name in confirmation message
    if (bookToDelete && bookToDelete.name) {
      messagePara.innerHTML = `Are you sure you want to delete the book <strong>"${bookToDelete.name}"</strong>?`;
    }
  
    // Delete button logic
    deleteBtn.addEventListener("click", () => {
      const allBooks = JSON.parse(localStorage.getItem("bookList")) || [];
  
      // Filter out the book to delete
      const updatedBooks = allBooks.filter(book => book.id !== bookToDelete.id);
  
      // Save updated book list
      localStorage.setItem("bookList", JSON.stringify(updatedBooks));
  
      alert("Book deleted successfully ✅");
  
      // Optional: remove the temp book
      localStorage.removeItem("bookToDelete");
  
      // Redirect to dashboard
      window.location.href = "admin-dashboard.html";
    });
  
    // Cancel button logic
    cancelBtn.addEventListener("click", () => {
      window.location.href = "admin-dashboard.html";
    });
  });
  