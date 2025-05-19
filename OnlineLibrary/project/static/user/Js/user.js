document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .btn-primary');
    const booksContainer = document.getElementById('booksContainer');
    
    // Modal Elements
    const modal = document.getElementById('bookModal');
    const modalClose = document.getElementById('modalClose');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBorrowBtn = document.getElementById('modalBorrowBtn');
    
    // Modal Content Elements
    const modalBookTitle = document.getElementById('modalBookTitle');
    const modalBookAuthor = document.getElementById('modalBookAuthor');
    const modalBookCategory = document.getElementById('modalBookCategory');
    const modalBookISBN = document.getElementById('modalBookISBN');
    const modalBookPages = document.getElementById('modalBookPages');
    const modalBookStatus = document.getElementById('modalBookStatus');
    const modalBookDescription = document.getElementById('modalBookDescription');
    const modalBookImage = document.getElementById('modalBookImage');
    
    // Current book ID for borrowing
    let currentBookId = null;
    
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
    
    // Add click event listeners to view details buttons
    function setupViewDetailsButtons() {
        const viewDetailsButtons = document.querySelectorAll('.view-details');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                fetchBookDetails(bookId);
            });
        });
    }
    
    // Add click event listeners to borrow buttons
    function setupBorrowButtons() {
        const borrowButtons = document.querySelectorAll('.borrow-book');
        borrowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                borrowBook(bookId);
            });
        });
    }
    
    // Fetch book details from API
    function fetchBookDetails(bookId) {
        fetch(`/book-details/${bookId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                showBookDetailsModal(data);
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
                alert('Error loading book details. Please try again.');
            });
    }
    
    // Show book details in modal
    function showBookDetailsModal(book) {
        // Set current book ID for borrowing
        currentBookId = book.id;
        
        // Populate modal with book details
        modalBookTitle.textContent = book.title;
        modalBookAuthor.textContent = `by ${book.author}`;
        modalBookCategory.textContent = book.category || 'Unknown';
        modalBookISBN.textContent = book.isbn || 'N/A';
        modalBookPages.textContent = book.pages || 'N/A';
        
        // Set status with proper styling
        const statusText = book.status === 'available' ? 'Available' : 'Not Available';
        modalBookStatus.textContent = statusText;
        modalBookStatus.className = book.status === 'available' ? 'available-status' : 'unavailable-status';
        
        // Set description
        modalBookDescription.textContent = book.description || 'No description available.';
        
        // Set book cover image
        if (book.cover_image) {
            modalBookImage.src = book.cover_image;
            modalBookImage.alt = book.title;
        } else {
            modalBookImage.src = '/static/img/defaultBookCover.jpg';
            modalBookImage.alt = 'Default Cover';
        }
        
        // Show/hide borrow button based on availability
        modalBorrowBtn.style.display = book.status === 'available' ? 'block' : 'none';
        
        // Show modal with animation
        modal.classList.add('active');
    }
    
    // Borrow book functionality
    function borrowBook(bookId) {
        // Create a CSRF token for Django
        const csrfToken = getCookie('csrftoken');
        
        fetch(`/borrow-book/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update UI to reflect borrowed status
                const bookCard = document.querySelector(`.book-card button[data-book-id="${bookId}"]`).closest('.book-card');
                const statusElement = bookCard.querySelector('.book-status');
                
                if (statusElement) {
                    statusElement.className = 'book-status unavailable';
                    const statusSpan = statusElement.querySelector('span');
                    if (statusSpan) statusSpan.textContent = 'Not Available';
                }
                
                // Remove borrow button
                const borrowButton = bookCard.querySelector('.borrow-book');
                if (borrowButton) borrowButton.remove();
                
                // Show success message
                showNotification('Book borrowed successfully! You can find it in your profile.', 'success');
                
                // Close modal
                closeModal();
                
            } else {
                // Show error message
                showNotification(data.message || 'Error borrowing book.', 'error');
            }
        })
        .catch(error => {
            console.error('Error borrowing book:', error);
            showNotification('Error borrowing book. Please try again.', 'error');
        });
    }
    
    // Close modal when clicking close button or outside modal
    modalClose.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        currentBookId = null;
    }
    
    // Modal Borrow button click handler
    modalBorrowBtn.addEventListener('click', function() {
        if (currentBookId) {
            borrowBook(currentBookId);
        }
    });
    
    // Helper function to get CSRF token from cookies
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
    
    // Show notification function
    function showNotification(message, type) {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        notification.appendChild(closeBtn);
        notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Setup event listeners for view details and borrow buttons
    setupViewDetailsButtons();
    setupBorrowButtons();
    
    // Add keyboard support for modal (ESC key to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

