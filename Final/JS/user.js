let dataBooks = localStorage.getItem('book')

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .btn-primary');
    const booksGrid = document.querySelector('.books-grid');
    
    // Book data
    let allBooks = [];
    let displayedBooks = [];
    
    // Initialize with sample books from the page
    function initializeSampleBooks() {
        const bookCards = document.querySelectorAll('.book-card');
        
        bookCards.forEach((card, index) => {
            const title = card.querySelector('.book-title').textContent;
            const author = card.querySelector('.book-author').textContent.replace('By ', '');
            const genre = card.querySelector('.book-genre').textContent;
            const coverSrc = card.querySelector('.book-cover img').src;
            
            allBooks.push({
                id: index + 1,
                title: title,
                author: author,
                genre: genre,
                cover: coverSrc
            });
        });
        
        displayedBooks = [...allBooks];
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
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // If search is empty, show all books
            displayedBooks = [...allBooks];
            updateBookDisplay();
            return;
        }
        
        // Filter books based on search term
        displayedBooks = allBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm)
        );
        
        updateBookDisplay();
    }
    
    // Update the book display based on search results
    function updateBookDisplay() {
        // Hide all book cards first
        const bookCards = document.querySelectorAll('.book-card');
        bookCards.forEach(card => {
            card.style.display = 'none';
        });
        
        if (displayedBooks.length === 0) {
            // No results found
            const noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.textContent = 'No books found matching your search.';
            
            // Remove any existing no-results message
            const existingMsg = document.querySelector('.no-results-message');
            if (existingMsg) {
                existingMsg.remove();
            }
            
            booksGrid.appendChild(noResultsMsg);
            return;
        }
        
        // Remove any existing no-results message
        const existingMsg = document.querySelector('.no-results-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Show only the books that match the search
        displayedBooks.forEach(book => {
            const index = book.id - 1;
            if (index >= 0 && index < bookCards.length) {
                bookCards[index].style.display = 'block';
            }
        });
    }
    
    // Initialize the page
    function init() {
        initializeSampleBooks();
        setupSearch();
    }
    
    // Start the application
    init();
});