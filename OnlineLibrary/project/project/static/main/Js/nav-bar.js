document.addEventListener("DOMContentLoaded", function () {
    let allPath = window.location.pathname.split('/');
    let currentUrl = allPath.pop();
    let adminUrls = ['AddBook.html','view-available.html','EditBook.html'];
    if(adminUrls.includes(currentUrl)){
        let adminPage = document.getElementById('admin');
        adminPage.classList.add('nav-active');
    }
});
