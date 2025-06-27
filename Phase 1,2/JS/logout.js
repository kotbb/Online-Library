// To log out by deletin the current user in storage and redirect to homePage
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');            
            window.location.href = 'HomePage.html';
        });
    }
});