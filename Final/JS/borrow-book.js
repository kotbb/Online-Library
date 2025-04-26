document.addEventListener('DOMContentLoaded', function() {
    // Get the borrowed books container
    const borrowedList = document.getElementById('borrowed-list');
    
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
                    <img src="${book.cover || 'https://fakeimg.pl/667x1000/cc6600'}" alt="${book.title} Cover" />
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                </div>
                <div class="book-details">
                    <p><i class="fas fa-calendar"></i> Due Date: ${book.dueDate}</p>
                    <p><i class="fas fa-clock"></i> ${daysRemaining > 0 ? daysRemaining + ' days remaining' : 'Overdue!'}</p>
                </div>
                <button class="btn return-btn" data-id="${book.id}">Return Book</button>
            `;
            
            // Add the book card to the container
            borrowedList.appendChild(bookCard);
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
        const bookIndex = borrowedBooks.findIndex(book => book.id == bookId);
        
        if (bookIndex === -1) {
            alert('Book not found!');
            return;
        }
        
        // Get the book details
        const book = borrowedBooks[bookIndex];
        
        // Confirm return
        if (confirm(`Are you sure you want to return "${book.title}"?`)) {
            // Remove the book from borrowed books
            borrowedBooks.splice(bookIndex, 1);
            
            // Update localStorage
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            
            // Update the book's availability in the books collection
            updateBookAvailability(bookId, true);
            
            // Reload the borrowed books
            loadBorrowedBooks();
            
            // Show success message
            alert(`"${book.title}" has been returned successfully.`);
        }
    }
    
    // Update book availability in the books collection
    function updateBookAvailability(bookId, available) {
        // Get all books from localStorage
        let allBooks = JSON.parse(localStorage.getItem('books') || '[]');
        
        // Find the book
        const book = allBooks.find(b => b.id == bookId);
        
        if (book) {
            // Update availability
            book.available = available;
            
            // Update localStorage
            localStorage.setItem('books', JSON.stringify(allBooks));
        }
    }
    
    // Initialize sample borrowed books if none exist (for testing)
    function initializeSampleBorrowedBooks() {
        // Check if borrowed books already exist
        const existingBooks = localStorage.getItem('borrowedBooks');
        
        if (!existingBooks) {
            // Sample borrowed books
            const sampleBorrowedBooks = [
                {
                    id: 1,
                    title: "To Kill a Mockingbird",
                    author: "Harper Lee",
                    cover: "https://fakeimg.pl/667x1000/cc6600",
                    borrowDate: "2023-03-25",
                    dueDate: "2023-04-08"
                },
                {
                    id: 2,
                    title: "1984",
                    author: "George Orwell",
                    cover: "https://fakeimg.pl/667x1000/cc6600",
                    borrowDate: "2023-03-25",
                    dueDate: "2023-04-08"
                },
                {
                    id: 3,
                    title: "Pride and Prejudice",
                    author: "Jane Austen",
                    cover: "https://fakeimg.pl/667x1000/cc6600",
                    borrowDate: "2023-03-25",
                    dueDate: "2023-04-08"
                }
            ];
            
            // Save to localStorage
            localStorage.setItem('borrowedBooks', JSON.stringify(sampleBorrowedBooks));
        }
    }
    
    // Initialize the page
    function init() {
        // Initialize sample data if needed
        initializeSampleBorrowedBooks();
        
        // Load borrowed books
        loadBorrowedBooks();
    }
    
    // Start the application
    init();
});