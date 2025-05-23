// Function to get CSRF token from cookies
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

// Function to update theme icon
function updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '<span>🌙</span>' : '<span>🌞</span>';
    }
}

function toggleTheme() {
    fetch('/toggle-theme/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.body.classList.toggle('dark-theme');
            updateThemeIcon(data.theme === 'dark');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        let isDark = document.body.classList.contains('dark-theme');
        updateThemeIcon(isDark);
        themeToggle.addEventListener('click', toggleTheme);
    }
});
