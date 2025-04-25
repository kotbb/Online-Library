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