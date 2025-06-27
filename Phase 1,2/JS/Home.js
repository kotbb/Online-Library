document.addEventListener('DOMContentLoaded',function(){
    let borrowBtns = document.querySelectorAll('.borrow-btn');
    let viewBooks = document.getElementById('viewBooks');
    borrowBtns.forEach( btn => btn.addEventListener('click',function(){
        window.location.href = 'login.html';
    }))
    viewBooks.addEventListener('click',function(){
        window.location.href = 'login.html';

    })
})
