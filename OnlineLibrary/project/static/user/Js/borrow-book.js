document.addEventListener('DOMContentLoaded', function() {
    // Get the borrowed books container
    const borrowedList = document.getElementById('borrowed-list');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];

    // Load borrowed books from localStorage
    function loadBorrowedBooks() {
        // Try to get borrowed books from localStorage
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
        
        let countBorrowedBooks = borrowedBooks.filter( book => currentUser.email === book.userEmail).length;

        // If no borrowed books, show a message
        if (countBorrowedBooks === 0) {
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

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all return book buttons
    const returnButtons = document.querySelectorAll('.return-book');
    returnButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recordId = this.getAttribute('data-record-id');
            returnBook(recordId);
        });
    });

    // Function to return a book
    function returnBook(recordId) {
        // Get CSRF token from cookie
        const csrftoken = getCookie('csrftoken');
        
        // Make AJAX request to return book
        fetch(`/return-book/${recordId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                showNotification(data.message || 'Book returned successfully!', 'success');
                
                // Remove the book card with animation
                const bookCard = document.querySelector(`.book-card[data-record-id="${recordId}"]`);
                if (bookCard) {
                    bookCard.style.opacity = '0';
                    bookCard.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        bookCard.remove();
                        
                        // Check if there are any books left
                        const remainingBooks = document.querySelectorAll('.book-card');
                        if (remainingBooks.length === 0) {
                            const booksContainer = document.getElementById('booksContainer');
                            const noBooks = document.createElement('p');
                            noBooks.className = 'no-books';
                            noBooks.textContent = 'You haven\'t borrowed any books yet.';
                            booksContainer.appendChild(noBooks);
                        }
                    }, 500);
                }
            } else {
                // Show error message
                showNotification(data.message || 'Failed to return book. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error returning book:', error);
            showNotification('An error occurred while returning the book. Please try again.', 'error');
        });
    }

    // Function to get CSRF token from cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Function to show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});