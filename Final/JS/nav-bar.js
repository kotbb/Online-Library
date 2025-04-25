const user = JSON.parse(localStorage.getItem('currentUser')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

// Load navBar with the type of the logged-in user
document.addEventListener("DOMContentLoaded", function () {
    let logo = document.getElementById('logo');
    let navLinks = document.getElementById('navLinks');
     // Add book icon next to the Online Library text
     logo.innerHTML = ' <img src="./img/icon.png" alt="icon" style="width: 20px;height: 20px;"> Online Library';
    if(user && user.accountType === 'admin'){
        logo.href = 'admin-dashboard.html'; 
        const adminLinks = 
        `
        <a href="admin-dashboard.html" id="admin">Admin</a>
        <a href="profile.html" id="profile">Profile</a>
        `;
        navLinks.insertAdjacentHTML('afterbegin',adminLinks);
    }
    else if(user && user.accountType == 'user'){
        logo.href = 'user.html';
        
        const userLinks = `
            <a href="Borrow_Book.html" id="myBooks">My Books</a>
            <a href="profile.html" id="profile">Profile</a>
            <a href="user.html" id="user">User</a>
        `
        navLinks.insertAdjacentHTML('afterbegin', userLinks);
    }
    // Make the shown page is active with some border and font
    let allPath = window.location.pathname.split('/');
    let currentUrl = allPath.pop();
    document.querySelectorAll('.nav-links a').forEach(function(link){
        link.classList.remove('nav-active');
        let linkUrl = link.getAttribute('href');
        if(currentUrl === 'AddBook.html' || currentUrl === 'view-available.html'|| currentUrl === 'EditBook.html')
        {
            if(linkUrl === 'admin-dashboard.html')
                link.classList.add('nav-active');
        }
        else if(currentUrl === linkUrl)
        {
            link.classList.add('nav-active');
        }
    })
})
