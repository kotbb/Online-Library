window.openBookModal = function(bookId) {
    const bookCard = document.querySelector(`.book-card [data-book-id="${bookId}"]`).closest('.book-card');
    
    // Get book details from the card - handle borrowed books page structure
    const title = bookCard.querySelector('h3')?.textContent || 'Unknown Title';
    const author = bookCard.querySelector('.author')?.textContent || 'Unknown Author';
    const category = bookCard.querySelector('.description')?.textContent || 'Not specified';
    const borrowedDate = bookCard.querySelector('.book-details')?.textContent || '';
    const imageSrc = bookCard.querySelector('.book-cover img')?.src || '';
    
    const isbn = bookCard.querySelector('.book-isbn')?.textContent || 'Not specified';
    const pages = bookCard.querySelector('.book-pages')?.textContent || 'Not specified';
    const status = 'Borrowed';
    const description = bookCard.querySelector('.book-description')?.textContent || 'No description available.';
    
    // Populate modal with book details - only set elements that exist
    const modalElements = {
        'modalBookTitle': title,
        'modalBookAuthor': author,
        'modalBookCategory': category.replace('Category: ', ''),
        'modalBookISBN': isbn.replace('ISBN: ', ''),
        'modalBookPages': pages.replace('Pages: ', ''),
        'modalBookStatus': status,
        'modalBookDescription': description,
        'modalBookImage': imageSrc
    };
    
    // Set each element only if it exists
    Object.keys(modalElements).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            if (elementId === 'modalBookImage') {
                element.src = modalElements[elementId];
            } else {
                element.textContent = modalElements[elementId];
            }
        }
    });
    
    // Handle borrowed date if the element exists
    const borrowedDateElement = document.getElementById('modalBookBorrowedDate');
    if (borrowedDateElement) {
        borrowedDateElement.textContent = borrowedDate.replace('Borrowed on: ', '');
    }
    
    // Handle days remaining in modal
    const modalDaysRemainingElement = document.getElementById('modalBookDaysRemaining');
    if (modalDaysRemainingElement) {
        const daysRemainingElement = bookCard.querySelector('.days-remaining');
        if (daysRemainingElement) {
            const remainingCountSpan = daysRemainingElement.querySelector('.remaining-count');
            if (remainingCountSpan) {
                modalDaysRemainingElement.textContent = remainingCountSpan.textContent;
            }
        }
    }
    
    // Set the form action for return functionality
    const modalReturnForm = document.getElementById('modalReturnForm');
    if (modalReturnForm) {
        modalReturnForm.action = `/return-book/${bookId}/`;
        const modalBookId = document.getElementById('modalBookId');
        if (modalBookId) {
            modalBookId.value = bookId;
        }
    }
    
    // Show modal with animation
    const bookModal = document.getElementById('bookModal');
    if (bookModal) {
        bookModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Calculate and display days remaining for all borrowed books
    calculateDaysRemaining();
    
    const bookModal = document.getElementById('bookModal');
    const modalClose = document.getElementById('modalClose');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (bookModal) {
        bookModal.addEventListener('click', function(e) {
            if (e.target === bookModal) {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        if (bookModal) {
            bookModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    const modalReturnForm = document.getElementById('modalReturnForm');
    if (modalReturnForm) {
        modalReturnForm.addEventListener('submit', function(e) {
            // The form will submit normally to the Django view
            closeModal();
        });
    }
    
    // Function to calculate days remaining for all books
    function calculateDaysRemaining() {
        const daysRemainingElements = document.querySelectorAll('.days-remaining');
        
        daysRemainingElements.forEach(element => {
            const borrowedDateStr = element.getAttribute('data-borrowed-date');
            const remainingCountSpan = element.querySelector('.remaining-count');
            
            if (borrowedDateStr && remainingCountSpan) {
                const borrowedDate = new Date(borrowedDateStr);
                const today = new Date();
                const dueDate = new Date(borrowedDate);
                dueDate.setDate(borrowedDate.getDate() + 14); // Add 14 days
                
                const timeDiff = dueDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if (daysRemaining > 0) {
                    remainingCountSpan.textContent = daysRemaining;
                } else if (daysRemaining === 0) {
                    remainingCountSpan.textContent = 'Due today!';
                } else {
                    remainingCountSpan.textContent = `${Math.abs(daysRemaining)} days overdue`;
                    element.style.color = '#dc3545'; // Red for overdue
                }
            }
        });
    }
});