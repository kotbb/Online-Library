document.addEventListener('DOMContentLoaded', function() {
    // Get the borrowed books container
    const borrowedList = document.getElementById('borrowed-list');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];

    // Load borrowed books from localStorage
    function loadBorrowedBooks() {
        // Try to get borrowed books from localStorage
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
        
        // If no borrowed books, show a message
        if (borrowedBooks.length === 0) {
            borrowedList.innerHTML = '<div class="no-books-message">You have not borrowed any books yet.</div>';
            return;
        }
        
        // Clear the container
        borrowedList.innerHTML = '';
        
        // Add each book to the container
        borrowedBooks.forEach(book => {
            if(book.userEmail === currentUser.email)
            {
                // Calculate days remaining
                const dueDate = new Date(book.dueDate);
                const today = new Date();
                const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                
                // Create book card
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                
                // Set the HTML content
                bookCard.innerHTML = `
                    <div class="book-cover">
                        <img src="img/${book.image}" alt="${book.name} Cover" />
                    </div>
                    <div class="book-info">
                        <h3>${book.name}</h3>
                        <p class="author">${book.author}</p>
                        <p class="description">${book.description}</p>
                    </div>
                    
                    <div class="book-details">
                        <p><i class="fas fa-calendar"></i> Due Date: ${book.dueDate}</p>
                        <p><i class="fas fa-clock"></i> ${daysRemaining > 0 ? daysRemaining + ' days remaining' : 'Overdue!'}</p>
                    </div>
                    <button class="btn return-btn" data-id="${book.ISBN}">Return Book</button>
                `;
                // Add the book card to the container
                borrowedList.appendChild(bookCard);
            }
        });
        
        // Add event listeners to return buttons
        addReturnButtonListeners();
    }
    
    // Add event listeners to return buttons
    function addReturnButtonListeners() {
        const returnButtons = document.querySelectorAll('.return-btn');
        returnButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-id');
                returnBook(bookId);
            });
        });
    }
    
    // Return a book
    function returnBook(bookId) {
        // Get borrowed books from localStorage
        let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
        
        // Find the book to return
        const bookIndex = borrowedBooks.findIndex(book => book.ISBN == bookId);
        
        if (bookIndex === -1) {
            alert('Book not found!');
            return;
        }
        
        // Get the book details
        const book = borrowedBooks[bookIndex];
        
        // Confirm return
        if (confirm(`Are you sure you want to return "${book.name}"?`)) {
            // Remove the book from borrowed books
            borrowedBooks.splice(bookIndex, 1);
            
            // Update localStorage
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            
            // Update the book's availability in the books collection
            updateBookAvailability(bookId);
            
            // Reload the borrowed books
            loadBorrowedBooks();
            
            // Show success message
            alert(`"${book.name}" has been returned successfully.`);
        }
    }
    
    // Update book availability in the books collection
    function updateBookAvailability(bookId) {
        // Get all books from localStorage
        let allBooks = JSON.parse(localStorage.getItem('book') || '[]');
        
        // Find the book
        const book = allBooks.find(b => b.ISBN == bookId);
        
        if (book) {
            // Update availability
            book.status = 'Available';
            
            // Update localStorage
            localStorage.setItem('book', JSON.stringify(allBooks));
        }
    }
   
    // Initialize the page
    function init() {
        
        // Load borrowed books
        loadBorrowedBooks();
    }
    
    // Start the application
    init();
});
