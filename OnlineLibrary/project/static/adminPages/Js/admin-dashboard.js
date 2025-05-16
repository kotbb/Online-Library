
const deleteAll_btn = document.getElementById('deleteAll-btn');
const confirmText = document.getElementById('modal-message');
const confirmBtn = document.getElementById('confirmDelete');
const cancelBtn = document.getElementById('cancelDelete');
const editBtn = document.getElementById('btn-edit');
const modal = document.getElementById('deleteModal');
let deleteId = null;

// Show/hide deleteAll button based on number of books
function showDeleteAll() {
    const bookCount = document.querySelectorAll('#booksTbody tr').length;
    if (bookCount) {
        deleteAll_btn.innerHTML = `Delete All (${bookCount})`;
        deleteAll_btn.style.display = 'block';
    } else {
        deleteAll_btn.style.display = 'none';
    }
}
showDeleteAll();

// Delete single book
function deleteData(id) {
    deleteId = id;
    const bookName = document.querySelector(`tr[data-book-id="${id}"] td:nth-child(2)`).textContent;
    modal.classList.add('active');
    confirmText.innerHTML = `Are you sure you want to delete <strong>"${bookName}"</strong> book?`;
}

// Cancel delete
cancelBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    deleteId = null;
});

// Confirm delete
confirmBtn.addEventListener('click', function() {
    if (deleteId !== null) {
        // Send delete request to Django
        fetch(`/delete-book/${deleteId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                messages.error('Error deleting book');
            }
        })
        .catch(error => {
            messages.error('Error deleting book');
        });
    } else {
        // Delete all books
        fetch('/delete-all-books/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                messages.error('Error deleting all books');
            }
        })
        .catch(error => {
            messages.error('Error deleting all books');
        });
    }
    modal.classList.remove('active');
    deleteId = null;
});

// Delete All books function
deleteAll_btn.addEventListener('click', function() {
    const bookCount = document.querySelectorAll('#booksTbody tr').length;
    if (bookCount !== 0) {
        confirmText.innerHTML = `Are you sure you want to delete <strong>all the (${bookCount}) books</strong>?`;
        modal.classList.add('active');
    }
});


// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // check if the cookie name is the same as the name, csrftoken=abc123
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//--------------------------------------------------------------
//          *************** Edit Books ***************

// load edit page with the book
/* let editData = function(i) {
    localStorage.setItem("editIndex", i);
    window.location.href = 'EditBook.html';
     
} */


