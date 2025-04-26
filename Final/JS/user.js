document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .btn-primary');
    const booksContainer = document.getElementById('booksContainer');
    
    // Book data
    let allBooks = [];
    let filteredBooks = [];
    
    // Load books from localStorage
    function loadBooks() {
        const storedBooks = localStorage.getItem('books');
        
        if (storedBooks) {
            try {
                allBooks = JSON.parse(storedBooks);
            } catch (error) {
                console.error('Error parsing books from localStorage:', error);
                // If there's an error, initialize with sample books
                initializeSampleBooks();
                return;
            }
        } else {
            // If no books in localStorage, initialize with sample books
            initializeSampleBooks();
            return;
        }
        
        filteredBooks = [...allBooks];
        displayBooks(filteredBooks);
    }
    
    // Initialize with sample books if localStorage is empty
    function initializeSampleBooks() {
        allBooks = [
            {
                id: 1,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "Fiction, Classics",
                cover: "img/B1_1.jpg",
                available: true
            },
            {
                id: 2,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                genre: "Fiction, Classics",
                cover: "img/B2_1.jpg",
                available: true
            },
            {
                id: 3,
                title: "1984",
                author: "George Orwell",
                genre: "Science Fiction, Dystopian",
                cover: "img/B3_1.jpg",
                available: true
            },
            {
                id: 4,
                title: "Pride and Prejudice",
                author: "Jane Austen",
                genre: "Romance, Classics",
                cover: "img/B4_1.jpg",
                available: true
            }
        ];
        
        // Save sample books to localStorage
        localStorage.setItem('books', JSON.stringify(allBooks));
        
        filteredBooks = [...allBooks];
        displayBooks(filteredBooks);
    }
    
    // Display books in the grid
    function displayBooks(books) {
        // Clear existing books
        booksContainer.innerHTML = '';
        
        if (books.length === 0) {
            booksContainer.innerHTML = '<div class="no-results">No books found matching your search.</div>';
            return;
        }
        
        // Create book cards
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            const availabilityClass = book.available ? 'available' : 'unavailable';
            const availabilityText = book.available ? 'Available' : 'Currently Borrowed';
            
            bookCard.innerHTML = `
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title} Cover" onerror="this.src='img/book-placeholder.jpg'">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <p class="book-genre">${book.genre}</p>
                    <div class="book-actions">
                        <button class="btn-primary" data-book-id="${book.id}">Select</button>
                        <button class="btn-secondary" data-book-id="${book.id}">Add to Wish List</button>
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
    function selectBook(bookId) {
        const book = allBooks.find(b => b.id == bookId);
        
        if (!book) {
            alert('Book not found!');
            return;
        }
        
        if (!book.available) {
            alert('This book is currently not available for borrowing.');
            return;
        }
        
        // Show confirmation dialog
        if (confirm(`Would you like to borrow "${book.title}" by ${book.author}?`)) {
            // Find and hide the book card
            const bookCard = document.querySelector(`.book-card button[data-book-id="${bookId}"]`).closest('.book-card');
            bookCard.style.display = 'none';
            
            // Update book availability
            book.available = false;
            
            // Update localStorage
            localStorage.setItem('books', JSON.stringify(allBooks));
            
            // Add to user's borrowed books
            addToBorrowedBooks(book);
            
            alert(`You have successfully borrowed "${book.title}". It will be available in your "My Books" section.`);
            
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
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            borrowDate: borrowDate.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0]
        });
        
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    }
    
    // Add book to wishlist
    function addToWishlist(bookId) {
        const book = allBooks.find(b => b.id == bookId);
        
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
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover
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