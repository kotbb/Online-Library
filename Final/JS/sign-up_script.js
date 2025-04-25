document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();


        const username = document.getElementById("username").value.trim();
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;
        const accountType = document.getElementById("account_type").value;

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const user = {
            username,
            email,
            password,
            accountType
        };

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert("Email is already registered.");
            return window.location.href = 'login.html';
        }

        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(user));

        if (accountType === 'admin') {
            return window.location.href = 'admin-dashboard.html';
        } else {
            return window.location.href = 'user.html';
        }
    });
});
