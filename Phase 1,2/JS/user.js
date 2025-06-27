document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .btn-primary');
    const booksContainer = document.getElementById('booksContainer');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
    
    // Book data
    let allBooks = [];
    let filteredBooks = [];
    
    // Load books from localStorage
    function loadBooks() {
        const storedBooks = localStorage.getItem('book');
        
        if (storedBooks) {
            try {
                allBooks = JSON.parse(storedBooks);
            } catch (error) {
                console.error('Error parsing books from localStorage:', error);
                return;
            }
        } else {
            return;
        }
        
        filteredBooks = [...allBooks];
        displayBooks(filteredBooks);
    }
    
    // Display books in the grid
    function displayBooks(books) {
        // Clear existing books
        booksContainer.innerHTML = '';
        
        if (books.length === 0) {
            booksContainer.innerHTML = '<div class="no-results">No books found.</div>';
            return;
        }
        
        // Create book cards
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            let availabilityClass = book.status;
            let availabilityText = "Available";
            if(book.status === 'Unavailable')
            {
                if(book.userEmail === currentUser.email)
                    availabilityText = 'Currently Borrowed';
                else
                    availabilityText = 'Currently Unavailable';

            }
            
            bookCard.innerHTML = `
                <div class="book-cover">
                    <img src="img/${book.image}" alt="${book.name}">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.name}</h3>
                    <p class="book-author">${book.author}</p>
                    <p class="book-genre">${book.category}</p>
                    <p class="${availabilityClass}">${availabilityText}</p>
                    <div class="book-actions">
                        <button class="btn-primary" data-book-id="${book.ISBN}">Select</button>
                    </div>
                </div>
            `;
            
            booksContainer.appendChild(bookCard);
        });
        
        // Add event listeners to buttons
        addBookButtonListeners();
    }
    
    // Add event listeners to book buttons
    function addBookButtonListeners() {
        // Select book buttons
        const selectButtons = document.querySelectorAll('.book-actions .btn-primary');
        selectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                let book = filteredBooks.find(book => book.ISBN === bookId);
                book.userEmail = currentUser.email;
                selectBook(bookId);
            });
        });
        
    }
    
    // Handle book selection
    function selectBook(bookISBN) {
        const book = allBooks.find(b => b.ISBN == bookISBN);
        
        if (!book) {
            alert('Book not found!');
            return;
        }
        
        if (book.status === 'Unavailable') {
            alert('This book is currently not available for borrowing.');
            return;
        }
        
        // Show confirmation dialog
        if (confirm(`Would you like to borrow "${book.name}" by ${book.author}?`)) {
            // Find and hide the book card
            const bookCard = document.querySelector(`.book-card button[data-book-id="${bookISBN}"]`).closest('.book-card');
            
            // Update book availability
            book.status = 'Unavailable';
            
            // Update localStorage
            localStorage.setItem('book', JSON.stringify(allBooks));
            
            // Add to user's borrowed books
            addToBorrowedBooks(book);
            
            alert(`You have successfully borrowed "${book.name}". It will be available in your "My Books" section.`);
            
            // Redirect to the borrowed books page
            window.location.href = 'Borrow_Book.html';
        }
    }
    
    // Add book to user's borrowed books
    function addToBorrowedBooks(book) {
        let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
        
        // Add book with borrow date and due date (14 days from now)
        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        
        borrowedBooks.push({
            name: book.name,
            author: book.author,
            ISBN: book.ISBN,
            papers: book.papers,
            category: book.category,
            status: book.status,
            description: book.description,
            image: book.image,
            adminEmail: book.adminEmail,
            userEmail: currentUser.email,
            borrowDate: borrowDate.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0]
        });
        
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    }

    // Search functionality
    function setupSearch() {
        searchButton.addEventListener('click', performSearch);
        
        // Also trigger search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Perform search based on input
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            filteredBooks = [...allBooks];
        } else {
            filteredBooks = allBooks.filter(book => 
                book.name.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm)
            );
        }
        
        displayBooks(filteredBooks);
    }
    
    // Initialize the page
    function init() {
        loadBooks();
        setupSearch();
    }
    
    // Start the application
    init();
});

