document.addEventListener('DOMContentLoaded',function()
{
    let themeToggle = document.getElementById('themeToggle');
    let body = document.body;
    let currentTheme = localStorage.getItem('theme');

    if(currentTheme === 'dark')
    {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<span>🌙</span>';
    }else{
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<span>🌞</span>';
    }
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<span>🌞</span>';
        } else {
            body.classList.add('dark-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<span>🌙</span>';
        }
    });
    
})
