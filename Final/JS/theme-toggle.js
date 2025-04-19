document.addEventListener('DOMContentLoaded',function()
{
    let themeToggle = document.getElementById('themeToggle');
    let body = document.body;
    let currentTheme = localStorage.getItem('theme');

    if(currentTheme === 'dark')
    {
        body.setAttribute('data-theme','dark')
        themeToggle.innerHTML = '<span>🌙</span>';
    }else{
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<span>🌞</span>';;
    }
    themeToggle.addEventListener('click', function() {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<span>🌞</span>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<span>🌙</span>';
        }
    });
    
})