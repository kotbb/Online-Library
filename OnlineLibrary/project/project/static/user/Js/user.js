document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .btn-primary');
    const booksContainer = document.getElementById('booksContainer');
    
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    
    // Also trigger search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
      // Perform search based on input with smooth animations
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            resetSearch();
            return;
        }
        
        // Filter books using DOM elements
        const bookCards = document.querySelectorAll('.book-card');
        let foundBooks = false;
        let visibleCount = 0;
        
        // First pass: Mark all cards that should be hidden
        bookCards.forEach(card => {
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const author = card.querySelector('.book-author').textContent.toLowerCase();
            const category = card.querySelector('.book-category')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || author.includes(searchTerm) || category.includes(searchTerm)) {
                // Will be shown - add to visible count for later animation
                card.classList.remove('hidden');
                foundBooks = true;
                visibleCount++;
                
                // Reset animation delay to create staggered effect
                card.style.animationDelay = (0.05 * visibleCount) + 's';
                
                // Highlight matching text
                highlightText(card.querySelector('.book-title'), title, searchTerm);
                highlightText(card.querySelector('.book-author'), author, searchTerm);
                if (card.querySelector('.book-category')) {
                    highlightText(card.querySelector('.book-category'), category, searchTerm);
                }
            } else {
                // Mark for hiding with animation
                card.classList.add('hidden');
            }
        });
        
        // Show/hide no results message
        toggleNoResultsMessage(foundBooks);
    }
      // Reset search and display all books with smooth animations
    function resetSearch() {
        const bookCards = document.querySelectorAll('.book-card');
        let visibleCount = 0;
        
        bookCards.forEach((card, index) => {
            // Remove 'hidden' class to show all cards
            card.classList.remove('hidden');
            
            // Reset animation delay for staggered appearance
            card.style.animationDelay = (0.03 * index) + 's';
            visibleCount++;
            
            // Remove highlights
            const title = card.querySelector('.book-title');
            const author = card.querySelector('.book-author');
            const category = card.querySelector('.book-category');
            
            if (title) title.innerHTML = title.textContent;
            if (author) author.innerHTML = author.textContent;
            if (category) category.innerHTML = category.textContent;
        });
        
        // Hide no results message
        const noResultsMessage = document.querySelector('.no-books');
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
        
        // Show a quick notification if there was a previous search
        if (searchInput.value.trim() !== '') {
            showNotification('Showing all books', 'info');
            searchInput.value = '';
        }
    }
    
    // Highlight matching text in search results
    function highlightText(element, text, searchTerm) {
        if (!element) return;
        
        const regex = new RegExp('(' + escapeRegExp(searchTerm) + ')', 'gi');
        const newText = text.replace(regex, '<mark>$1</mark>');
        element.innerHTML = newText;
    }
    
    // Helper function to escape regex special characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Show/hide no results message
    function toggleNoResultsMessage(foundBooks) {
        let noResultsMessage = document.querySelector('.no-books');
        
        if (!foundBooks) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('p');
                noResultsMessage.className = 'no-books';
                noResultsMessage.textContent = 'No books matching your search.';
                booksContainer.appendChild(noResultsMessage);
            } else {
                noResultsMessage.style.display = 'block';
            }
        } else if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }
    
    
    
    

    
   
    
    

});

// Function to open the book details modal
function openBookModal(bookId) {
    // Get the modal element
    const modal = document.getElementById('bookModal');
    
    // Show the modal
    modal.classList.add('active');
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Fetch and display book details
    fetchBookDetails(bookId);
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('bookModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Function to fetch book details from the server
function fetchBookDetails(bookId) {
    // Get the book data from the book card that was clicked
    const bookCard = document.querySelector(`.book-card [data-book-id="${bookId}"]`).closest('.book-card');
    
    // Get book details from the book card
    const title = bookCard.querySelector('.book-title').textContent;
    const author = bookCard.querySelector('.book-author').textContent;
    const category = bookCard.querySelector('.book-category').textContent.replace('Category: ', '');
    const pages = bookCard.querySelector('.book-pages').textContent.replace('Pages: ', '');
    const status = bookCard.querySelector('.book-status span').textContent;
    const count = bookCard.querySelector('.book-count span').textContent.replace('available amount: ', '');
    const coverImage = bookCard.querySelector('.book-cover img').src;
    const description = bookCard.querySelector('.book-description').textContent || 'No description available.';
    
    // Get ISBN from data attribute (you may need to add this to your book cards)
    const isbn = bookCard.getAttribute('data-isbn') || 'N/A';
    
    // Populate modal with book details
    document.getElementById('modalBookImage').src = coverImage;
    document.getElementById('modalBookTitle').textContent = title;
    document.getElementById('modalBookAuthor').textContent = author;
    document.getElementById('modalBookCategory').textContent = category;
    document.getElementById('modalBookISBN').textContent = isbn;
    document.getElementById('modalBookPages').textContent = pages;
    document.getElementById('modalBookStatus').textContent = status;
    document.getElementById('modalBookCount').textContent = count;
    document.getElementById('modalBookDescription').textContent = description;
    
    
    // Show/hide borrow button based on availability
    const borrowBtn = document.getElementById('modalBorrowBtn');
    if (status === 'Available') {
        borrowBtn.style.display = 'block';
        borrowBtn.setAttribute('data-book-id', bookId);
    } else {
        borrowBtn.style.display = 'none';
    }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking the X button
    document.getElementById('modalClose').addEventListener('click', closeModal);
    
    // Close modal when clicking the Close button
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal content
    document.getElementById('bookModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Handle borrow button click in the modal
    document.getElementById('modalBorrowBtn').addEventListener('click', function() {
        const bookId = this.getAttribute('data-book-id');
        console.log('Borrowing book ID:', bookId);
        // You can redirect to a borrow page or make an AJAX request
    });
});