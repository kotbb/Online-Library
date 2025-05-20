const deleteAll_btn = document.getElementById('deleteAll-btn');
const confirmText = document.getElementById('modal-message');
const confirmBtn = document.getElementById('confirmDelete');
const cancelBtn = document.getElementById('cancelDelete');
const modal = document.getElementById('deleteModal');
const deleteAllForm = document.getElementById('deleteAllForm');
const selectAllCheckbox = document.getElementById('selectAllBooks');
let isDeleteAll = false;

// Function to handle showing all books or only user's books
function updateTableVisibility() {
    const allBookRows = document.querySelectorAll('#booksTbody tr');
    const currentUsername = document.querySelector('.user-username').textContent;
    
    allBookRows.forEach(row => {
        const addedBy = row.querySelector('td:nth-last-child(2)').textContent;
        if (selectAllCheckbox.checked) {
            // Show all books
            row.classList.remove('not-user-book');
            row.style.display = 'table-row';
        } else {
            // Only show user's books
            if (addedBy === currentUsername) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
    showDeleteAllBtn();
}

// Show/hide deleteAll button based on number of visible books
function showDeleteAllBtn() {
    const visibleBooks = document.querySelectorAll('#booksTbody tr:not([style*="display: none"])').length;
    console.log(visibleBooks);
    if (visibleBooks) {
        deleteAll_btn.innerHTML = `Delete All (${visibleBooks})`;
        deleteAll_btn.style.display = 'block';
    } else {
        deleteAll_btn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateTableVisibility();
    
});
// Handle checkbox changes
selectAllCheckbox.addEventListener('change', function() {
    updateTableVisibility();
});

// Delete All books function
deleteAll_btn.addEventListener('click', function() {
    // this part selects elements that do NOT have display: none in their style
    const visibleBooks = document.querySelectorAll('#booksTbody tr:not([style*="display: none"])').length;
    if (visibleBooks !== 0) {
        confirmText.innerHTML = `Are you sure you want to delete <strong>all the (${visibleBooks}) books</strong>?`;
        modal.classList.add('active');
        isDeleteAll = true;
    }
});

let currentDeleteFormId = null;

function showDeleteModal(bookTitle, bookId) {
    confirmText.textContent = `Are you sure you want to delete "${bookTitle}"?`;
    modal.classList.add('active');
    currentDeleteFormId = bookId;
    isDeleteAll = false;
}

cancelBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    currentDeleteFormId = null;
    isDeleteAll = false;
});

confirmBtn.addEventListener('click', function() {
    if (isDeleteAll) {
        deleteAllForm.submit();
    } else if (currentDeleteFormId) {
        document.getElementById(`deleteForm-${currentDeleteFormId}`).submit();
    }
    modal.classList.remove('active');
    currentDeleteFormId = null;
    isDeleteAll = false;
});


