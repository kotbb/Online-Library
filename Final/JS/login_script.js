const loginForm = document.querySelector('form');

const maxAttempts = 3;
let attempts = 0;

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            alert('No account found with this email address. Please sign up.');
            return window.location.href = 'sign-up.html';
        }

        if (password === user.password) {
            attempts = 0;
            localStorage.setItem("currentUser", JSON.stringify(user));

            if (user.accountType === 'admin') {
                return window.location.href = 'admin-dashboard.html';
            } else {
                return window.location.href = 'user.html';
            }
        } else {
            attempts++;
            if (attempts < maxAttempts) {
                alert(`Incorrect password. You have ${maxAttempts - attempts} attempts remaining.`);
            } else {
                alert('Too many incorrect password attempts. Please try again later.');
                window.location.href = 'HomePage.html';
            }
        }
    });
}
