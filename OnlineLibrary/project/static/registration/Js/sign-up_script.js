document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        const password = document.getElementById("password1").value;
        const confirmPassword = document.getElementById("password2").value;

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            event.preventDefault();
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            event.preventDefault();
            return;
        }
    });
});