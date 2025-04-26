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
                availabilityText = 'Currently Borrowed';
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
                        <button class="btn-secondary" data-book-id="${book.ISBN}">Add to Wish List</button>
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
                selectBook(bookId);
            });
        });
        
        // Wishlist buttons
        const wishlistButtons = document.querySelectorAll('.book-actions .btn-secondary');
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                addToWishlist(bookId);
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
    
    // Add book to wishlist
    function addToWishlist(bookId) {
        const book = allBooks.find(b => b.ISBN == bookId);
        
        if (!book) {
            alert('Book not found!');
            return;
        }
        
        // Check if user is logged in (simplified for demo)
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            alert('Please log in to add books to your wishlist.');
            window.location.href = 'login.html';
            return;
        }
        
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        // Check if book is already in wishlist
        if (wishlist.some(item => item.id == bookId)) {
            alert(`"${book.title}" is already in your wishlist.`);
            return;
        }
        
        // Add to wishlist
        wishlist.push({
            name: book.name,
            author: book.author,
            ISBN: book.ISBN,
            papers: book.papers,
            category: book.category,
            status: book.status,
            borrowStatus: book.borrowStatus,
            description: book.description,
            image: book.image,
            adminEmail: book.adminEmail,
            userEmail: currentUser.email,
            borrowDate: borrowDate.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0]
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`"${book.title}" has been added to your wishlist.`);
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
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.genre.toLowerCase().includes(searchTerm)
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

