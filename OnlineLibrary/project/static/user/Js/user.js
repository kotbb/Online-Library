document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .btn-primary');
    const booksContainer = document.getElementById('booksContainer');
    
    // Debounce function to prevent excessive searches while typing
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // Create a single debounced search function
    const debouncedSearch = debounce(performSearch, 300);
    
    // Live search functionality - trigger search as user types
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
           
            resetSearch();
        } else {
            debouncedSearch();
        }
    });
    
    // Also keep the button functionality for accessibility
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
                card.style.display = ''; // Ensure display is reset
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
                // Force hide for immediate effect
                card.style.display = 'none';
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
            
            // Make sure display property is reset
            card.style.display = '';
            
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
    
    // Simple notification function
    function showNotification(message, type = 'info') {
        // Check if a notification already exists and remove it
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Book Modal Functionality
    const bookModal = document.getElementById('bookModal');
    const modalClose = document.getElementById('modalClose');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBorrowBtn = document.getElementById('modalBorrowBtn');
    
    // Open book modal with details
    window.openBookModal = function(bookId) {
        const bookCard = document.querySelector(`.book-card [data-book-id="${bookId}"]`).closest('.book-card');
        
        // Get book details from the card
        const title = bookCard.querySelector('.book-title').textContent;
        const author = bookCard.querySelector('.book-author').textContent;
        const category = bookCard.querySelector('.book-category')?.textContent || 'Not specified';
        const isbn = bookCard.querySelector('.book-isbn')?.textContent || 'Not specified';
        const pages = bookCard.querySelector('.book-pages')?.textContent || 'Not specified';
        const status = bookCard.querySelector('.book-status span')?.textContent || 'Unknown';
        const count = bookCard.querySelector('.book-count span')?.textContent || 'Not available';
        const description = bookCard.querySelector('.book-description')?.textContent || 'No description available.';
        const imageSrc = bookCard.querySelector('.book-cover img')?.src || '';
        
        // Populate modal with book details
        document.getElementById('modalBookTitle').textContent = title;
        document.getElementById('modalBookAuthor').textContent = author;
        document.getElementById('modalBookCategory').textContent = category.replace('Category: ', '');
        document.getElementById('modalBookISBN').textContent = isbn.replace('ISBN: ', '');
        document.getElementById('modalBookPages').textContent = pages.replace('Pages: ', '');
        document.getElementById('modalBookStatus').textContent = status;
        document.getElementById('modalBookCount').textContent = count.replace('available amount: ', '');
        document.getElementById('modalBookDescription').textContent = description;
        document.getElementById('modalBookImage').src = imageSrc;
        
        // Show/hide borrow button based on availability and set form action
        const modalBorrowForm = document.getElementById('modalBorrowForm');
        if (bookCard.querySelector('.book-status').classList.contains('available')) {
            modalBorrowBtn.style.display = 'block';
            modalBorrowForm.action = `/borrow-book/${bookId}/`;
        } else {
            modalBorrowBtn.style.display = 'none';
        }
        
        // Show modal with animation
        bookModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close modal events
    modalClose.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);
    bookModal.addEventListener('click', function(e) {
        if (e.target === bookModal) {
            closeModal();
        }
    });
    
    function closeModal() {
        bookModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Borrow book functionality
    modalBorrowBtn.addEventListener('click', function() {
        const bookId = this.getAttribute('data-book-id');
        // Implement your borrow logic here
        showNotification(`Book with ID ${bookId} has been borrowed successfully!`, 'success');
        closeModal();
    });
});
